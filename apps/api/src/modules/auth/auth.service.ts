import { prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { type VerifyMagicLinkInput, type RequestMagicLinkInput } from '@repo/validators';

import crypto from 'crypto';
const MAGIC_LINK_EXPIRY_MINUTES = 20;

export const hashToken = (token: string): string => {
  return crypto.createHash('sha512').update(token).digest('hex');
};
export const requestMagicLink = async (data: RequestMagicLinkInput, baseUrl: string) => {
  const { email } = data;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        authProviders: {
          create: { provider: 'MAGIC_LINK' },
        },
      },
    });
  }

  await prisma.magicLinkToken.deleteMany({
    where: { email, usedAt: null, expiresAt: { gt: new Date() } },
  });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000);

  await prisma.magicLinkToken.create({
    data: { email, userId: user.id, tokenHash: hashedToken, expiresAt },
  });

  const magicLink = `${baseUrl}/api/auth/magic-link/verify?token=${rawToken}`;
  logger.info({ magicLink }, `Magic Link Generated`);
  return {
    message: 'Magic Link Sent. Check Your Email!',
  };
};

const SESSION_EXPIRES_TIME = 7;

export const verifyMagicLink = async (
  data: VerifyMagicLinkInput,
  ipAddress?: string,
  userAgent?: string,
) => {
  const tokenHash = hashToken(data.token);

  const magicToken = await prisma.magicLinkToken.findUnique({
    where: { tokenHash },
  });

  if (!magicToken) {
    return null;
  }
  if (magicToken.expiresAt < new Date()) {
    return null;
  }
  if (magicToken.usedAt) {
    return null;
  }

  await prisma.magicLinkToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });
  const rawSessionToken = crypto.randomBytes(32).toString('hex');
  const sessionTokenHash = hashToken(rawSessionToken);

  const expiresAt = new Date(Date.now() + SESSION_EXPIRES_TIME * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: magicToken.userId!,
      tokenHash: sessionTokenHash,
      expiresAt,
      ...(ipAddress !== undefined && { ipAddress }),
      ...(userAgent !== undefined && { userAgent }),
    },
  });

  return { token: rawSessionToken };
};


export const logout = async(tokenHash: string)=>{
    await prisma.session.deleteMany({where: {tokenHash}})
}