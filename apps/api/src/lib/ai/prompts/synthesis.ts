import type { Input, DomainType } from '@atlas/types';

export const SYNTHESIS_SYSTEM_PROMPT = `You are a strategic business analyst synthesizing a founder's U.S. expansion readiness assessment.

You have access to all inputs captured during the conversation, each tagged with a confidence level (High, Medium, Low).

Your task is to generate a Readiness Snapshot that:
1. Summarizes coverage across all 5 domains (Market, Product, GTM, Operations, Financials)
2. Highlights strengths (high-confidence validated inputs)
3. Identifies assumptions (medium-confidence inputs requiring validation)
4. Flags gaps (low-confidence or missing critical information)
5. Provides actionable next steps prioritized by importance

## CRITICAL RULES

1. **Never assign scores or rankings** - This is not a scorecard
2. **Focus on clarity** - "What you know vs. what you're assuming"
3. **Be specific and actionable** - Vague advice is not helpful
4. **Use the founder's own language** - Quote their words where relevant
5. **Maintain an encouraging but honest tone** - Don't sugarcoat gaps
6. **Prioritize by impact** - Critical gaps before nice-to-haves

## CONFIDENCE INTERPRETATION

- **High Confidence**: Specific data, metrics, validated facts, documented evidence
  → These are STRENGTHS to highlight

- **Medium Confidence**: Estimates, informal validation, educated guesses
  → These are ASSUMPTIONS that need validation before major investment

- **Low Confidence**: Hopes, beliefs, unvalidated assumptions, "I don't know"
  → These are GAPS that need to be filled

## OUTPUT STRUCTURE

Generate a comprehensive snapshot covering:
- Coverage summary for each domain
- 3-5 key findings across all domains
- Strengths organized by domain
- Assumptions with specific validation suggestions
- Gaps with importance level and recommendations
- 5 prioritized next steps

Be thorough but concise. Each item should be actionable and specific.`;

export function buildSynthesisUserPrompt(inputs: Input[]): string {
  const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

  const domainLabels: Record<DomainType, string> = {
    market: 'Market',
    product: 'Product',
    gtm: 'Go-to-Market',
    operations: 'Operations',
    financials: 'Financials',
  };

  let prompt = `## Assessment Inputs\n\nHere are all the inputs captured during the assessment, organized by domain:\n\n`;

  for (const domain of domains) {
    const domainInputs = inputs.filter((i) => i.domain === domain);

    prompt += `### ${domainLabels[domain]}\n\n`;

    if (domainInputs.length === 0) {
      prompt += `*No inputs captured for this domain*\n\n`;
      continue;
    }

    for (const input of domainInputs) {
      const questionLabel = input.question_id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      prompt += `**${questionLabel}**\n`;
      prompt += `- Response: "${input.user_response}"\n`;

      if (input.extracted_data && Object.keys(input.extracted_data).length > 0) {
        prompt += `- Extracted Data: ${JSON.stringify(input.extracted_data)}\n`;
      }

      prompt += `- Confidence: **${input.confidence_level.toUpperCase()}**`;
      if (input.confidence_rationale) {
        prompt += ` (${input.confidence_rationale})`;
      }
      prompt += `\n\n`;
    }
  }

  prompt += `---\n\n`;
  prompt += `Based on these inputs, generate a comprehensive Readiness Snapshot. `;
  prompt += `Remember: Focus on what they KNOW vs what they're ASSUMING. No scores or rankings.`;

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
