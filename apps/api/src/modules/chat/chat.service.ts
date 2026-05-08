import { OpenAI } from 'openai';
import { openaiConfig } from '@repo/config';
import { type ChatCompletionInput } from '@repo/validators';
import { type Response } from 'express';
import { closeSSeEvent, initSSE, sendSSEevent } from '../../utils/sse';

const openai = new OpenAI({
  apiKey: openaiConfig.openaiApiKey,
});

export async function getChat(input: ChatCompletionInput, res: Response) {
  initSSE(res);

  try {
    const stream = await openai.chat.completions.create({
      model: input.model,
      messages: input.messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (text) sendSSEevent(res, 'chunk', text);
    }

    closeSSeEvent(res);
  } catch (error) {
    sendSSEevent(res, 'error', 'Something went wrong');
    res.end();
  }
}
