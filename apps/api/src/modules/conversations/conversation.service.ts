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
