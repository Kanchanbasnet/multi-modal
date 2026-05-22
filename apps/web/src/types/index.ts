export type ConversationStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL';
export type MessageStatus = 'PENDING' | 'STREAMING' | 'COMPLETED' | 'FAILED';
export type FileType = 'IMAGE' | 'DOCUMENT' | 'AUDIO';
export type FileStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
export type UserPlan = 'FREE' | 'PRO';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  plan?: UserPlan;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  status: ConversationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  model?: string;
  promptTokens?: number;
  completionToken?: number;
  totalTokens?: number;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadedFile {
  id: string;
  conversationId: string;
  messageId?: string;
  fileType: FileType;
  fileStatus: FileStatus;
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
  extractedText?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | { success: false; error: string };
