import type { DomainType, ConfidenceLevel, Input } from '@atlas/types';

export type DomainStatus = 'not_started' | 'in_progress' | 'adequate';

// ============================================
// Constants
// ============================================

export const TOPICS_PER_DOMAIN = 5;

export const DOMAINS: { key: DomainType; label: string; shortLabel: string }[] = [
  { key: 'market', label: 'Market', shortLabel: 'M' },
  { key: 'product', label: 'Product', shortLabel: 'P' },
  { key: 'gtm', label: 'Go-to-Market', shortLabel: 'G' },
  { key: 'operations', label: 'Operations', shortLabel: 'O' },
  { key: 'financials', label: 'Financials', shortLabel: 'F' },
];

export interface TopicConfig {
  id: string;
  label: string;
  description: string;
}

/** Key topics by domain - IDs must match question_ids in apps/api/src/lib/ai/prompts/domains.ts */
export const DOMAIN_TOPICS: Record<DomainType, TopicConfig[]> = {
  market: [
    {
      id: 'market_driver',
      label: 'Why expand to the U.S.?',
      description: 'Your strategic rationale and timing for entering the U.S. market.',
    },
    {
      id: 'target_segment',
      label: 'Target customer profile',
      description: 'Who you will sell to: company size, industry, buyer persona.',
    },
    {
      id: 'market_size',
      label: 'Market size estimate',
      description: 'Total addressable market and serviceable market in the U.S.',
    },
    {
      id: 'competition',
      label: 'Competitive landscape',
      description: 'Key competitors and how you differentiate in the U.S. market.',
    },
    {
      id: 'existing_us_customers',
      label: 'Existing U.S. presence',
      description: 'Any current U.S. customers, pilots, or inbound interest.',
    },
  ],
  product: [
    {
      id: 'product_description',
      label: 'What you\'re selling',
      description: 'Core product/service and the problem it solves.',
    },
    {
      id: 'us_product_fit',
      label: 'Fit for U.S. market',
      description: 'How well your product meets U.S. customer expectations.',
    },
    {
      id: 'localization',
      label: 'Localization needs',
      description: 'Language, compliance, and cultural adaptations required.',
    },
    {
      id: 'competitive_advantage',
      label: 'Competitive advantage',
      description: 'What makes you hard to replicate or beat in the U.S.',
    },
    {
      id: 'product_validation',
      label: 'Product-market fit evidence',
      description: 'Proof points: metrics, testimonials, case studies.',
    },
  ],
  gtm: [
    {
      id: 'gtm_strategy',
      label: 'Go-to-market approach',
      description: 'How you plan to acquire customers: direct, channel, PLG.',
    },
    {
      id: 'sales_presence',
      label: 'U.S. sales presence',
      description: 'Sales team plans: remote, local hires, or partners.',
    },
    {
      id: 'pricing',
      label: 'Pricing strategy',
      description: 'How pricing compares to competitors and home market.',
    },
    {
      id: 'marketing_channels',
      label: 'Marketing channels',
      description: 'Primary channels for awareness and lead generation.',
    },
    {
      id: 'sales_cycle',
      label: 'Sales cycle expectations',
      description: 'Expected time from first contact to closed deal.',
    },
  ],
  operations: [
    {
      id: 'support_coverage',
      label: 'Customer support coverage',
      description: 'How you will provide timely support across U.S. time zones.',
    },
    {
      id: 'legal_entity',
      label: 'U.S. legal entity',
      description: 'Plans for incorporating a U.S. subsidiary.',
    },
    {
      id: 'data_compliance',
      label: 'Compliance & security',
      description: 'Data privacy, SOC 2, HIPAA, or industry-specific requirements.',
    },
    {
      id: 'infrastructure',
      label: 'Technical infrastructure',
      description: 'U.S. hosting, latency, and reliability considerations.',
    },
    {
      id: 'partnerships',
      label: 'U.S. partnerships',
      description: 'Strategic partners, integrations, or channel relationships.',
    },
  ],
  financials: [
    {
      id: 'expansion_budget',
      label: 'Expansion budget',
      description: 'How much you can allocate to U.S. expansion.',
    },
    {
      id: 'runway',
      label: 'Runway impact',
      description: 'How expansion affects your cash runway.',
    },
    {
      id: 'funding_plans',
      label: 'Funding status',
      description: 'Current funding and plans for future rounds.',
    },
    {
      id: 'revenue_timeline',
      label: 'Revenue expectations',
      description: 'When you expect first U.S. revenue and growth targets.',
    },
    {
      id: 'break_even',
      label: 'Break-even timeline',
      description: 'When U.S. operations should become profitable.',
    },
  ],
};

