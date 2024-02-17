import { type NextRequest } from 'next/server'
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { OpenAiChatPayload } from '@/types'

export const runtime = 'edge'

export async function POST(req: NextRequest): Promise<Response> {
  const { model, messages } = (await req.json()) as OpenAiChatPayload

  const payload: CreateChatCompletionRequest = {
    model,
    messages,
    stream: true,
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(config)

  const response = await openai.createChatCompletion(payload)
  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
