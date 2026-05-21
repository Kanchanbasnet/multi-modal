import { type Request, type Response } from 'express';
import * as userService from './user.service';

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getUserById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  await userService.updateUserById(req.user.id, req.body);
  res.status(200).json({ success: true, message: 'User updated successfully.' });
};

export const updateOpenAIKey = async (req: Request, res: Response): Promise<void> => {
  await userService.updateOpenAIKey(req.user.id, req.body);
  res.status(200).json({ success: true, message: 'Open AI Key updated successfully' });
};

export const softDeleteUserById = async (req: Request, res: Response): Promise<void> => {
  await userService.softDeleteUserById(req.user.id);
  res.status(200).json({ success: true, message: 'User deleted successfully.' });
};
