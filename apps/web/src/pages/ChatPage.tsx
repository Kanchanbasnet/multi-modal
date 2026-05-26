import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveConversation } from '../store/slices/conversationSlice';
import { fetchConversations } from '../store/thunks/conversationThunks';
import { Sidebar } from '../components/Sidebar';
import { ChatWindow } from '../components/ChatWindow';

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const { conversationId } = useParams<{ conversationId: string }>();
  const activeId = useAppSelector((s) => s.conversation.activeId);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (conversationId) {
      dispatch(setActiveConversation(conversationId));
    }
  }, [conversationId, dispatch]);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar placeholder */}
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