// ============================================
// Types
// ============================================

export type ReadinessState = 'minimal' | 'partial' | 'good' | 'excellent';

export interface DomainProgress {
  inputCount: number;
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
  coveredTopics: string[]; // question_ids
  status: DomainStatus;
}

export interface ProgressState {
  overallProgress: number;
  totalInputs: number;
  highConfidenceCount: number;
  mediumConfidenceCount: number;
  lowConfidenceCount: number;
  domainProgress: Record<DomainType, DomainProgress>;
  snapshotReadiness: ReadinessState;
  domainsWithInputs: number;
}

// ============================================
// Calculation functions
// ============================================

export function calculateDomainProgress(
  inputs: Input[],
  domain: DomainType
): DomainProgress {
  const domainInputs = inputs.filter((i) => i.domain === domain);
  const highConfidence = domainInputs.filter((i) => i.confidence_level === 'high').length;
  const mediumConfidence = domainInputs.filter((i) => i.confidence_level === 'medium').length;
  const lowConfidence = domainInputs.filter((i) => i.confidence_level === 'low').length;
  const coveredTopics = [...new Set(domainInputs.map((i) => i.question_id))];

  let status: DomainStatus = 'not_started';
  if (domainInputs.length === 0) {
    status = 'not_started';
  } else if (domainInputs.length >= 3 && highConfidence >= 1) {
    status = 'adequate';
  } else {
    status = 'in_progress';
  }

  return {
    inputCount: domainInputs.length,
    highConfidence,
    mediumConfidence,
    lowConfidence,
    coveredTopics,
    status,
  };
}

export function calculateOverallProgress(
  domainProgress: Record<DomainType, DomainProgress>
): number {
  const domains = Object.values(domainProgress);
  const totalProgress = domains.reduce((sum, domain) => {
    // Each domain contributes up to 20% (100% / 5 domains)
    const domainCompletion = Math.min(domain.inputCount / TOPICS_PER_DOMAIN, 1);
    return sum + domainCompletion * 20;
  }, 0);

  return Math.round(totalProgress);
}

export function calculateSnapshotReadiness(
  totalInputs: number,
  domainsWithInputs: number,
  highConfidenceCount: number
): ReadinessState {
  const highConfidenceRatio =
    totalInputs > 0 ? highConfidenceCount / totalInputs : 0;

  if (totalInputs < 3 || highConfidenceRatio === 0) {
    return 'minimal';
  }
  if (domainsWithInputs < 3 || totalInputs < 6) {
    return 'partial';
  }
  if (
    domainsWithInputs >= 4 &&
    totalInputs >= 10 &&
    highConfidenceRatio > 0.4
  ) {
    return 'excellent';
  }
  return 'good';
}

