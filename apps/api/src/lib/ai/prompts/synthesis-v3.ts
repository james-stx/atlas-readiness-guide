import type { Input, DomainType, ConfidenceLevel } from '@atlas/types';

// Topic definitions matching the console
interface TopicDefinition {
  id: string;
  label: string;
  requirements: string[];
}

export const TOPIC_DEFINITIONS: Record<DomainType, TopicDefinition[]> = {
  market: [
    {
      id: 'market_driver',
      label: 'Why expand to the U.S.?',
      requirements: ['Clear expansion rationale', 'Quantitative demand evidence', 'Target vertical identified'],
    },
    {
      id: 'target_segment',
      label: 'Target customer profile',
      requirements: ['Customer segment defined', 'Company size range specified', 'Buyer persona identified'],
    },
    {
      id: 'market_size',
      label: 'Market size estimate',
      requirements: ['TAM quantified', 'SAM defined', 'Data sources cited'],
    },
    {
      id: 'competition',
      label: 'Competitive landscape',
      requirements: ['Competitors identified', 'Differentiation articulated', 'Competitive positioning clear'],
    },
    {
      id: 'existing_us_customers',
      label: 'Existing U.S. presence',
      requirements: ['Current U.S. customer count', 'Customer acquisition method', 'Learnings captured'],
    },
  ],
  product: [
    {
      id: 'product_description',
      label: "What you're selling",
      requirements: ['Clear product description', 'Value proposition articulated', 'Use case defined'],
    },
    {
      id: 'us_product_fit',
      label: 'Fit for U.S. market',
      requirements: ['U.S. readiness assessed', 'Required changes identified', 'Compliance needs noted'],
    },
    {
      id: 'localization',
      label: 'Localization needs',
      requirements: ['Language/terminology handled', 'Currency/payments ready', 'U.S. integrations planned'],
    },
    {
      id: 'competitive_advantage',
      label: 'Competitive advantage',
      requirements: ['Differentiator articulated', 'Defensibility explained', 'Evidence provided'],
    },
    {
      id: 'product_validation',
      label: 'Product-market fit evidence',
      requirements: ['Validation method described', 'U.S. customer feedback', 'Win/loss insights'],
    },
  ],
  gtm: [
    {
      id: 'gtm_strategy',
      label: 'Go-to-market approach',
      requirements: ['Strategy defined', 'Channel approach clear', 'Timeline outlined'],
    },
    {
      id: 'sales_presence',
      label: 'U.S. sales presence',
      requirements: ['Sales structure planned', 'Location decided', 'Timing specified'],
    },
    {
      id: 'pricing',
      label: 'Pricing strategy',
      requirements: ['U.S. pricing determined', 'Competitive positioning', 'Payment terms defined'],
    },
    {
      id: 'marketing_channels',
      label: 'Marketing channels',
      requirements: ['Channels identified', 'Budget allocated', 'Metrics defined'],
    },
    {
      id: 'sales_cycle',
      label: 'Sales cycle expectations',
      requirements: ['Cycle length estimated', 'Process documented', 'Resources planned'],
    },
  ],
  operations: [
    {
      id: 'support_coverage',
      label: 'Customer support coverage',
      requirements: ['Support hours defined', 'Staffing plan clear', 'SLA established'],
    },
    {
      id: 'legal_entity',
      label: 'U.S. legal entity',
      requirements: ['Entity type decided', 'State selected', 'Timeline clear'],
    },
    {
      id: 'data_compliance',
      label: 'Compliance & security',
      requirements: ['Requirements identified', 'Current certifications', 'Gap analysis done'],
    },
    {
      id: 'infrastructure',
      label: 'Technical infrastructure',
      requirements: ['U.S. hosting planned', 'Latency addressed', 'Scalability considered'],
    },
    {
      id: 'partnerships',
      label: 'U.S. partnerships',
      requirements: ['Partnership strategy', 'Target partners identified', 'Integration plans'],
    },
  ],
  financials: [
    {
      id: 'expansion_budget',
      label: 'Expansion budget',
      requirements: ['Budget allocated', 'Line items detailed', 'Contingency planned'],
    },
    {
      id: 'runway',
      label: 'Runway impact',
      requirements: ['Runway calculated', 'Burn rate projected', 'Milestones tied to funding'],
    },
    {
      id: 'funding_plans',
      label: 'Funding status',
      requirements: ['Funding strategy clear', 'Investor targets', 'Timeline defined'],
    },
    {
      id: 'revenue_timeline',
      label: 'Revenue expectations',
      requirements: ['Revenue targets set', 'Assumptions documented', 'Milestones defined'],
    },
    {
      id: 'break_even',
      label: 'Break-even timeline',
      requirements: ['Break-even projected', 'Assumptions clear', 'Scenarios considered'],
    },
  ],
};

