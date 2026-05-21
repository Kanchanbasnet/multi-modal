import { OpenAI } from 'openai';
import { openaiConfig } from '@repo/config';
import { type ChatCompletionInput } from '@repo/validators';
import type { ChatCompletionMessageParam } from 'openai/resources';

import { type Response } from 'express';
import { closeSSeEvent, initSSE, sendSSEevent } from '../../utils/sse';
import {
  getMessagesByConversationId,
  linkFileToMessage,
  saveMessage,
} from '../conversations/conversation.service';

const openai = new OpenAI({
  apiKey: openaiConfig.openaiApiKey,
});

export async function getChat(input: ChatCompletionInput, res: Response) {
  initSSE(res);

  try {
    const userMessage = await saveMessage(input.conversationId, 'USER', input.message);

    if (input.fileId) {
      await linkFileToMessage(userMessage.id, input.fileId);
    }
    const history = await getMessagesByConversationId(input.conversationId);

    const chatHistory: ChatCompletionMessageParam[] = history.map((history) => {
      const role = history.role.toLowerCase() as 'user' | 'assistant' | 'system';
      const image = history.files.find((f) => f.fileType === 'IMAGE');
      const document = history.files.find((f) => f.fileType === 'DOCUMENT');

      if (role === 'user' && image) {
        return {
          role: 'user' as const,
          content: [
            { type: 'text' as const, text: history.content },
            { type: 'image_url' as const, image_url: { url: image.url } },
          ],
        };
      }

      if (role === 'user' && document && document.extractedText) {
        return {
          role: 'user' as const,
          content: [
            { type: 'text' as const, text: history.content },
            { type: 'text' as const, text: `Document content:\n${document.extractedText}` },
          ],
        };
      }

      return { role, content: history.content };
    });

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
