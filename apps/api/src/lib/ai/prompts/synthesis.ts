import type { Input, DomainType } from '@atlas/types';

export const SYNTHESIS_SYSTEM_PROMPT = `You synthesize U.S. expansion readiness assessments into actionable reports.

Given inputs tagged with confidence (High/Medium/Low), generate a Readiness Report with:

1. **Readiness Level**: Classify overall readiness as:
   - "ready": High confidence across 4+ domains, no critical gaps
   - "ready_with_caveats": Mix of high/medium confidence, some addressable gaps
   - "not_ready": Low confidence in 2+ domains, or critical blockers

2. **Verdict Summary**: One clear sentence explaining the readiness assessment (e.g., "You have strong market validation and product readiness, but your go-to-market and operational plans need work before you can execute confidently.")

3. **Key Findings**: 3-5 most important observations across domains

4. **Strengths**: HIGH confidence items only. Include:
   - A clear item description
   - Evidence supporting this strength
   - The user's exact quote when available (verbatim from their input)

5. **Assumptions**: MEDIUM confidence items that need validation. Include:
   - What they believe but haven't proven
   - Risk if assumption is wrong
   - How to validate it

6. **Gaps**: Missing information or LOW confidence areas. Include:
   - What's missing
   - Importance level (critical/important/nice-to-have)
   - Research action (what to investigate)
   - Execution action (what to do)

7. **Next Steps**: 5-8 prioritized actions with:
   - Clear action statement (verb-first)
   - Domain it relates to
   - Rationale (why this matters now)
   - Week assignment (1, 2, 3, or 4) for 30-day plan

Rules:
- Be direct and specific, not generic
- Use founder's actual words when quoting
- Critical gaps = blockers that must be resolved first
- Week 1 = foundation/unblocking, Week 2 = validation, Weeks 3-4 = execution prep
- No scores or percentages — focus on "know vs assume vs don't know"`;

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
      // Include more of the response for quote extraction
      const response = truncate(input.user_response, 300);

      // Extract just the key insight if available
      const extracted = input.extracted_data as { keyInsight?: string; summary?: string } | null;
      const insight = extracted?.keyInsight || extracted?.summary || '';

      prompt += `- **${input.question_id}** [${input.confidence_level.toUpperCase()}]:\n`;
      prompt += `  Response: "${response}"\n`;
      if (insight) {
        prompt += `  Insight: ${truncate(insight, 100)}\n`;
      }
      if (input.confidence_rationale) {
        prompt += `  Confidence note: ${truncate(input.confidence_rationale, 100)}\n`;
      }
      prompt += `\n`;
    }
    prompt += `\n`;
  }

  prompt += `Generate a Readiness Report based on these inputs. Include user quotes verbatim where they strengthen the evidence.`;

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

// Calculate key stats from inputs
export function calculateKeyStats(inputs: Input[]): {
  topicsCovered: number;
  totalTopics: number;
  highConfidenceInputs: number;
  criticalGapsCount: number;
} {
  const totalTopics = 25; // 5 domains x 5 topics each
  const uniqueQuestions = new Set(inputs.map(i => i.question_id));

  return {
    topicsCovered: uniqueQuestions.size,
    totalTopics,
    highConfidenceInputs: inputs.filter(i => i.confidence_level === 'high').length,
    criticalGapsCount: 0, // Will be calculated from AI response
  };
}
