import type { Input, DomainType } from '@atlas/types';

export const SYNTHESIS_SYSTEM_PROMPT = `You synthesize U.S. expansion readiness assessments.

Given inputs tagged with confidence (High/Medium/Low), generate a Readiness Snapshot:
- High confidence = STRENGTHS (validated facts)
- Medium confidence = ASSUMPTIONS (need validation)
- Low confidence = GAPS (missing info)

Rules:
- No scores/rankings - focus on "know vs assume"
- Be specific and actionable
- Prioritize by impact

Output: key findings, strengths, assumptions with validation suggestions, gaps with recommendations, 5 prioritized next steps.`;

// Truncate text to max length
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

export function buildSynthesisUserPrompt(inputs: Input[]): string {
  const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

  const domainLabels: Record<DomainType, string> = {
    market: 'Market',
    product: 'Product',
    gtm: 'Go-to-Market',
    operations: 'Operations',
    financials: 'Financials',
  };

  let prompt = `# Inputs by Domain\n\n`;

  for (const domain of domains) {
    const domainInputs = inputs.filter((i) => i.domain === domain);

    prompt += `## ${domainLabels[domain]}\n`;

    if (domainInputs.length === 0) {
      prompt += `No inputs.\n\n`;
      continue;
    }

    for (const input of domainInputs) {
      // Truncate response to reduce tokens
      const response = truncate(input.user_response, 200);

      // Extract just the key insight if available
      const extracted = input.extracted_data as { keyInsight?: string; summary?: string } | null;
      const insight = extracted?.keyInsight || extracted?.summary || '';

      prompt += `- **${input.question_id}** [${input.confidence_level.toUpperCase()}]: ${response}`;
      if (insight) {
        prompt += ` → ${truncate(insight, 100)}`;
      }
      prompt += `\n`;
    }
    prompt += `\n`;
  }

  prompt += `Generate a Readiness Snapshot based on these inputs.`;

  return prompt;
}

// Summary stats for coverage
export function calculateCoverageSummary(inputs: Input[]): Record<DomainType, {
  questionsAnswered: number;
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
}> {
  const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

  const summary: Record<DomainType, {
    questionsAnswered: number;
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
  }> = {} as any;

  for (const domain of domains) {
    const domainInputs = inputs.filter((i) => i.domain === domain);

    summary[domain] = {
      questionsAnswered: domainInputs.length,
      highConfidence: domainInputs.filter((i) => i.confidence_level === 'high').length,
      mediumConfidence: domainInputs.filter((i) => i.confidence_level === 'medium').length,
      lowConfidence: domainInputs.filter((i) => i.confidence_level === 'low').length,
    };
  }

  return summary;
}
