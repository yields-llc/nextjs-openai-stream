import { ChatCompletionRequestMessage } from 'openai-edge'

export interface OpenAiChatPayload {
  model: string
  messages: ChatCompletionRequestMessage[]
}
