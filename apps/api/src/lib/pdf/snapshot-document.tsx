import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Snapshot, Session, DomainType } from '@atlas/types';
import {
  pdfColors,
  fontSizes,
  commonStyles,
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

const POSITIONING_LABELS: Record<string, string> = {
  expansion_ready: 'Expansion Ready',
  well_positioned: 'Well Positioned',
  conditionally_positioned: 'Early Signs',
  foundation_building: 'Traction Needed',
  early_exploration: 'Too Early',
};

const styles = StyleSheet.create({
  // Positioning badge
  positioningBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  positioningText: {
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  // Executive summary
  execSummary: {
    backgroundColor: '#F9F8F5',
    borderLeftWidth: 3,
    borderLeftColor: pdfColors.primary,
    padding: 12,
    marginBottom: 20,
    borderRadius: 4,
  },
  // Coverage grid
  coverageGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  coverageItem: {
    flex: 1,
    padding: 8,
    backgroundColor: pdfColors.slate50,
    borderRadius: 4,
    alignItems: 'center',
  },
  coverageLabel: {
    fontSize: fontSizes.xs,
    color: pdfColors.slate500,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  coverageValue: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: pdfColors.slate900,
  },
  coverageSub: {
    fontSize: fontSizes.xs,
    color: pdfColors.slate500,
  },
  // Domain badge
  domainBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: pdfColors.slate100,
  },
  domainBadgeText: {
    fontSize: fontSizes.xs,
    color: pdfColors.slate500,
  },
  // Strength card
  strengthCard: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 3,
    borderLeftColor: pdfColors.green600,
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
  // Risk card
  riskCard: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 3,
    borderLeftColor: pdfColors.amber600,
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
  // Critical action card
  criticalCard: {
    borderWidth: 1,
    borderColor: pdfColors.slate300,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  priorityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: pdfColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  priorityText: {
    color: pdfColors.white,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  // Validation card
  validationCard: {
    backgroundColor: pdfColors.slate50,
    borderLeftWidth: 3,
    borderLeftColor: pdfColors.slate500,
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
  // Roadmap phase
  phaseHeader: {
    backgroundColor: pdfColors.slate100,
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  roadmapItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  bullet: {
    width: 14,
    fontSize: fontSizes.base,
    color: pdfColors.primary,
  },
  itemContent: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  // Two column
  twoCol: {
    flexDirection: 'row',
    gap: 14,
  },
  col: {
    flex: 1,
  },
  // Empty state
  emptyNote: {
    fontSize: fontSizes.sm,
    color: pdfColors.slate500,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
});

function DomainBadge({ domain }: { domain: DomainType }) {
  return (
    <View style={styles.domainBadge}>
      <Text style={styles.domainBadgeText}>{DOMAIN_LABELS[domain]}</Text>
    </View>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={commonStyles.sectionTitle}>{title}</Text>
      {description && (
        <Text style={[commonStyles.textSm, { marginTop: 2 }]}>{description}</Text>
      )}
    </View>
  );
}

export function SnapshotDocument({ snapshot, session }: SnapshotDocumentProps) {
  const v3 = snapshot.v3;
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Derive positioning display
  const positioning = v3?.expansion_positioning;
  const positioningLabel = positioning ? POSITIONING_LABELS[positioning] : null;
  const isAssessable = v3?.assessment_status === 'assessable';

  // Coverage per domain (from v3.domains if available, else from legacy coverage_summary)
  const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

  return (
    <Document>
      {/* ─── PAGE 1: Header + Overview ─── */}
      <Page size="A4" style={commonStyles.page}>
        {/* Header */}
        <View style={commonStyles.header}>
          <View style={commonStyles.logo}>
            <Text style={commonStyles.logoText}>A</Text>
          </View>
          <Text style={commonStyles.title}>U.S. Expansion Readiness Report</Text>
          <Text style={commonStyles.subtitle}>
            Assessment for {session.email}
          </Text>
          <Text style={[commonStyles.textSm, { marginTop: 6 }]}>
            Generated on {generatedDate}
          </Text>
        </View>

        {/* Positioning badge + executive summary (V5 assessable only) */}
        {isAssessable && positioningLabel && (
          <View style={[styles.positioningBadge, { backgroundColor: '#EDE9FE' }]}>
            <Text style={[styles.positioningText, { color: '#5B21B6' }]}>
              {positioningLabel}
            </Text>
          </View>
        )}

        {isAssessable && v3?.executive_summary && (
          <View style={styles.execSummary}>
            <Text style={[commonStyles.text, { lineHeight: 1.6 }]}>
              {v3.executive_summary}
            </Text>
          </View>
        )}

        {/* Coverage overview */}
        <View style={commonStyles.section}>
          <SectionTitle
            title="Coverage Overview"
            description="Topics assessed across the five key domains"
          />
          <View style={styles.coverageGrid}>
            {domains.map((domain) => {
              const dr = v3?.domains?.[domain];
              const covered = dr ? dr.topics_covered : 0;
              const total = dr ? dr.topics_total : 5;
              const legacyCoverage = snapshot.coverage_summary?.[domain];
              const legacyTotal = legacyCoverage
                ? legacyCoverage.high_confidence + legacyCoverage.medium_confidence + legacyCoverage.low_confidence
                : 0;
              const displayCovered = dr ? covered : legacyTotal;
              return (
                <View key={domain} style={styles.coverageItem}>
                  <Text style={styles.coverageLabel}>{DOMAIN_LABELS[domain]}</Text>
                  <Text style={styles.coverageValue}>{displayCovered}</Text>
                  <Text style={styles.coverageSub}>{dr ? `/ ${total} topics` : 'inputs'}</Text>
                </View>
              );
            })}
          </View>

          {v3 && (
            <Text style={commonStyles.textSm}>
              Overall coverage: {v3.topics_covered}/{v3.topics_total} topics ({v3.coverage_percentage}%)
              {' · '}
              Status: {v3.assessment_status === 'assessable' ? 'Full Assessment' : 'In Progress'}
            </Text>
          )}
        </View>

        {/* Incomplete assessment note */}
        {v3 && !isAssessable && (
          <View style={{ backgroundColor: '#FEF3C7', padding: 12, borderRadius: 6, marginBottom: 16 }}>
            <Text style={[commonStyles.text, { fontWeight: 'bold', marginBottom: 4 }]}>
              Assessment In Progress
            </Text>
            <Text style={commonStyles.textSm}>
              {v3.topics_covered} of {v3.topics_total} topics covered. Complete at least 15 topics across all domains to unlock the full readiness report.
            </Text>
          </View>
        )}

        {/* Early signals for incomplete assessments */}
        {!isAssessable && v3?.early_signals && v3.early_signals.length > 0 && (
          <View style={commonStyles.section}>
            <SectionTitle title="Early Signals" description="Cross-domain patterns identified so far" />
            {v3.early_signals.map((signal, i) => (
              <View key={i} style={[styles.riskCard, { marginBottom: 8 }]}>
                <Text style={[commonStyles.text, { fontWeight: 'bold', marginBottom: 4 }]}>
                  {signal.title}
                </Text>
                <Text style={commonStyles.textSm}>{signal.description}</Text>
                <Text style={[commonStyles.textSm, { color: pdfColors.amber600, marginTop: 4 }]}>
                  Implication: {signal.implication}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={commonStyles.footer}>
          <Text>Atlas Readiness Guide · This report reflects your self-reported information.</Text>
          <Text>It is not a score or recommendation to expand.</Text>
        </View>
      </Page>

      {/* ─── PAGE 2: Strengths + Risks (assessable only) ─── */}
      {isAssessable && (
        <Page size="A4" style={commonStyles.page}>
          {/* Strengths */}
          <View style={commonStyles.section}>
            <SectionTitle
              title="Strengths"
              description="High-confidence validated advantages for U.S. expansion"
            />
            {(!v3?.strengths || v3.strengths.length === 0) ? (
              <Text style={styles.emptyNote}>No clear strengths identified yet.</Text>
            ) : (
              v3.strengths.map((s, i) => (
                <View key={i} style={styles.strengthCard}>
                  <Text style={[commonStyles.text, { fontWeight: 'bold', marginBottom: 4 }]}>
                    {s.title}
                  </Text>
                  <Text style={commonStyles.textSm}>{s.description}</Text>
                  <View style={styles.metaRow}>
                    <DomainBadge domain={s.source_domain} />
                    <Text style={commonStyles.textSm}>{s.source_topic}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Risks */}
          <View style={commonStyles.section}>
            <SectionTitle
              title="Risks"
              description="Signals that will compound if ignored"
            />
            {(!v3?.risks || v3.risks.length === 0) ? (
              <Text style={styles.emptyNote}>No significant risks identified.</Text>
            ) : (
              v3.risks.map((r, i) => (
                <View key={i} style={styles.riskCard}>
                  <Text style={[commonStyles.text, { fontWeight: 'bold', marginBottom: 4 }]}>
                    {r.title}
                  </Text>
                  <Text style={commonStyles.textSm}>{r.description}</Text>
                  <View style={styles.metaRow}>
                    <DomainBadge domain={r.source_domain} />
                    <Text style={commonStyles.textSm}>{r.source_topic}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={commonStyles.footer}>
            <Text>Atlas Readiness Guide · This report reflects your self-reported information.</Text>
            <Text>It is not a score or recommendation to expand.</Text>
          </View>
        </Page>
      )}

      {/* ─── PAGE 3: Critical Actions + Validation + Roadmap (assessable only) ─── */}
      {isAssessable && (
        <Page size="A4" style={commonStyles.page}>
          {/* Critical Actions */}
          {v3?.critical_actions && v3.critical_actions.length > 0 && (
            <View style={commonStyles.section}>
              <SectionTitle
                title="Critical Actions"
                description="Hard blockers that must be resolved before committing capital"
              />
              {v3.critical_actions.map((ca, i) => (
                <View key={i} style={styles.criticalCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityText}>{ca.priority}</Text>
                    </View>
                    <Text style={[commonStyles.text, { fontWeight: 'bold', flex: 1 }]}>{ca.title}</Text>
                    <DomainBadge domain={ca.source_domain} />
                  </View>
                  <Text style={commonStyles.textSm}>{ca.description}</Text>
                  <Text style={[commonStyles.textSm, { color: pdfColors.primary, marginTop: 6, fontWeight: 'bold' }]}>
                    Next step: {ca.action}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Needs Validation */}
          {v3?.needs_validation && v3.needs_validation.length > 0 && (
            <View style={commonStyles.section}>
              <SectionTitle
                title="Needs Validation"
                description="Assumptions to test before treating as fact"
              />
              {v3.needs_validation.map((nv, i) => (
                <View key={i} style={styles.validationCard}>
                  <Text style={[commonStyles.text, { fontWeight: 'bold', marginBottom: 4 }]}>
                    {nv.title}
                  </Text>
                  <Text style={commonStyles.textSm}>{nv.description}</Text>
                  <Text style={[commonStyles.textSm, { color: pdfColors.slate700, marginTop: 4, fontWeight: 'bold' }]}>
                    Validate: {nv.validation_step}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Roadmap */}
          {((v3?.roadmap_phase1 && v3.roadmap_phase1.length > 0) || (v3?.roadmap_phase2 && v3.roadmap_phase2.length > 0)) && (
            <View style={commonStyles.section}>
              <SectionTitle title="90-Day Roadmap" />
              <View style={styles.twoCol}>
                {/* Phase 1 */}
                <View style={styles.col}>
                  <View style={styles.phaseHeader}>
                    <Text style={[commonStyles.text, { fontWeight: 'bold' }]}>Days 1–30</Text>
                    <Text style={commonStyles.textSm}>Resolve critical blockers</Text>
                  </View>
                  {(v3?.roadmap_phase1 || []).map((item, i) => (
                    <View key={i} style={styles.roadmapItem}>
                      <Text style={styles.bullet}>›</Text>
                      <View style={styles.itemContent}>
                        <Text style={commonStyles.textSm}>{item.action}</Text>
                        <Text style={[commonStyles.textSm, { color: pdfColors.slate500, marginTop: 2 }]}>
                          {item.rationale}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
                {/* Phase 2 */}
                <View style={styles.col}>
                  <View style={styles.phaseHeader}>
                    <Text style={[commonStyles.text, { fontWeight: 'bold' }]}>Days 31–60</Text>
                    <Text style={commonStyles.textSm}>Test key assumptions</Text>
                  </View>
                  {(v3?.roadmap_phase2 || []).map((item, i) => (
                    <View key={i} style={styles.roadmapItem}>
                      <Text style={styles.bullet}>›</Text>
                      <View style={styles.itemContent}>
                        <Text style={commonStyles.textSm}>{item.action}</Text>
                        <Text style={[commonStyles.textSm, { color: pdfColors.slate500, marginTop: 2 }]}>
                          {item.rationale}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          <View style={commonStyles.footer}>
            <Text>Atlas Readiness Guide · This report reflects your self-reported information.</Text>
            <Text>It is not a score or recommendation to expand.</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}
