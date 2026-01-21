import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Snapshot, Session, DomainType, ConfidenceLevel, GapImportance } from '@atlas/types';
import {
  pdfColors,
  fontSizes,
  commonStyles,
  confidenceStyles,
  importanceStyles,
} from './theme';

interface SnapshotDocumentProps {
  snapshot: Snapshot;
  session: Session;
}

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

const styles = StyleSheet.create({
  // Coverage grid
  coverageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  coverageItem: {
    width: '18%',
    padding: 8,
    backgroundColor: pdfColors.slate50,
    borderRadius: 6,
    alignItems: 'center',
  },
  coverageLabel: {
    fontSize: fontSizes.xs,
    color: pdfColors.slate500,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  coverageValue: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: pdfColors.slate900,
  },
  // Progress bar
  progressBar: {
    height: 8,
    backgroundColor: pdfColors.slate200,
    borderRadius: 4,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Findings
  findingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: pdfColors.slate100,
  },
  findingContent: {
    flex: 1,
    marginRight: 8,
  },
  // Two column layout
  twoColumn: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
  },
  // Strength/Assumption item
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    width: 16,
    fontSize: fontSizes.base,
    color: pdfColors.primary,
  },
  listContent: {
    flex: 1,
  },
  // Gap card
  gapCard: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
    borderLeftWidth: 4,
  },
  gapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  // Next step
  stepRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: pdfColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: pdfColors.white,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
});

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const style = confidenceStyles[level];
  return (
    <View style={[commonStyles.badge, { backgroundColor: style.backgroundColor }]}>
      <Text style={{ color: style.color, fontSize: fontSizes.xs, textTransform: 'uppercase' }}>
        {level}
      </Text>
    </View>
  );
}

function DomainBadge({ domain }: { domain: DomainType }) {
  return (
    <View style={[commonStyles.badge, { backgroundColor: pdfColors.slate100 }]}>
      <Text style={{ color: pdfColors.slate600, fontSize: fontSizes.xs }}>
        {DOMAIN_LABELS[domain]}
      </Text>
    </View>
  );
}