export const SYNTHESIS_V3_SYSTEM_PROMPT = `You synthesize U.S. expansion readiness assessments into structured reports.

Given inputs tagged with confidence (High/Medium/Low), generate a V3 Readiness Report with:

## Assessment Status Rules

FIRST, determine assessment status based on coverage:
- **INCOMPLETE**: < 60% topics covered (< 15/25), OR any domain has < 2 topics covered
- **ASSESSABLE**: >= 60% topics covered AND every domain has >= 2 topics

## Readiness Level Rules (only if ASSESSABLE)

- **not_ready**: >= 2 domains with majority LOW confidence, OR >= 3 critical gaps, OR any domain with 0 HIGH confidence topics
- **ready_with_caveats**: No domain with majority LOW confidence, <= 2 critical gaps, >= 2 domains with majority HIGH confidence
- **ready**: >= 4 domains with majority HIGH confidence, 0 critical gaps, <= 2 important assumptions

## Per-Topic Analysis

For each of the 25 topics, determine:
1. Status: "covered" or "not_covered"
2. Confidence level (if covered): HIGH, MEDIUM, or LOW
3. Key insight (if covered): One sentence summary
4. Requirements status: For each topic requirement, mark as:
   - "addressed": Clear evidence in user's response
   - "partial": Some evidence but incomplete
   - "not_addressed": No evidence or mentioned as unknown

## Critical Actions & Assumptions

Generate actions WITH source traceability:
- Link each critical action to a specific topic (domain + topic label + status)
- Link each assumption to its source topic
- Be specific about what's missing and what to do

## Output Rules

- Use conservative assessments - don't inflate readiness
- If a topic wasn't discussed, mark it as "not_covered"
- If information is vague, mark confidence as LOW
- Critical gaps come from: not covered topics AND low confidence topics
- Assumptions come from: medium confidence topics where user made claims without evidence`;

// Truncate text to max length
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

export function buildSynthesisV3UserPrompt(inputs: Input[]): string {
  const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

  const domainLabels: Record<DomainType, string> = {
    market: 'Market',
    product: 'Product',
    gtm: 'Go-to-Market',
    operations: 'Operations',
    financials: 'Financials',
  };

  let prompt = `# Assessment Inputs\n\n`;

  // First, show topic structure for reference
  prompt += `## Topic Structure (25 total topics)\n\n`;
  for (const domain of domains) {
    prompt += `### ${domainLabels[domain]}\n`;
    for (const topic of TOPIC_DEFINITIONS[domain]) {
      const hasInput = inputs.some(i => i.question_id === topic.id);
      prompt += `- ${topic.id}: "${topic.label}" ${hasInput ? '(HAS INPUT)' : '(NO INPUT)'}\n`;
      prompt += `  Requirements: ${topic.requirements.join(', ')}\n`;
    }
    prompt += `\n`;
  }

  prompt += `\n## Captured Inputs\n\n`;

  for (const domain of domains) {
    const domainInputs = inputs.filter((i) => i.domain === domain);

    prompt += `### ${domainLabels[domain]}\n`;

    if (domainInputs.length === 0) {
      prompt += `No inputs captured.\n\n`;
      continue;
    }

    for (const input of domainInputs) {
      const response = truncate(input.user_response, 400);
      const extracted = input.extracted_data as { keyInsight?: string; summary?: string } | null;
      const insight = extracted?.keyInsight || extracted?.summary || '';

      prompt += `#### ${input.question_id} [${input.confidence_level.toUpperCase()}]\n`;
      prompt += `User said: "${response}"\n`;
      if (insight) {
        prompt += `Extracted insight: ${truncate(insight, 150)}\n`;
      }
      if (input.confidence_rationale) {
        prompt += `Confidence note: ${truncate(input.confidence_rationale, 100)}\n`;
      }
      prompt += `\n`;
    }
    prompt += `\n`;
  }

  prompt += `\n## Instructions

Generate a V3 Readiness Report:
1. First, calculate assessment status (incomplete vs assessable)
2. If assessable, determine readiness level using conservative logic
3. For EVERY topic (all 25), provide status and analysis
4. Link all critical actions and assumptions to their source topics
5. Create a 30-day action plan with week assignments

Be conservative - if information is vague or missing, call it out explicitly.`;

  return prompt;
}

