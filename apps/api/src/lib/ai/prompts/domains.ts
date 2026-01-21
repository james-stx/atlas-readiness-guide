import type { DomainType } from '@atlas/types';

export interface DomainQuestion {
  id: string;
  question: string;
  probes?: string[];
  quickResponses?: Array<{ id: string; label: string; value: string }>;
}

export interface DomainConfig {
  name: string;
  description: string;
  openingPrompt: string;
  keyQuestions: DomainQuestion[];
  transitionPrompt: string;
}

export const DOMAIN_CONFIGS: Record<DomainType, DomainConfig> = {
  market: {
    name: 'Market',
    description: 'Understanding of U.S. market dynamics, competition, and opportunity',
    openingPrompt: "Let's start with Market. Tell me, what's driving your interest in expanding to the United States?",
    keyQuestions: [
      {
        id: 'market_driver',
        question: "What's driving your interest in expanding to the United States?",
        probes: [
          'Is this driven by customer demand?',
          'Are you seeing competitors move there?',
          'Is it a strategic decision from leadership/board?',
        ],
      },
      {
        id: 'target_segment',
        question: 'Who is your target customer in the U.S. market?',
        probes: [
          'What industry or vertical?',
          'What company size?',
          'Who is the buyer within those organizations?',
        ],
      },
      {
        id: 'market_size',
        question: 'How big do you estimate the U.S. market opportunity to be for your product?',
        probes: [
          'How did you arrive at that number?',
          'Is this based on research or estimates?',
        ],
        quickResponses: [
          { id: 'large', label: '$100M+', value: 'We estimate it at over $100 million' },
          { id: 'medium', label: '$10-100M', value: 'We estimate between $10-100 million' },
          { id: 'unsure', label: 'Not sure yet', value: "I'm not sure yet, we're still researching" },
        ],
      },
      {
        id: 'competition',
        question: 'Who are your main competitors in the U.S.?',
        probes: [
          'Have you competed against them before?',
          'What do they do well?',
          'How do you differentiate?',
        ],
      },
      {
        id: 'existing_us_customers',
        question: 'Do you have any existing U.S. customers today?',
        probes: [
          'How did you acquire them?',
          'What have you learned from serving them?',
        ],
        quickResponses: [
          { id: 'yes', label: 'Yes, we do', value: 'Yes, we have some U.S. customers' },
          { id: 'no', label: 'Not yet', value: 'No, not yet' },
          { id: 'few', label: 'A few', value: 'We have a few but not many' },
        ],
      },
    ],
    transitionPrompt: "Thanks for sharing about your market opportunity. I have a good sense of how you're thinking about the U.S. market. Let's talk about your **Product** next.",
  },

  product: {
    name: 'Product',
    description: 'Product readiness for U.S. market requirements',
    openingPrompt: "Now let's talk about your product. How would you describe what you've built?",
    keyQuestions: [
      {
        id: 'product_description',
        question: 'How would you describe your product in one or two sentences?',
      },
      {
        id: 'us_product_fit',
        question: 'How well does your current product fit U.S. customer needs?',
        probes: [
          'What changes might be needed?',
          'Are there compliance or regulatory requirements?',
        ],
        quickResponses: [
          { id: 'ready', label: 'Ready as-is', value: 'It works for U.S. customers as-is' },
          { id: 'minor', label: 'Minor changes', value: 'We need some minor adjustments' },
          { id: 'major', label: 'Major changes', value: 'We need significant changes' },
        ],
      },
      {
        id: 'localization',
        question: 'What localization have you done or need to do for the U.S. market?',
        probes: [
          'Language and terminology?',
          'Currency and payments?',
          'Integrations with U.S. tools?',
        ],
      },
      {
        id: 'competitive_advantage',
        question: "What's your main competitive advantage or differentiator?",
      },
      {
        id: 'product_validation',
        question: 'How have you validated product-market fit with U.S. customers?',
        probes: [
          'Customer interviews?',
          'Pilot programs?',
          'Win/loss analysis?',
        ],
      },
    ],
    transitionPrompt: "Good insights on your product readiness. Now let's discuss how you plan to actually **Go-to-Market** in the U.S.",
  },

  gtm: {
    name: 'Go-to-Market',
    description: 'Strategy, channels, and execution capabilities',
    openingPrompt: "Let's talk Go-to-Market. What's your initial plan for selling into the U.S.?",
    keyQuestions: [
      {
        id: 'gtm_strategy',
        question: "What's your initial go-to-market strategy for the U.S.?",
        probes: [
          'Direct sales?',
          'Partners/channels?',
          'Product-led growth?',
        ],
      },
      {
        id: 'sales_presence',
        question: 'Will you have people on the ground in the U.S.?',
        probes: [
          'When would you hire?',
          'What roles first?',
          'Where would they be based?',
        ],
        quickResponses: [
          { id: 'yes', label: 'Yes, planned', value: 'Yes, we plan to have people there' },
          { id: 'remote', label: 'Sell remotely', value: "We'll sell remotely initially" },
          { id: 'undecided', label: 'Undecided', value: "We haven't decided yet" },
        ],
      },
      {
        id: 'pricing',
        question: 'How does your pricing compare to U.S. competitors?',
        probes: [
          'Will you adjust pricing for the U.S.?',
          'How do customers typically pay?',
        ],
      },
      {
        id: 'marketing_channels',
        question: 'What marketing channels will you use to reach U.S. customers?',
        probes: [
          'Content marketing?',
          'Events and conferences?',
          'Paid advertising?',
        ],
      },
      {
        id: 'sales_cycle',
        question: "What's your typical sales cycle, and do you expect it to be different in the U.S.?",
      },
    ],
    transitionPrompt: "I have a clearer picture of your go-to-market approach. Let's shift to **Operations** and how you'll support U.S. customers.",
  },

  operations: {
    name: 'Operations',
    description: 'Infrastructure to support U.S. presence',
    openingPrompt: "Now let's talk operations. What's your plan for supporting U.S. customers?",
    keyQuestions: [
      {
        id: 'support_coverage',
        question: 'How will you provide customer support in U.S. time zones?',
        probes: [
          'Will you have U.S.-based support?',
          'What hours will you cover?',
        ],
        quickResponses: [
          { id: 'us_team', label: 'U.S. team', value: "We'll have U.S.-based support" },
          { id: 'extended', label: 'Extended hours', value: "We'll extend our current team's hours" },
          { id: 'figuring', label: 'Still planning', value: "We're still figuring this out" },
        ],
      },
      {
        id: 'legal_entity',
        question: 'Do you have or plan to establish a U.S. legal entity?',
        probes: [
          'What type of entity?',
          'Have you worked with U.S. lawyers?',
        ],
      },
      {
        id: 'data_compliance',
        question: 'How do you handle data privacy and compliance for U.S. customers?',
        probes: [
          'Where is data stored?',
          'SOC 2, GDPR, CCPA considerations?',
        ],
      },
      {
        id: 'infrastructure',
        question: 'Is your technical infrastructure ready to serve U.S. customers well?',
        probes: [
          'Latency considerations?',
          'U.S.-based hosting?',
        ],
      },
      {
        id: 'partnerships',
        question: 'Do you have any U.S. partnerships or integrations that will help?',
      },
    ],
    transitionPrompt: "Good understanding of your operational readiness. Finally, let's discuss **Financials** and the investment required.",
  },

  financials: {
    name: 'Financials',
    description: 'Financial planning, runway, and investment',
    openingPrompt: "Last domain - Financials. Let's talk about the investment needed for U.S. expansion.",
    keyQuestions: [
      {
        id: 'expansion_budget',
        question: "What budget have you allocated for U.S. expansion in the first year?",
        probes: [
          'How did you arrive at this number?',
          'What are the biggest line items?',
        ],
      },
      {
        id: 'runway',
        question: "What's your current runway, and how does U.S. expansion affect it?",
        quickResponses: [
          { id: 'plenty', label: '18+ months', value: 'We have more than 18 months of runway' },
          { id: 'moderate', label: '12-18 months', value: 'We have 12-18 months of runway' },
          { id: 'tight', label: 'Under 12 months', value: 'We have less than 12 months of runway' },
        ],
      },
      {
        id: 'funding_plans',
        question: 'Are you planning to raise funding to support U.S. expansion?',
        probes: [
          'What stage?',
          'U.S. or local investors?',
        ],
      },
      {
        id: 'revenue_timeline',
        question: 'When do you expect to see meaningful U.S. revenue?',
        probes: [
          'What does "meaningful" look like?',
          'What assumptions is this based on?',
        ],
      },
      {
        id: 'break_even',
        question: 'When do you expect U.S. operations to break even?',
      },
    ],
    transitionPrompt: "Excellent. We've now covered all five domains of your U.S. expansion readiness.",
  },
};

export function getDomainConfig(domain: DomainType): DomainConfig {
  return DOMAIN_CONFIGS[domain];
}

export function getNextDomain(currentDomain: DomainType): DomainType | null {
  const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];
  const currentIndex = domains.indexOf(currentDomain);
  if (currentIndex === -1 || currentIndex === domains.length - 1) {
    return null;
  }
  return domains[currentIndex + 1];
}
