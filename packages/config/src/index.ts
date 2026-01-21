import { z } from 'zod';

// ============================================
// Environment Configuration
// ============================================

export const serverEnvSchema = z.object({
  // Database
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // AI
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  OPENAI_API_KEY: z.string().startsWith('sk-'),

  // Email
  RESEND_API_KEY: z.string().startsWith('re_'),

  // Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

// ============================================
// Application Constants
// ============================================

export const APP_CONFIG = {
  name: 'Atlas Readiness Guide',
  description: 'U.S. Expansion Readiness Assessment',
  company: 'STX Labs',

  // Session settings
  session: {
    expiryDays: 30,
    maxRecoveryAttempts: 3,
  },

  // Conversation settings
  conversation: {
    maxFollowUpQuestions: 5,
    streamingEnabled: true,
  },

  // Rate limits
  rateLimit: {
    sessionCreate: { requests: 5, window: '1h' },
    chatMessage: { requests: 60, window: '1m' },
    export: { requests: 10, window: '1h' },
  },
} as const;

// ============================================
// Domain Configuration
// ============================================

export const DOMAINS = [
  'market',
  'product',
  'gtm',
  'operations',
  'financials',
] as const;

export const DOMAIN_LABELS: Record<(typeof DOMAINS)[number], string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

export const DOMAIN_DESCRIPTIONS: Record<(typeof DOMAINS)[number], string> = {
  market: 'Understanding of U.S. market dynamics, competition, and opportunity',
  product: 'Product readiness for U.S. market requirements and expectations',
  gtm: 'Go-to-market strategy, channels, and execution capabilities',
  operations: 'Operational infrastructure to support U.S. presence',
  financials: 'Financial planning, runway, and investment requirements',
};

// ============================================
// Color Palette (Decagon-inspired)
// ============================================

export const COLORS = {
  primary: '#5754FF',
  cyan: '#4EEBF3',
  orange: '#FF6F22',

  confidence: {
    high: '#4EEBF3',
    medium: '#FF6F22',
    low: '#94A3B8',
  },

  gap: {
    critical: '#EF4444',
    important: '#F59E0B',
  },

  text: {
    primary: '#0F0E1A',
    secondary: '#64748B',
  },

  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FC',
  },

  border: '#E2E8F0',
} as const;

// ============================================
// Validation Helpers
// ============================================

export function validateServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid server environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid server environment variables');
  }

  return parsed.data;
}

export function validateClientEnv(): ClientEnv {
  const env = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  };

  const parsed = clientEnvSchema.safeParse(env);

  if (!parsed.success) {
    console.error('Invalid client environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid client environment variables');
  }

  return parsed.data;
}
