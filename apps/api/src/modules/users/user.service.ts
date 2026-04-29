import { prisma } from '@repo/database';
import { type UpdateOpenAIInput, type UpdateUserInput } from '@repo/validators';

export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      plan: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUserById = async (userId: string, data: UpdateUserInput) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      plan: true,
      updatedAt: true,
    },
  });
};

export const softDeleteUserById = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
};

export const updateOpenAIKey = async (userId: string, data: UpdateOpenAIInput) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      openAiKey: data.openAiKey,
    },
  });
};
