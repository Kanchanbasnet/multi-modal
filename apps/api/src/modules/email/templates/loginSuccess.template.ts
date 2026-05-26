import { layout } from './layout.template';

export const successLoginTemplate = (email: string) => {
  const name = email.split('@')[0];
  const content = `
    <p>Dear ${name},</p>
    <p>You have successfully logged in.</p>
    <p>If this wasn't you, contact us immediately.</p>
    `;
  return layout(content);
};
