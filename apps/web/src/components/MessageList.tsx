import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { type Message } from '../types';

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export const MessageList = ({ messages, isLoading }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
        Loading...
      </div>
    );

  if (messages.length === 0)
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
        Start a conversation
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-end gap-2 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'USER'
                ? 'bg-white text-black rounded-br-sm'
                : 'bg-zinc-900 text-zinc-100 rounded-bl-sm'
            }`}
          >
            {/* markdown for assistant, plain text for user */}
            {msg.role === 'ASSISTANT' ? (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                  ),
                  code: ({ children }) => (
                    <code className="bg-zinc-800 px-1 py-0.5 rounded text-xs font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-zinc-800 p-3 rounded-lg overflow-x-auto mb-2 text-xs font-mono">
                      {children}
                    </pre>
                  ),
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            ) : (
              msg.content
            )}
            {msg.status === 'STREAMING' && (
              <span className="inline-block w-1.5 h-4 bg-zinc-400 ml-1 animate-pulse" />
            )}
          </div>
        </div>
      ))}

      {/* scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};
