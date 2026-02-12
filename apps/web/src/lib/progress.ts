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
      description: 'A clear strategic rationale helps you prioritize resources and communicate your vision to investors, partners, and team members. Understanding your "why" prevents costly pivots later.',
    },
    {
      id: 'target_segment',
      label: 'Target customer profile',
      description: 'U.S. markets are vast and segmented. Knowing your ideal customer profile helps focus your sales and marketing efforts, reducing customer acquisition costs and improving win rates.',
    },
    {
      id: 'market_size',
      label: 'Market size estimate',
      description: 'Investors and partners need to see the opportunity size. A well-researched TAM/SAM shows you understand the market and have realistic growth expectations.',
    },
    {
      id: 'competition',
      label: 'Competitive landscape',
      description: 'U.S. markets are often crowded with well-funded competitors. Understanding your competitive position helps you differentiate and avoid head-to-head battles you cannot win.',
    },
    {
      id: 'existing_us_customers',
      label: 'Existing U.S. presence',
      description: 'Existing U.S. customers or inbound interest validates demand and provides reference accounts. This is often the strongest signal of product-market fit.',
    },
  ],
  product: [
    {
      id: 'product_description',
      label: 'What you\'re selling',
      description: 'A clear product narrative helps everyone—from sales reps to investors—understand and communicate your value proposition consistently.',
    },
    {
      id: 'us_product_fit',
      label: 'Fit for U.S. market',
      description: 'U.S. buyers have different expectations around features, UX, and support. Understanding these gaps early prevents costly surprises after launch.',
    },
    {
      id: 'localization',
      label: 'Localization needs',
      description: 'Beyond language, localization includes compliance (SOC 2, GDPR), payment methods, date formats, and cultural norms. Underestimating this is a common expansion failure point.',
    },
    {
      id: 'competitive_advantage',
      label: 'Competitive advantage',
      description: 'Your home market advantage may not translate to the U.S. Identifying defensible differentiators helps you compete against well-established local players.',
    },
    {
      id: 'product_validation',
      label: 'Product-market fit evidence',
      description: 'U.S. buyers are skeptical of unproven vendors. Strong proof points—case studies, metrics, testimonials—accelerate sales cycles and build credibility.',
    },
  ],
  gtm: [
    {
      id: 'gtm_strategy',
      label: 'Go-to-market approach',
      description: 'Your GTM strategy determines your cost structure and growth rate. Direct sales, channel partnerships, and PLG each have different resource requirements and timelines.',
    },
    {
      id: 'sales_presence',
      label: 'U.S. sales presence',
      description: 'Many U.S. buyers prefer local vendors. Having U.S.-based sales reps (or partners) builds trust and enables time-zone-friendly conversations.',
    },
    {
      id: 'pricing',
      label: 'Pricing strategy',
      description: 'U.S. pricing expectations may differ from your home market. Getting this wrong impacts margins, competitive positioning, and perceived value.',
    },
    {
      id: 'marketing_channels',
      label: 'Marketing channels',
      description: 'Marketing channels that work at home may not work in the U.S. Understanding where your buyers discover and evaluate solutions helps allocate budget effectively.',
    },
    {
      id: 'sales_cycle',
      label: 'Sales cycle expectations',
      description: 'Enterprise sales cycles in the U.S. can be 6-12+ months. Understanding this helps you plan cash flow and set realistic revenue expectations.',
    },
  ],
  operations: [
    {
      id: 'support_coverage',
      label: 'Customer support coverage',
      description: 'U.S. customers expect responsive support during their business hours. Poor support experiences quickly damage your reputation in a market that relies heavily on referrals.',
    },
    {
      id: 'legal_entity',
      label: 'U.S. legal entity',
      description: 'Many U.S. enterprises require vendors to have a U.S. legal entity. This affects contracts, taxes, banking, and hiring. Delaware C-Corps are most common for startups.',
    },
    {
      id: 'data_compliance',
      label: 'Compliance & security',
      description: 'U.S. enterprises often require SOC 2, and specific industries need HIPAA, FedRAMP, or other certifications. These can take 6-12 months to obtain.',
    },
    {
      id: 'infrastructure',
      label: 'Technical infrastructure',
      description: 'Data residency requirements and latency expectations may require U.S.-based infrastructure. This impacts architecture decisions and operational costs.',
    },
    {
      id: 'partnerships',
      label: 'U.S. partnerships',
      description: 'Strategic partnerships can accelerate market entry through distribution, integration, and credibility. The right partners can shortcut years of brand building.',
    },
  ],
  financials: [
    {
      id: 'expansion_budget',
      label: 'Expansion budget',
      description: 'U.S. expansion is expensive—sales, marketing, legal, compliance, and travel add up quickly. Understanding your budget helps set realistic timelines and milestones.',
    },
    {
      id: 'runway',
      label: 'Runway impact',
      description: 'Expansion burns cash before generating revenue. Knowing how this impacts your runway helps you plan fundraising timing and avoid existential risks.',
    },
    {
      id: 'funding_plans',
      label: 'Funding status',
      description: 'U.S. investors often prefer to invest in companies with U.S. traction. Understanding your funding strategy helps coordinate expansion with capital availability.',
    },
    {
      id: 'revenue_timeline',
      label: 'Revenue expectations',
      description: 'Realistic revenue expectations prevent disappointment and help you plan team growth. First U.S. revenue often takes 6-12 months after serious market entry.',
    },
    {
      id: 'break_even',
      label: 'Break-even timeline',
      description: 'Knowing when U.S. operations become self-sustaining helps you plan investment and measure success. This also influences investor and board expectations.',
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

  // Only count topics that match valid question IDs for this domain
  const validTopicIds = DOMAIN_TOPICS[domain].map((t) => t.id);
  const validInputs = domainInputs.filter((i) => validTopicIds.includes(i.question_id));

  const highConfidence = validInputs.filter((i) => i.confidence_level === 'high').length;
  const mediumConfidence = validInputs.filter((i) => i.confidence_level === 'medium').length;
  const lowConfidence = validInputs.filter((i) => i.confidence_level === 'low').length;
  const coveredTopics = [...new Set(validInputs.map((i) => i.question_id))];

  let status: DomainStatus = 'not_started';
  if (validInputs.length === 0) {
    status = 'not_started';
  } else if (validInputs.length >= 3 && highConfidence >= 1) {
    status = 'adequate';
  } else {
    status = 'in_progress';
  }

  return {
    inputCount: validInputs.length,
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
    // Use coveredTopics.length for unique topics, not inputCount (which can have duplicates)
    const domainCompletion = Math.min(domain.coveredTopics.length / TOPICS_PER_DOMAIN, 1);
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
