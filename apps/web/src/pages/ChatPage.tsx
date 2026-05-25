import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveConversation } from '../store/slices/conversationSlice';
import { fetchConversations } from '../store/thunks/conversationThunks';

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
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar placeholder */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex items-center justify-center">
        <span className="text-slate-500 text-sm">Sidebar coming soon</span>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {activeId ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Chat window coming soon — conversation: {activeId}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Select a conversation or start a new one
          </div>
        )}
      </div>
    </div>
  );
}
