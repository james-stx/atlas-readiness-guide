import { createAnthropic } from '@ai-sdk/anthropic';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model configurations
// Using Claude 3.5 Sonnet for reliability - can upgrade to Claude 4.5 when stable
export const models = {
  conversation: 'claude-3-5-sonnet-20241022',
  classification: 'claude-3-5-haiku-20241022',
  synthesis: 'claude-3-5-sonnet-20241022',
} as const;

export const modelConfig = {
  conversation: {
    maxTokens: 1024,
    temperature: 0.7,
  },
  classification: {
    maxTokens: 256,
    temperature: 0,
  },
  synthesis: {
    maxTokens: 4096,
    temperature: 0.3,
  },
} as const;

// Helper to get the appropriate model
export function getModel(purpose: keyof typeof models) {
  return anthropic(models[purpose]);
}