function CoverageSection({ coverage }: { coverage: Snapshot['coverage_summary'] }) {
  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.sectionTitle}>Coverage Overview</Text>
      <Text style={commonStyles.sectionDescription}>
        Your readiness across the five key domains for U.S. expansion
      </Text>

      <View style={styles.coverageGrid}>
        {(Object.entries(coverage) as [DomainType, { high: number; medium: number; low: number }][]).map(
          ([domain, levels]) => {
            const total = levels.high + levels.medium + levels.low;
            const highPct = total > 0 ? (levels.high / total) * 100 : 0;
            const medPct = total > 0 ? (levels.medium / total) * 100 : 0;

            return (
              <View key={domain} style={styles.coverageItem}>
                <Text style={styles.coverageLabel}>{DOMAIN_LABELS[domain]}</Text>
                <Text style={styles.coverageValue}>{total}</Text>
                <Text style={[commonStyles.textSm, { marginBottom: 4 }]}>inputs</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${highPct + medPct}%`,
                        backgroundColor: highPct > 50 ? pdfColors.green600 : pdfColors.amber600,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          }
        )}
      </View>
    </View>
  );
}

function KeyFindingsSection({ findings }: { findings: Snapshot['key_findings'] }) {
  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.sectionTitle}>Key Findings</Text>
      <Text style={commonStyles.sectionDescription}>
        The most important insights from your assessment
      </Text>

      {findings.map((finding, index) => (
        <View key={index} style={styles.findingRow}>
          <View style={styles.findingContent}>
            <Text style={commonStyles.text}>{finding.finding}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <ConfidenceBadge level={finding.confidence} />
            <DomainBadge domain={finding.domain} />
          </View>
        </View>
      ))}
    </View>
  );
}

function StrengthsSection({ strengths }: { strengths: Snapshot['strengths'] }) {
  return (
    <View style={styles.column}>
      <Text style={commonStyles.sectionTitle}>Strengths</Text>
      <Text style={commonStyles.sectionDescription}>Areas where you have solid knowledge</Text>

      {strengths.length === 0 ? (
        <Text style={commonStyles.textSm}>No clear strengths identified yet.</Text>
      ) : (
        strengths.map((strength, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <View style={styles.listContent}>
              <Text style={commonStyles.text}>{strength.item}</Text>
              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <DomainBadge domain={strength.domain} />
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

function AssumptionsSection({ assumptions }: { assumptions: Snapshot['assumptions'] }) {
  return (
    <View style={styles.column}>
      <Text style={commonStyles.sectionTitle}>Assumptions to Validate</Text>
      <Text style={commonStyles.sectionDescription}>Areas needing verification</Text>

      {assumptions.length === 0 ? (
        <Text style={commonStyles.textSm}>No assumptions requiring validation.</Text>
      ) : (
        assumptions.map((assumption, index) => (
          <View key={index} style={[commonStyles.card, { backgroundColor: pdfColors.amber100 }]}>
            <Text style={[commonStyles.text, commonStyles.bold]}>{assumption.item}</Text>
            <Text style={[commonStyles.textSm, { marginTop: 4 }]}>Risk: {assumption.risk}</Text>
            <Text style={[commonStyles.textSm, { color: pdfColors.amber600, marginTop: 2 }]}>
              To validate: {assumption.validation_suggestion}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

function GapsSection({ gaps }: { gaps: Snapshot['gaps'] }) {
  // Sort by importance
  const sortedGaps = [...gaps].sort((a, b) => {
    const order: Record<GapImportance, number> = { critical: 0, important: 1, 'nice-to-have': 2 };
    return order[a.importance] - order[b.importance];
  });

  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.sectionTitle}>Gaps to Address</Text>
      <Text style={commonStyles.sectionDescription}>
        Information you need but don't have yet
      </Text>

      {sortedGaps.length === 0 ? (
        <Text style={commonStyles.textSm}>No significant gaps identified.</Text>
      ) : (
        sortedGaps.map((gap, index) => {
          const style = importanceStyles[gap.importance];
          return (
            <View
              key={index}
              style={[
                styles.gapCard,
                {
                  backgroundColor: style.backgroundColor,
                  borderLeftColor: style.borderColor,
                },
              ]}
            >
              <View style={styles.gapHeader}>
                <View style={[commonStyles.badge, { backgroundColor: style.backgroundColor }]}>
                  <Text
                    style={{
                      color: style.badgeColor,
                      fontSize: fontSizes.xs,
                      textTransform: 'uppercase',
                    }}
                  >
                    {gap.importance}
                  </Text>
                </View>
                <DomainBadge domain={gap.domain} />
              </View>
              <Text style={[commonStyles.text, commonStyles.bold]}>{gap.item}</Text>
              <Text style={[commonStyles.textSm, { marginTop: 4 }]}>
                Recommendation: {gap.recommendation}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
}

function NextStepsSection({ steps }: { steps: Snapshot['next_steps'] }) {
  const sortedSteps = [...steps].sort((a, b) => a.priority - b.priority);

  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.sectionTitle}>Recommended Next Steps</Text>
      <Text style={commonStyles.sectionDescription}>
        Prioritized actions to improve your readiness
      </Text>

      {sortedSteps.map((step) => (
        <View key={step.priority} style={styles.stepRow}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{step.priority}</Text>
          </View>
          <View style={styles.stepContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={[commonStyles.text, commonStyles.bold, { flex: 1 }]}>{step.action}</Text>
              <DomainBadge domain={step.domain} />
            </View>
            <Text style={commonStyles.textSm}>{step.rationale}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function SnapshotDocument({ snapshot, session }: SnapshotDocumentProps) {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        {/* Header */}
        <View style={commonStyles.header}>
          <View style={commonStyles.logo}>
            <Text style={commonStyles.logoText}>A</Text>
          </View>
          <Text style={commonStyles.title}>Your Readiness Snapshot</Text>
          <Text style={commonStyles.subtitle}>
            A summary of what you know vs. what you're assuming about U.S. expansion
          </Text>
          <Text style={[commonStyles.textSm, { marginTop: 8 }]}>
            Generated for {session.email} on {generatedDate}
          </Text>
        </View>

        {/* Coverage */}
        <CoverageSection coverage={snapshot.coverage_summary} />

        {/* Key Findings */}
        <KeyFindingsSection findings={snapshot.key_findings} />

        {/* Footer for page 1 */}
        <View style={commonStyles.footer}>
          <Text>
            Generated by Atlas Readiness Guide | This snapshot reflects your self-reported
            information.
          </Text>
          <Text>It is not a score or recommendation to expand.</Text>
        </View>
      </Page>

      <Page size="A4" style={commonStyles.page}>
        {/* Strengths and Assumptions - Two Column */}
        <View style={styles.twoColumn}>
          <StrengthsSection strengths={snapshot.strengths} />
          <AssumptionsSection assumptions={snapshot.assumptions} />
        </View>

        {/* Gaps */}
        <GapsSection gaps={snapshot.gaps} />

        {/* Next Steps */}
        <NextStepsSection steps={snapshot.next_steps} />

        {/* Footer for page 2 */}
        <View style={commonStyles.footer}>
          <Text>
            Generated by Atlas Readiness Guide | This snapshot reflects your self-reported
            information.
          </Text>
          <Text>It is not a score or recommendation to expand.</Text>
        </View>
      </Page>
    </Document>
  );
}
