import { useAppSelector } from '../store/hooks';
import { useMessages } from '../hooks/messages/useMessages';
import { useChat } from '../hooks/chat/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatWindow = () => {
  const activeId = useAppSelector((s) => s.conversation.activeId);
  const { messages, setMessages, isLoading } = useMessages(activeId);
  const { submitMessage, isStreaming } = useChat(activeId ?? '', setMessages);
  if (!activeId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <p className="text-zinc-600 text-sm">Select a conversation or start a new one</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-black">
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSubmit={submitMessage} isStreaming={isStreaming} conversationId={activeId} />
    </div>
  );
};