export function calculateFullProgressState(
  inputs: Input[],
  currentDomain: DomainType
): ProgressState {
  const domainProgress: Record<DomainType, DomainProgress> = {
    market: calculateDomainProgress(inputs, 'market'),
    product: calculateDomainProgress(inputs, 'product'),
    gtm: calculateDomainProgress(inputs, 'gtm'),
    operations: calculateDomainProgress(inputs, 'operations'),
    financials: calculateDomainProgress(inputs, 'financials'),
  };

  // Mark current domain as in_progress if it's not_started
  if (domainProgress[currentDomain].status === 'not_started') {
    domainProgress[currentDomain] = {
      ...domainProgress[currentDomain],
      status: 'in_progress',
    };
  }

  const overallProgress = calculateOverallProgress(domainProgress);
  const totalInputs = inputs.length;
  const highConfidenceCount = inputs.filter(
    (i) => i.confidence_level === 'high'
  ).length;
  const mediumConfidenceCount = inputs.filter(
    (i) => i.confidence_level === 'medium'
  ).length;
  const lowConfidenceCount = inputs.filter(
    (i) => i.confidence_level === 'low'
  ).length;
  const domainsWithInputs = Object.values(domainProgress).filter(
    (d) => d.inputCount > 0
  ).length;

  const snapshotReadiness = calculateSnapshotReadiness(
    totalInputs,
    domainsWithInputs,
    highConfidenceCount
  );

  return {
    overallProgress,
    totalInputs,
    highConfidenceCount,
    mediumConfidenceCount,
    lowConfidenceCount,
    domainProgress,
    snapshotReadiness,
    domainsWithInputs,
  };
}

/**
 * Get a user-friendly label for a question_id.
 * Falls back to the raw ID if not found in our mapping.
 */
export function getTopicLabel(questionId: string): string {
  for (const domain of Object.values(DOMAIN_TOPICS)) {
    const topic = domain.find((t) => t.id === questionId);
    if (topic) return topic.label;
  }
  return questionId;
}

/**
 * Get the full topic config for a question_id.
 */
export function getTopicConfig(questionId: string): TopicConfig | null {
  for (const domain of Object.values(DOMAIN_TOPICS)) {
    const topic = domain.find((t) => t.id === questionId);
    if (topic) return topic;
  }
  return null;
}

/**
 * Get gap suggestions: uncovered high-impact topics.
 * Returns up to maxSuggestions items.
 */
export function getGapSuggestions(
  progressState: ProgressState,
  maxSuggestions: number = 3
): { topic: string; domain: DomainType; domainLabel: string }[] {
  const suggestions: { topic: string; domain: DomainType; domainLabel: string }[] = [];

  // Prioritize domains with no inputs first
  const sortedDomains = DOMAINS.sort((a, b) => {
    const aCount = progressState.domainProgress[a.key].inputCount;
    const bCount = progressState.domainProgress[b.key].inputCount;
    return aCount - bCount;
  });

  for (const domain of sortedDomains) {
    if (suggestions.length >= maxSuggestions) break;

    const dp = progressState.domainProgress[domain.key];
    const topics = DOMAIN_TOPICS[domain.key];

    for (const topic of topics) {
      if (suggestions.length >= maxSuggestions) break;
      if (!dp.coveredTopics.includes(topic.id)) {
        suggestions.push({
          topic: topic.label,
          domain: domain.key,
          domainLabel: domain.label,
        });
      }
    }
  }

  return suggestions;
}

/** Readiness state display configuration */
export const READINESS_CONFIG: Record<
  ReadinessState,
  { title: string; message: string; color: string; bgColor: string; iconBgColor: string }
> = {
  minimal: {
    title: 'Getting Started',
    message:
      'Keep going! More information will make your snapshot more useful.',
    color: 'text-warm-500',
    bgColor: 'bg-warm-50',
    iconBgColor: 'bg-warm-100',
  },
  partial: {
    title: 'Making Progress',
    message:
      "You're building a foundation. A few more details would help.",
    color: 'text-confidence-medium',
    bgColor: 'bg-confidence-medium-bg',
    iconBgColor: 'bg-confidence-medium-bg',
  },
  good: {
    title: 'Looking Good',
    message:
      'You have enough for a useful snapshot. Feel free to add more or generate now.',
    color: 'text-confidence-high',
    bgColor: 'bg-confidence-high-bg',
    iconBgColor: 'bg-confidence-high-bg',
  },
  excellent: {
    title: 'Excellent Coverage',
    message: 'Great work! Your snapshot will be comprehensive.',
    color: 'text-confidence-high',
    bgColor: 'bg-confidence-high-bg',
    iconBgColor: 'bg-confidence-high-bg',
  },
};
