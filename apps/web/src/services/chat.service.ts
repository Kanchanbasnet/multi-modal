export const sendMessage = async (
  conversationId: string,
  message: string,
  model: string,
  onChunk: (chunk: string) => void,
  fileId?: string,
) => {
  const response = await fetch('/api/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ conversationId, message, model, ...(fileId && { fileId }) }),
  });

  if (!response.ok) throw new Error('Failed to send message');

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split('\n');
    let currentEvent = '';

    for (const line of lines) {
      if (line.startsWith('event:')) {
        currentEvent = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        if (currentEvent === 'chunk') {
          const data = JSON.parse(line.slice(5));
          onChunk(data);
        }
      }
    }
  }
};
