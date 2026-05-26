import { Resend } from 'resend';
import { emailConfig } from '@repo/config';
import { logger } from '@repo/logger';

const resend = new Resend(emailConfig.apiKey);
const from = emailConfig.from;

export const sendEmail = async (to: string, subject: string, html: any) => {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
  if (error) {
    logger.error('Error sending email');
    throw new Error(error.message);
  }
  logger.info({ emailId: data?.id }, 'Email sent Successfully');
};
