import { createAnthropic } from '@ai-sdk/anthropic';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model configurations
// Claude 4.5 models - latest and most capable
export const models = {
  conversation: 'claude-sonnet-4-5-20250929',
  classification: 'claude-haiku-4-5-20251001',
  synthesis: 'claude-sonnet-4-5-20250929',
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
    maxTokens: 2048,
    temperature: 0.3,
  },
} as const;

// Helper to get the appropriate model
export function getModel(purpose: keyof typeof models) {
  return anthropic(models[purpose]);
}
