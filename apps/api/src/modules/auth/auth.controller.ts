import { appConfig } from '@repo/config';
import { type Request, type Response } from 'express';
import * as authService from './auth.service';

export const requestMagicLink = async (req: Request, res: Response): Promise<void> => {
  const baseUrl = appConfig.baseUrl;
  const result = await authService.requestMagicLink(req.body, baseUrl);
  res.status(200).json({ success: true, ...result });
};

export const verifyMagicLink = async (req: Request, res: Response): Promise<void> => {
  const token = req.query['token'];

  if (typeof token !== 'string') {
    res.status(400).json({ success: false, message: 'Token is required.' });
    return;
  }

  const result = await authService.verifyMagicLink({ token }, req.ip, req.get('user-agent'));

  if (!result) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return;
  }
  res.cookie('session', result.token, {
    httpOnly: true,
    secure: appConfig.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.redirect(`${appConfig.frontendUrl}`);
};

export const googleAuth = (_req: Request, res: Response): void => {
  const url = authService.getGoogleAuthUrl();
  res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  const code = req.query['code'];

  if (typeof code !== 'string') {
    res.status(400).json({ success: false, message: 'Code is required' });
    return;
  }

  const result = await authService.handleGoogleCallback(code, req.ip, req.get('user-agent'));
  res.cookie('session', result.token, {
    httpOnly: true,
    secure: appConfig.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  res.redirect(`${appConfig.frontendUrl}`);
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies['session'];
  const tokenHash = authService.hashToken(token);
  await authService.logout(tokenHash);
  res.clearCookie('session', {
    httpOnly: true,
    secure: appConfig.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.status(200).json({ success: true, message: `Logged out successfully.` });
};

export const getMe = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, user: req.user });
};
