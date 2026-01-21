import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('Missing RESEND_API_KEY - email sending will fail');
}

export const resend = new Resend(process.env.RESEND_API_KEY || '');

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Atlas Readiness Guide <atlas@updates.stxlabs.io>',
  replyTo: 'hello@stxlabs.io',
};
