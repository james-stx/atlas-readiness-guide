import { Resend } from 'resend';

let _resend: Resend | null = null;

/** Lazy-initialised Resend client — avoids throwing at module load during build. */
export function getResendClient(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY environment variable');
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Atlas Readiness Guide <atlas@updates.stxlabs.io>',
  replyTo: 'hello@stxlabs.io',
};
