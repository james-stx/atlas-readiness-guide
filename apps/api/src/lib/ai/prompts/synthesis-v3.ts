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

export const SYNTHESIS_V3_SYSTEM_PROMPT = `You synthesize U.S. expansion readiness assessments into structured reports for Australian companies.

Given inputs tagged with confidence (High/Medium/Low), generate a structured Readiness Report.

## Assessment Status Rules

FIRST, determine assessment status:
- **INCOMPLETE**: < 60% topics covered OR any domain has < 2 topics covered
- **ASSESSABLE**: >= 60% topics covered AND every domain has >= 2 topics

## Per-Topic Analysis (always required)

For each covered topic:
1. Status: "covered" or "not_covered"
2. Confidence: HIGH, MEDIUM, or LOW
3. keyInsight: One sentence summary of what was shared

## For INCOMPLETE Assessments

Generate:
- earlySignals (2-4): Cross-domain patterns — NOT per-topic summaries. Find connections.
  Types: strength | pattern | risk | unknown
  Each needs: derivedFrom (topic IDs), blockedBy (domains), implication
- recommendedTopics (3): Most valuable next topics given current coverage
  Each needs: domain, topicId, topicLabel, impact (high|medium), why, unlocks

## For ASSESSABLE Assessments — Full Report Sections

### executiveSummary (string, 2-3 sentences)
A compelling narrative about this company's current U.S. expansion position.
- Open with their strongest validated advantage (be specific, not generic)
- Acknowledge where they need to strengthen (name the actual gap areas)
- End with the implication — what this means for their path forward
Do NOT use generic phrases like "strong foundation". Be direct and specific.

### strengths (array, 3-5 items)
HIGH-confidence validated advantages for U.S. expansion. Only include items where the user provided clear, specific evidence.
Each item:
- title: Short label (e.g. "Validated U.S. demand signal")
- description: 1-2 sentences explaining WHY this is a genuine advantage for U.S. expansion specifically
- sourceDomain: domain key
- sourceTopic: topic label
- confidence: "high"

### risks (array, 2-4 items)
MEDIUM-confidence items that are concerning but don't block expansion today. These are signals that will compound if ignored.
Each item:
- title: Short label
- description: 1-2 sentences on the risk and its specific implication for U.S. expansion
- sourceDomain: domain key
- sourceTopic: topic label

### criticalActions (array)
Hard blockers that MUST be resolved before committing capital. Low-confidence or missing topics that are genuine prerequisites.
Each item:
- priority (1-5)
- title
- sourceDomain, sourceTopic, sourceStatus
- description: Why this is a hard blocker
- action: Specific first step

### needsValidation (array, 2-4 items)
Assumptions the user has made that need to be tested before they can be treated as fact.
Each item:
- title
- sourceDomain, sourceTopic
- description: What the assumption is and why it matters if wrong
- validationStep: One specific, concrete action to validate it (start with a verb)

### roadmapPhase1 (array, 3-4 items)
Specific actions for Days 1-30: focused on resolving critical blockers.
Each item:
- action: Specific, concrete task (start with a verb)
- rationale: What this unblocks or why it matters
- sourceDomain, sourceTopic

### roadmapPhase2 (array, 3-4 items)
Specific actions for Days 31-60: focused on testing key assumptions.
Each item:
- action: Specific, concrete task (start with a verb)
- rationale: What this unblocks or why it matters
- sourceDomain, sourceTopic

## Output Rules
- Conservative assessments — don't inflate readiness
- Not covered topics = "not_covered", vague responses = LOW confidence
- Every insight must trace back to a specific domain and topic
- Strengths from HIGH confidence only, Risks from MEDIUM confidence
- Critical from LOW confidence or missing prerequisite topics`;

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

  // Build topic list with coverage status
  let prompt = `# Topics to Analyze\n\n`;
  for (const domain of domains) {
    prompt += `## ${domainLabels[domain]}\n`;
    for (const topic of TOPIC_DEFINITIONS[domain]) {
      const input = inputs.find(i => i.question_id === topic.id);
      if (input) {
        const response = truncate(input.user_response, 250);
        prompt += `- ${topic.id} "${topic.label}" [${input.confidence_level.toUpperCase()}]: "${response}"\n`;
      } else {
        prompt += `- ${topic.id} "${topic.label}": NOT COVERED\n`;
      }
    }
    prompt += `\n`;
  }

  // Calculate stats
  const coveredCount = inputs.length;
  const coveragePercent = Math.round((coveredCount / 25) * 100);

  prompt += `# Summary\n`;
  prompt += `Coverage: ${coveredCount}/25 topics (${coveragePercent}%)\n\n`;

  const isIncomplete = coveragePercent < 60;

  prompt += `# Instructions\n`;

  prompt += `Generate a readiness report with:\n`;

  if (isIncomplete) {
    prompt += `1. topicResults: Array with one entry per COVERED topic (topicId, topicLabel, domain, status="covered", confidence, keyInsight)\n`;
    prompt += `\n## INCOMPLETE ASSESSMENT:\n`;
    prompt += `2. earlySignals: 2-4 cross-domain patterns (type: strength|pattern|risk|unknown, title, description, derivedFrom: topic IDs, blockedBy: domain names, implication)\n`;
    prompt += `3. recommendedTopics: 3 highest-value topics to cover next (domain, topicId, topicLabel, impact: high|medium, why, unlocks: array of strings)\n`;
    prompt += `\nIMPORTANT: earlySignals should be CROSS-DOMAIN PATTERNS, not per-topic summaries.\n`;
  } else {
    prompt += `## FULL REPORT:\n`;
    prompt += `1. executiveSummary: 2-3 compelling sentences on current position and where to strengthen\n`;
    prompt += `2. strengths: HIGH-confidence validated advantages (title, description, sourceDomain, sourceTopic, confidence: "high")\n`;
    prompt += `3. risks: MEDIUM-confidence concerning signals (title, description, sourceDomain, sourceTopic)\n`;
    prompt += `4. criticalActions: Hard blockers (priority, title, sourceDomain, sourceTopic, sourceStatus, description, action)\n`;
    prompt += `5. needsValidation: Assumptions to test (title, sourceDomain, sourceTopic, description, validationStep)\n`;
    prompt += `6. roadmapPhase1: Days 1-30 actions for critical blockers (action, rationale, sourceDomain, sourceTopic)\n`;
    prompt += `7. roadmapPhase2: Days 31-60 actions for testing assumptions (action, rationale, sourceDomain, sourceTopic)\n`;
  }

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
