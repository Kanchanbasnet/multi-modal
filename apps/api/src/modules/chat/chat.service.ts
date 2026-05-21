import { OpenAI } from 'openai';
import { openaiConfig } from '@repo/config';
import { logger } from '@repo/logger';
import { type ChatCompletionInput } from '@repo/validators';
import type { ChatCompletionMessageParam } from 'openai/resources';

import { type Response } from 'express';
import { closeSSeEvent, initSSE, sendSSEevent } from '../../utils/sse';
import {
  getConversationById,
  getMessagesByConversationId,
  linkFileToMessage,
  saveMessage,
  setTitle,
} from '../conversations/conversation.service';

const openai = new OpenAI({
  apiKey: openaiConfig.openaiApiKey,
});

const generateAndSetTitle = async (conversationId: string, firstMessage: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Generate a short conversation title (maximum 6 words, no quotes) for a chat that starts with this message: "${firstMessage}"`,
        },
      ],
    });
    const title = response.choices[0]?.message?.content?.trim() ?? firstMessage.slice(0, 60);
    await setTitle(conversationId, title);
  } catch (error) {
    logger.error({ error }, 'Failed to generate conversation title');
  }
};

export async function getChat(input: ChatCompletionInput, userId: string, res: Response) {
  initSSE(res);

  try {
    const conversation = await getConversationById(input.conversationId, userId);
    if (!conversation) {
      sendSSEevent(res, 'error', 'Conversation not found.');
      res.end();
      return;
    }

    const existingMessage = await getMessagesByConversationId(input.conversationId);
    const isFirstMessage = existingMessage.length === 0;
    const userMessage = await saveMessage(input.conversationId, 'USER', input.message);
    if (isFirstMessage) {
      generateAndSetTitle(input.conversationId, input.message);
    }
    if (input.fileId) {
      await linkFileToMessage(userMessage.id, input.fileId);
    }
    const history = await getMessagesByConversationId(input.conversationId);

    const chatHistory: ChatCompletionMessageParam[] = history.map((history) => {
      const role = history.role.toLowerCase() as 'user' | 'assistant' | 'system';
      const image = history.files.find((f) => f.fileType === 'IMAGE');
      const document = history.files.find((f) => f.fileType === 'DOCUMENT');
      const audio = history.files.find((f) => f.fileType === 'AUDIO');

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
      if (role === 'user' && audio && audio.extractedText) {
        return {
          role: 'user' as const,
          content: [
            { type: 'text' as const, text: history.content },
            { type: 'text' as const, text: `Audio transcript:\n${audio.extractedText}` },
          ],
        };
      }

      return { role, content: history.content };
    });

    const stream = await openai.chat.completions.create({
      model: input.model,
      messages: chatHistory,
      stream: true,
      stream_options: { include_usage: true },
    });

    let fullResponse = '';
    let usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | null =
      null;

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (text) {
        fullResponse += text;
        sendSSEevent(res, 'chunk', text);
      }
      if (chunk.usage) {
        usage = chunk.usage;
      }
    }
    await saveMessage(
      input.conversationId,
      'ASSISTANT',
      fullResponse,
      input.model,
      usage?.prompt_tokens,
      usage?.completion_tokens,
      usage?.total_tokens,
    );

    closeSSeEvent(res);
  } catch (error) {
    sendSSEevent(res, 'error', 'Something went wrong');
    res.end();
  }
}
