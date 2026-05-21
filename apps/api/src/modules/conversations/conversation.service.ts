import { prisma } from '@repo/database';

export const newConversation = async (userId: string) => {
  const conversation = await prisma.conversation.create({
    data: {
      userId: userId,
    },
  });
  return conversation;
};

export const getUserConversation = async (userId: string) => {
  const conversation = await prisma.conversation.findMany({
    where: {
      userId: userId,
      status: 'ACTIVE',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return conversation;
};

export const getConversationById = async (conversationId: string, userId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
      userId: userId,
    },
  });

  return conversation;
};

export const getArchiveConversation = async (userId: string) => {
  const conversation = await prisma.conversation.findMany({
    where: {
      userId: userId,
      status: 'ARCHIVED',
    },
  });
  return conversation;
};

export const deleteConversation = async (conversationId: string, userId: string) => {
  await prisma.conversation.update({
    where: {
      id: conversationId,
      userId: userId,
    },
    data: {
      status: 'DELETED',
    },
  });
};

export const archieveConversation = async (conversationId: string, userId: string) => {
  await prisma.conversation.update({
    where: {
      id: conversationId,
      userId: userId,
    },
    data: {
      status: 'ARCHIVED',
    },
  });
};

// Messages

export const saveMessage = async (
  conversationId: string,
  role: 'USER' | 'ASSISTANT',
  content: string,
  model?: string,
  prompt_tokens?: number,
  completion_tokens?: number,
  total_tokens?: number,
) => {
  return await prisma.message.create({
    data: {
      conversationId,
      role,
      content,
      ...(model !== undefined && { model }),
      ...(prompt_tokens !== undefined && { promptTokens: prompt_tokens }),
      ...(completion_tokens !== undefined && { completionToken: completion_tokens }),
      ...(total_tokens !== undefined && { totalTokens: total_tokens }),
    },
  });
};

export const getMessagesByConversationId = async (conversationId: string) => {
  return await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: {
      role: true,
      content: true,
      files: {
        select: {
          url: true,
          fileType: true,
          extractedText: true,
        },
      },
    },
  });
};

export const linkFileToMessage = async (messageId: string, fileId: string) => {
  return await prisma.file.update({
    where: { id: fileId },
    data: {
      messageId,
    },
  });
};

export const setTitle = async (conversationId: string, title: string) => {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      title,
    },
  });
};
