import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import {
  archiveConversation,
  deleteConversations,
  newConversations,
} from '../store/thunks/conversationThunks';
import { setActiveConversation } from '../store/slices/conversationSlice';
import { Plus, Trash2, Archive } from 'lucide-react';
export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { list, activeId, isLoading } = useAppSelector((s) => s.conversation);
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const handleNew = async () => {
    const result = await dispatch(newConversations());
    if (newConversations.fulfilled.match(result)) {
      navigate(`/chat/${result.payload.id}`);
    }
  };
  const handleSelect = (id: string) => {
    dispatch(setActiveConversation(id));
    navigate(`/chat/${id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(deleteConversations(id));
  };

  const handleArchive = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    dispatch(archiveConversation(conversationId));
  };

  return (
    <div className="w-64 h-screen bg-black border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={handleNew}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black text-sm py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={16} /> New Conversation
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <p className="text-slate-500 text-sm text-center mt-4">Loading...</p>
        ) : list?.length === 0 ? (
          <p className="text-slate-500 text-sm text-center mt-4">No conversations yet</p>
        ) : (
          list?.map((convo) => (
            <div
              key={convo.id}
              onClick={() => handleSelect(convo.id)}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm hover:bg-zinc-900 transition-colors mb-1 ${
                activeId === convo.id ? 'bg-zinc-900 text-white' : 'text-zinc-400'
              }`}
            >
              <span className="truncate flex-1">{convo.title ?? 'New Conversation'}</span>
              <div className="hidden group-hover:flex items-center gap-1 ml-2">
                <button
                  onClick={(e) => handleDelete(e, convo.id)}
                  className="p-1 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={(e) => handleArchive(e, convo.id)}
                  className="p-1 hover:text-slate-200 transition-colors"
                >
                  <Archive size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* User footer */}
      <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs text-black font-medium flex-shrink-0">
          {(user?.name ?? user?.email)?.[0]?.toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          {user?.name && (
            <span className="text-white text-xs font-medium truncate">{user.name}</span>
          )}
          <span className="text-zinc-500 text-xs truncate">{user?.email}</span>
        </div>
      </div>
    </div>
  );
};
