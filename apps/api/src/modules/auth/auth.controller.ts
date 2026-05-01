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

  res.status(200).json({ success: true, token: result.token });
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
  res.redirect(`${appConfig.frontendUrl}?token=${result.token}`);
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.slice(7);
  const tokenHash = authService.hashToken(token!);
  await authService.logout(tokenHash);
  res.status(200).json({ success: true, message: `Logged out successfully.` });
};
