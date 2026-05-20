import { OpenAI } from 'openai';
import { openaiConfig } from '@repo/config';
import { type ChatCompletionInput } from '@repo/validators';
import { type Response } from 'express';
import { closeSSeEvent, initSSE, sendSSEevent } from '../../utils/sse';
import { getMessagesByConversationId, saveMessage } from '../conversations/conversation.service';

const openai = new OpenAI({
  apiKey: openaiConfig.openaiApiKey,
});

export async function getChat(input: ChatCompletionInput, res: Response) {
  initSSE(res);

  try {
    await saveMessage(input.conversationId, 'USER', input.message);
    const history = await getMessagesByConversationId(input.conversationId);

    const chatHistory = history.map((history) => ({
      role: history.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: history.content,
    }));

    const stream = await openai.chat.completions.create({
      model: input.model,
      messages: chatHistory,
      stream: true,
    });
    console.log('ChatHistory:::', chatHistory);

    let fullResponse = '';

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (text) {
        fullResponse += text;
        sendSSEevent(res, 'chunk', text);
      }
    }
    await saveMessage(input.conversationId, 'ASSISTANT', fullResponse);

    closeSSeEvent(res);
  } catch (error) {
    sendSSEevent(res, 'error', 'Something went wrong');
    res.end();
  }
}
