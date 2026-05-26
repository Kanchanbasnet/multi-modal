import { useState } from 'react';
import { type Message } from '../../types';
import { sendMessage } from '../../services/chat.service';

export const useChat = (
  conversationId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const submitMessage = async (text: string, fileId?: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      conversationId,
      role: 'USER',
      content: text,
      status: 'COMPLETED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const assistantId = 'streaming-' + Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        conversationId,
        role: 'ASSISTANT',
        content: '',
        status: 'STREAMING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    setIsStreaming(true);

    try {
      await sendMessage(
        conversationId,
        text,
        'gpt-4o-mini',
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
          );
        },
        fileId,
      );
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, status: 'COMPLETED' } : m)),
      );
      setIsStreaming(false);
    }
  };

  return { submitMessage, isStreaming };
};