// Calculate V3 domain results from inputs
export function calculateDomainResults(inputs: Input[]): Record<DomainType, {
  topics_covered: number;
  topics_total: number;
  confidence_level: ConfidenceLevel;
  confidence_breakdown: { high: number; medium: number; low: number };
  covered_topic_ids: string[];
}> {
  const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

  const results: Record<DomainType, {
    topics_covered: number;
    topics_total: number;
    confidence_level: ConfidenceLevel;
    confidence_breakdown: { high: number; medium: number; low: number };
    covered_topic_ids: string[];
  }> = {} as any;

  for (const domain of domains) {
    const domainTopics = TOPIC_DEFINITIONS[domain];
    const domainInputs = inputs.filter((i) => i.domain === domain);
    const coveredTopicIds = [...new Set(domainInputs.map(i => i.question_id))];

    const breakdown = {
      high: domainInputs.filter(i => i.confidence_level === 'high').length,
      medium: domainInputs.filter(i => i.confidence_level === 'medium').length,
      low: domainInputs.filter(i => i.confidence_level === 'low').length,
    };

    // Calculate domain confidence level
    const total = breakdown.high + breakdown.medium + breakdown.low;
    let confidenceLevel: ConfidenceLevel = 'low';

    if (total > 0) {
      const highRatio = breakdown.high / total;
      const mediumRatio = breakdown.medium / total;

      if (highRatio >= 0.6) {
        confidenceLevel = 'high';
      } else if (highRatio >= 0.4 || mediumRatio >= 0.6) {
        confidenceLevel = 'medium';
      }
    }

    results[domain] = {
      topics_covered: coveredTopicIds.length,
      topics_total: domainTopics.length,
      confidence_level: confidenceLevel,
      confidence_breakdown: breakdown,
      covered_topic_ids: coveredTopicIds,
    };
  }

  return results;
}

// Calculate assessment status
export function calculateAssessmentStatus(inputs: Input[]): {
  status: 'incomplete' | 'assessable';
  coverage_percentage: number;
  topics_covered: number;
  topics_total: number;
  domains_with_minimum: number;
} {
  const domainResults = calculateDomainResults(inputs);
  const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

  const totalTopics = 25;
  const coveredTopics = new Set(inputs.map(i => i.question_id)).size;
  const coveragePercentage = Math.round((coveredTopics / totalTopics) * 100);

  // Check if each domain has at least 2 topics
  const domainsWithMinimum = domains.filter(d => domainResults[d].topics_covered >= 2).length;

  // Assessment is incomplete if:
  // - < 60% coverage, OR
  // - Any domain has < 2 topics covered
  const isIncomplete = coveragePercentage < 60 || domainsWithMinimum < 5;

  return {
    status: isIncomplete ? 'incomplete' : 'assessable',
    coverage_percentage: coveragePercentage,
    topics_covered: coveredTopics,
    topics_total: totalTopics,
    domains_with_minimum: domainsWithMinimum,
  };
}
