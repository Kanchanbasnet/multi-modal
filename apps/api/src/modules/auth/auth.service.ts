import { authConfig } from '@repo/config';
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

// Google Auth
export const getGoogleAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: authConfig.googleAuth.clientId,
    redirect_uri: authConfig.googleAuth.callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const exchangeCodeForAccessToken = async (code: string): Promise<string> => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: authConfig.googleAuth.clientId,
      client_secret: authConfig.googleAuth.clientSecret,
      redirect_uri: authConfig.googleAuth.callbackUrl,
      grant_type: 'authorization_code',
    }),
  });

  const data = (await response.json()) as { access_token: string };

  if (!response.ok) {
    throw new Error('Failed to exchange code for access token');
  }

  return data.access_token;
};

type GoogleUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

const getGoogleUser = async (accessToken: string): Promise<GoogleUser> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info from Google');
  }

  return response.json() as Promise<GoogleUser>;
};

const findOrCreateGoogleUser = async (googleUser: GoogleUser) => {
  let user = await prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.picture,
        authProviders: {
          create: {
            provider: 'GOOGLE',
            providerId: googleUser.id,
          },
        },
      },
    });
  } else {
    await prisma.userAuthProvider.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: 'GOOGLE',
        },
      },
      update: { providerId: googleUser.id },
      create: {
        userId: user.id,
        provider: 'GOOGLE',
        providerId: googleUser.id,
      },
    });
  }

  return user;
};

export const handleGoogleCallback = async (
  code: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  const accessToken = await exchangeCodeForAccessToken(code);
  const googleUser = await getGoogleUser(accessToken);
  const user = await findOrCreateGoogleUser(googleUser);

  const rawSessionToken = crypto.randomBytes(32).toString('hex');
  const sessionTokenHash = hashToken(rawSessionToken);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRES_TIME * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: sessionTokenHash,
      expiresAt,
      ...(ipAddress !== undefined && { ipAddress }),
      ...(userAgent !== undefined && { userAgent }),
    },
  });

  return { token: rawSessionToken };
};

export const logout = async (tokenHash: string) => {
  await prisma.session.deleteMany({ where: { tokenHash } });
};
