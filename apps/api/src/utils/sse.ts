import { type Response } from 'express';

export function initSSE(res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
}

export function sendSSEevent(res: Response, event: string, data: string): void {
  res.write(`event: ${event}\ndata:${JSON.stringify(data)}\n\n`);
}

export function closeSSeEvent(res: Response): void {
  res.write(`event: Done\ndata: Done\n\n`);
  res.end();
}
