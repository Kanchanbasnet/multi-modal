import { useEffect, useState } from 'react';
import { Message } from '../../types';
import { getMessages } from '../../services/conversation.service';

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const data = await getMessages(conversationId);
        setMessages(data);
      } catch (error) {
        console.error(`Failed to fetch messages`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  return { messages, setMessages, isLoading };
};
