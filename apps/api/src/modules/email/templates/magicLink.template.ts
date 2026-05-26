import { layout } from './layout.template';

export const magicLinkTemplate = (email: string, magicLink: string) => {
  const name = email.split('@')[0];
  const content = `
   <p>Dear ${name},</p>
    <p>Here is your sign in link...</p>
    <a href="${magicLink}" style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Sign In</a>
<p style="color: #6b7280; font-size: 13px;">This link expires in 20 minutes. If you didn't request this, ignore this email.</p>


    `;
  return layout(content);
};
