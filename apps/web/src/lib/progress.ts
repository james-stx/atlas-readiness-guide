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

/** Key topics by domain - IDs must match question_ids in apps/api/src/lib/ai/prompts/domains.ts */
export const DOMAIN_TOPICS: Record<DomainType, { id: string; label: string }[]> = {
  market: [
    { id: 'market_driver', label: 'Why expand to the U.S.?' },
    { id: 'target_segment', label: 'Target customer profile' },
    { id: 'market_size', label: 'Market size estimate' },
    { id: 'competition', label: 'Competitive landscape' },
    { id: 'existing_us_customers', label: 'Existing U.S. presence' },
  ],
  product: [
    { id: 'product_description', label: 'What you\'re selling' },
    { id: 'us_product_fit', label: 'Fit for U.S. market' },
    { id: 'localization', label: 'Localization needs' },
    { id: 'competitive_advantage', label: 'Competitive advantage' },
    { id: 'product_validation', label: 'Product-market fit evidence' },
  ],
  gtm: [
    { id: 'gtm_strategy', label: 'Go-to-market approach' },
    { id: 'sales_presence', label: 'U.S. sales presence' },
    { id: 'pricing', label: 'Pricing strategy' },
    { id: 'marketing_channels', label: 'Marketing channels' },
    { id: 'sales_cycle', label: 'Sales cycle expectations' },
  ],
  operations: [
    { id: 'support_coverage', label: 'Customer support coverage' },
    { id: 'legal_entity', label: 'U.S. legal entity' },
    { id: 'data_compliance', label: 'Compliance & security' },
    { id: 'infrastructure', label: 'Technical infrastructure' },
    { id: 'partnerships', label: 'U.S. partnerships' },
  ],
  financials: [
    { id: 'expansion_budget', label: 'Expansion budget' },
    { id: 'runway', label: 'Runway impact' },
    { id: 'funding_plans', label: 'Funding status' },
    { id: 'revenue_timeline', label: 'Revenue expectations' },
    { id: 'break_even', label: 'Break-even timeline' },
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
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
    iconBgColor: 'bg-slate-100',
  },
  partial: {
    title: 'Making Progress',
    message:
      "You're building a foundation. A few more details would help.",
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    iconBgColor: 'bg-amber-100',
  },
  good: {
    title: 'Looking Good',
    message:
      'You have enough for a useful snapshot. Feel free to add more or generate now.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    iconBgColor: 'bg-green-100',
  },
  excellent: {
    title: 'Excellent Coverage',
    message: 'Great work! Your snapshot will be comprehensive.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    iconBgColor: 'bg-emerald-100',
  },
};
