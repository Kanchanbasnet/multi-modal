import { useRef, useState } from 'react';
import { Send, Paperclip, X, Mic, AudioLines } from 'lucide-react';
import { uploadFile } from '../services/upload.service';

type Props = {
  onSubmit: (text: string, fileId?: string) => void;
  isStreaming: boolean;
  conversationId: string;
};

export const MessageInput = ({ onSubmit, isStreaming, conversationId }: Props) => {
  const [text, setText] = useState('');
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    try {
      const result = await uploadFile(file, conversationId);
      setFileId(result.fileId);
    } catch (error) {
      console.error('Upload failed', error);
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFileId(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if ((!text.trim() && !fileId) || isStreaming || isUploading) return;
    onSubmit(text.trim(), fileId ?? undefined);
    setText('');
    clearFile();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-black px-4 py-4">
      {/* File preview */}
      {fileName && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-zinc-400 text-xs truncate max-w-xs">{fileName}</span>
          {isUploading && <span className="text-zinc-500 text-xs">uploading...</span>}
          <button onClick={clearFile} className="text-zinc-500 hover:text-zinc-300">
            <X size={12} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 bg-zinc-900 rounded-2xl px-4 py-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.txt,.doc,.docx,.mp3,.wav,.mp4,.webm"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Paperclip button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming}
          className="flex-shrink-0 text-white hover:text-zinc-300 transition-colors disabled:opacity-40"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isStreaming}
          className="flex-1 bg-transparent text-white text-sm placeholder-white resize-none outline-none max-h-40 leading-relaxed disabled:opacity-50"
        />

        {/* Right side icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="text-white hover:text-zinc-300 transition-colors">
            <AudioLines size={18} />
          </button>
          <button className="text-white hover:text-zinc-300 transition-colors">
            <Mic size={18} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={isStreaming || isUploading || (!text.trim() && !fileId)}
            className="p-2 bg-white hover:bg-zinc-200 rounded-xl transition-colors disabled:opacity-40"
          >
            <Send size={16} className="text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
