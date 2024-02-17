'use client'

import { Button, Form, Input, Spin } from 'antd'
import { useState } from 'react'
import { OpenAiChatPayload } from '@/types'
const { TextArea } = Input

type FormData = {
  model: string
  chat: string
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({ model: 'gpt-4-turbo-preview', chat: '' })
  const [feedback, setFeedback] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  
  const onValuesChange = (_changedFields: any, allFields: FormData) => {
    setFormData(allFields)
  }
  
  const onSubmit = async (formData: FormData) => {
    const payload: OpenAiChatPayload = {
      model: formData.model,
      messages: [
        { role: 'user', content: formData.chat },
      ],
    }
    
    setFeedback('')
    setLoading(true)
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    setLoading(false)
    
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    
    const data = response.body
    if (!data) {
      return
    }
    
    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false
    let buffer = ''
    
    const timer = setInterval(async () => {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      buffer += chunkValue
      setFeedback(buffer)
      if (done) {
        clearTimeout(timer)
      }
    }, 50)
  }
  
  return (
    <>
      <Form initialValues={formData} onFinish={onSubmit} onValuesChange={onValuesChange} colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <h1 style={{ marginBlockEnd: '0' }}>Next.js OpenAI Stream</h1>
        </Form.Item>
        <Form.Item name={'model'} label={'Model'}>
          <Input disabled />
        </Form.Item>
        <Form.Item name={'chat'} label={'Chat'}>
          <TextArea rows={10} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button htmlType={'submit'} type={'primary'}>
            Submit
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <div>{feedback}</div>
        </Form.Item>
      </Form>
      <Spin fullscreen spinning={loading} />
    </>
  );
}
