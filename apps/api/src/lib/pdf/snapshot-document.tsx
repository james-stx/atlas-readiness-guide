import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Snapshot, Session, DomainType, SnapshotV3, RoadmapAction } from '@atlas/types';

// ─── Constants ───────────────────────────────────────────────────────────────

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

const DOMAIN_ORDER: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

const POSITIONING_LABELS: Record<string, string> = {
  expansion_ready: 'Expansion Ready',
  well_positioned: 'Well Positioned',
  conditionally_positioned: 'Early Signs',
  foundation_building: 'Traction Needed',
  early_exploration: 'Too Early',
};

const POSITIONING_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  expansion_ready:          { bg: '#DCFCE7', text: '#166534', border: '#16A34A' },
  well_positioned:          { bg: '#DDEDEA', text: '#0F7B6C', border: '#0F7B6C' },
  conditionally_positioned: { bg: '#FBF3DB', text: '#9A6700', border: '#E9B949' },
  foundation_building:      { bg: '#FAEBDD', text: '#D9730D', border: '#D9730D' },
  early_exploration:        { bg: '#F7F6F3', text: '#9B9A97', border: '#E8E6E1' },
};

const CONF = {
  high:   { text: '#0F7B6C', bg: '#DDEDEA', label: 'HIGH' },
  medium: { text: '#9A6700', bg: '#FBF3DB', label: 'MEDIUM' },
  low:    { text: '#C9372C', bg: '#FFE2DD', label: 'LOW' },
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 56,
    paddingHorizontal: 0,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155',
    backgroundColor: '#ffffff',
  },

  // Blue header band (matches app's primary blue)
  headerBand: {
    backgroundColor: '#2383E2',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 44,
    marginBottom: 28,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerLogoBox: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerLogoLetter: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  headerBrand: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  headerMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
  },

  // Content area
  content: {
    paddingHorizontal: 44,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e6e1',
  },

  // Positioning badge
  positioningBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  positioningText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },

  // Executive summary
  summaryCard: {
    backgroundColor: '#F9F8F5',
    borderLeftWidth: 3,
    borderLeftColor: '#37352F',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 3,
  },
  summaryText: {
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 1.65,
  },

  // Coverage table
  coverageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f0ec',
  },
  coverageDomain: {
    width: 82,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  coverageDots: {
    flex: 1,
    flexDirection: 'row',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 3,
  },
  coverageCount: {
    width: 62,
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
  },
  confBadge: {
    width: 52,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
    alignItems: 'center',
    marginLeft: 8,
  },
  confBadgeText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  progressWrap: {
    height: 5,
    backgroundColor: '#e8e6e1',
    borderRadius: 3,
    marginTop: 12,
    marginBottom: 5,
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Generic cards
  cardBase: {
    paddingVertical: 11,
    paddingHorizontal: 13,
    marginBottom: 9,
    borderRadius: 4,
    borderLeftWidth: 3,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 5,
  },
  cardBody: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.55,
    marginBottom: 7,
  },
  cardHighlight: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 5,
  },
  chipText: {
    fontSize: 7,
    color: '#64748b',
  },

  // Critical action priority circle
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priorityCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#37352F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  priorityNum: {
    color: '#ffffff',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  priorityContent: {
    flex: 1,
  },

  // Roadmap phases (stacked vertically)
  roadmapPhase: {
    marginBottom: 18,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#37352F',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 10,
  },
  phaseTitle: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginRight: 8,
  },
  phaseSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 8,
  },
  roadmapItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 6,
    marginBottom: 9,
  },
  roadmapBullet: {
    color: '#37352F',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginRight: 8,
    lineHeight: 1.2,
  },
  roadmapBody: {
    flex: 1,
  },
  roadmapAction: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 3,
  },
  roadmapRationale: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.45,
  },

  // In-progress box
  inProgressBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 4,
    marginBottom: 18,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e8e6e1',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },

  emptyText: {
    fontSize: 9,
    color: '#94a3b8',
    fontStyle: 'italic',
    paddingVertical: 4,
  },
});

// ─── Small helper components ─────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={s.sectionLabel}>{children}</Text>;
}

function Chip({ label }: { label: string }) {
  return (
    <View style={s.chip}>
      <Text style={s.chipText}>{label}</Text>
    </View>
  );
}

function PageFooter({ left, right }: { left: string; right: string }) {
  return (
    <View style={s.footer}>
      <Text style={s.footerText}>{left}</Text>
      <Text style={s.footerText}>{right}</Text>
    </View>
  );
}

function RoadmapPhase({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: RoadmapAction[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <View style={s.roadmapPhase}>
      {/* Keep the phase header pinned to its first item */}
      <View wrap={false} style={{ marginBottom: 0 }}>
        <View style={s.phaseHeader}>
          <Text style={s.phaseTitle}>{title}</Text>
          <Text style={s.phaseSub}>{subtitle}</Text>
        </View>
        {items[0] && (
          <View style={s.roadmapItem}>
            <Text style={s.roadmapBullet}>›</Text>
            <View style={s.roadmapBody}>
              <Text style={s.roadmapAction}>{items[0].action}</Text>
              <Text style={s.roadmapRationale}>{items[0].rationale}</Text>
            </View>
          </View>
        )}
      </View>
      {items.slice(1).map((item, i) => (
        <View key={i} wrap={false} style={s.roadmapItem}>
          <Text style={s.roadmapBullet}>›</Text>
          <View style={s.roadmapBody}>
            <Text style={s.roadmapAction}>{item.action}</Text>
            <Text style={s.roadmapRationale}>{item.rationale}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Main document ───────────────────────────────────────────────────────────

export function SnapshotDocument({ snapshot, session }: { snapshot: Snapshot; session: Session }) {
  const v3 = snapshot.v3 as SnapshotV3 | undefined;
  const isAssessable = v3?.assessment_status === 'assessable';
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const positioning = v3?.expansion_positioning;
  const posLabel = positioning ? POSITIONING_LABELS[positioning] : null;
  const posStyle = positioning ? POSITIONING_STYLE[positioning] : null;

  const pct = v3?.coverage_percentage ?? 0;
  const barColor = pct >= 70 ? '#0F7B6C' : pct >= 40 ? '#D9730D' : '#C9372C';

  const hasRoadmap =
    (v3?.roadmap_phase1?.length ?? 0) > 0 ||
    (v3?.roadmap_phase2?.length ?? 0) > 0 ||
    (v3?.roadmap_phase3?.length ?? 0) > 0;

  return (
    <Document>

      {/* ══════════════════════════════════════════════
          PAGE 1 — Overview
      ══════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>

        {/* Header band */}
        <View style={s.headerBand}>
          <View style={s.headerBrandRow}>
            <View style={s.headerLogoBox}>
              <Text style={s.headerLogoLetter}>A</Text>
            </View>
            <Text style={s.headerBrand}>Atlas</Text>
          </View>
          <Text style={s.headerTitle}>U.S. Expansion Readiness Report</Text>
          <Text style={s.headerMeta}>{session.email}  ·  {generatedDate}</Text>
        </View>

        <View style={s.content}>

          {/* Positioning badge */}
          {posLabel && posStyle && (
            <View style={[s.positioningBadge, { backgroundColor: posStyle.bg, borderColor: posStyle.border }]}>
              <Text style={[s.positioningText, { color: posStyle.text }]}>{posLabel}</Text>
            </View>
          )}

          {/* Executive summary */}
          {v3?.executive_summary && (
            <View style={[s.section, { marginTop: posLabel ? 10 : 0 }]}>
              <View style={s.summaryCard}>
                <Text style={s.summaryText}>{v3.executive_summary}</Text>
              </View>
            </View>
          )}

          {/* In-progress notice */}
          {v3 && !isAssessable && (
            <View style={s.inProgressBox}>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#92400E', marginBottom: 4 }}>
                Assessment In Progress
              </Text>
              <Text style={{ fontSize: 9, color: '#78350F', lineHeight: 1.5 }}>
                {v3.topics_covered} of {v3.topics_total} topics covered. Complete at least 15 topics across all domains to unlock the full readiness report.
              </Text>
            </View>
          )}

          {/* Coverage */}
          <View style={s.section}>
            <SectionLabel>Coverage by Domain</SectionLabel>
            {DOMAIN_ORDER.map((domain) => {
              const dr = v3?.domains?.[domain];
              const covered = dr?.topics_covered ?? 0;
              const total = dr?.topics_total ?? 5;
              const conf = dr?.confidence_level ?? 'low';
              const c = CONF[conf];
              return (
                <View key={domain} style={s.coverageRow}>
                  <Text style={s.coverageDomain}>{DOMAIN_LABELS[domain]}</Text>
                  <View style={s.coverageDots}>
                    {Array.from({ length: total }, (_, i) => (
                      <View
                        key={i}
                        style={[s.dot, { backgroundColor: i < covered ? c.text : '#ddd8d0' }]}
                      />
                    ))}
                  </View>
                  <Text style={s.coverageCount}>{covered}/{total}</Text>
                  <View style={[s.confBadge, { backgroundColor: c.bg }]}>
                    <Text style={[s.confBadgeText, { color: c.text }]}>{c.label}</Text>
                  </View>
                </View>
              );
            })}
            {v3 && (
              <>
                <View style={s.progressWrap}>
                  <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                </View>
                <View style={s.progressLabel}>
                  <Text style={{ fontSize: 8, color: '#64748b' }}>Report Confidence</Text>
                  <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>
                    {pct}%  ·  {v3.topics_covered}/{v3.topics_total} topics
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Early signals (incomplete assessment only) */}
          {!isAssessable && v3?.early_signals && v3.early_signals.length > 0 && (
            <View style={s.section}>
              <SectionLabel>Early Signals</SectionLabel>
              {v3.early_signals.map((sig, i) => (
                <View key={i} wrap={false} style={[s.cardBase, { backgroundColor: '#FFFBF0', borderLeftColor: '#D9730D' }]}>
                  <Text style={s.cardTitle}>{sig.title}</Text>
                  <Text style={s.cardBody}>{sig.description}</Text>
                  <Text style={[s.cardHighlight, { color: '#D9730D' }]}>Implication: {sig.implication}</Text>
                </View>
              ))}
            </View>
          )}

        </View>

        <PageFooter
          left="Atlas Readiness Guide · STX Labs"
          right="Self-reported data only — not a recommendation to expand"
        />
      </Page>

      {/* ══════════════════════════════════════════════
          PAGE 2 — Strengths & Risks
      ══════════════════════════════════════════════ */}
      {isAssessable && (
        <Page size="A4" style={s.page}>
          <View style={s.headerBand}>
            <Text style={[s.headerTitle, { fontSize: 16, marginBottom: 0 }]}>Strengths &amp; Risks</Text>
          </View>

          <View style={s.content}>

            {/* Strengths */}
            <View style={s.section}>
              <SectionLabel>Validated Strengths</SectionLabel>
              {(!v3?.strengths || v3.strengths.length === 0) ? (
                <Text style={s.emptyText}>No clear strengths identified yet.</Text>
              ) : (
                v3.strengths.map((item, i) => (
                  <View key={i} wrap={false} style={[s.cardBase, { backgroundColor: '#F0FDF8', borderLeftColor: '#0F7B6C' }]}>
                    <Text style={s.cardTitle}>{item.title}</Text>
                    <Text style={s.cardBody}>{item.description}</Text>
                    <View style={s.cardMeta}>
                      <Chip label={DOMAIN_LABELS[item.source_domain]} />
                      <Chip label={item.source_topic} />
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Risks */}
            <View style={s.section}>
              <SectionLabel>Risks to Address</SectionLabel>
              {(!v3?.risks || v3.risks.length === 0) ? (
                <Text style={s.emptyText}>No significant risks identified.</Text>
              ) : (
                v3.risks.map((item, i) => (
                  <View key={i} wrap={false} style={[s.cardBase, { backgroundColor: '#FFFBF0', borderLeftColor: '#D9730D' }]}>
                    <Text style={s.cardTitle}>{item.title}</Text>
                    <Text style={s.cardBody}>{item.description}</Text>
                    <View style={s.cardMeta}>
                      <Chip label={DOMAIN_LABELS[item.source_domain]} />
                      <Chip label={item.source_topic} />
                    </View>
                  </View>
                ))
              )}
            </View>

          </View>

          <PageFooter
            left="Atlas Readiness Guide · STX Labs"
            right="Self-reported data only — not a recommendation to expand"
          />
        </Page>
      )}

      {/* ══════════════════════════════════════════════
          PAGE 3 — Critical Actions & Validation
      ══════════════════════════════════════════════ */}
      {isAssessable && (
        <Page size="A4" style={s.page}>
          <View style={s.headerBand}>
            <Text style={[s.headerTitle, { fontSize: 16, marginBottom: 0 }]}>Critical Actions &amp; Validation</Text>
          </View>

          <View style={s.content}>

            {/* Critical Actions */}
            {v3?.critical_actions && v3.critical_actions.length > 0 && (
              <View style={s.section}>
                <SectionLabel>Critical Actions — Hard blockers to resolve first</SectionLabel>
                {v3.critical_actions.map((ca, i) => (
                  <View key={i} wrap={false} style={[s.cardBase, { backgroundColor: '#FFF5F5', borderLeftColor: '#C9372C' }]}>
                    <View style={s.priorityRow}>
                      <View style={s.priorityCircle}>
                        <Text style={s.priorityNum}>{ca.priority}</Text>
                      </View>
                      <View style={s.priorityContent}>
                        <Text style={s.cardTitle}>{ca.title}</Text>
                        <Text style={s.cardBody}>{ca.description}</Text>
                        <Text style={[s.cardHighlight, { color: '#C9372C' }]}>Next step: {ca.action}</Text>
                        <View style={s.cardMeta}>
                          <Chip label={DOMAIN_LABELS[ca.source_domain]} />
                          <Chip label={ca.source_topic} />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Needs Validation */}
            {v3?.needs_validation && v3.needs_validation.length > 0 && (
              <View style={s.section}>
                <SectionLabel>Needs Validation — Assumptions to test before treating as fact</SectionLabel>
                {v3.needs_validation.map((nv, i) => (
                  <View key={i} wrap={false} style={[s.cardBase, { backgroundColor: '#FEFCE8', borderLeftColor: '#9A6700' }]}>
                    <Text style={s.cardTitle}>{nv.title}</Text>
                    <Text style={s.cardBody}>{nv.description}</Text>
                    <Text style={[s.cardHighlight, { color: '#9A6700' }]}>Validate: {nv.validation_step}</Text>
                    <View style={s.cardMeta}>
                      <Chip label={DOMAIN_LABELS[nv.source_domain]} />
                      <Chip label={nv.source_topic} />
                    </View>
                  </View>
                ))}
              </View>
            )}

          </View>

          <PageFooter
            left="Atlas Readiness Guide · STX Labs"
            right="Self-reported data only — not a recommendation to expand"
          />
        </Page>
      )}

      {/* ══════════════════════════════════════════════
          PAGE 4 — 90-Day Roadmap (stacked, not columns)
      ══════════════════════════════════════════════ */}
      {isAssessable && hasRoadmap && (
        <Page size="A4" style={s.page}>
          <View style={s.headerBand}>
            <Text style={[s.headerTitle, { fontSize: 16, marginBottom: 0 }]}>90-Day Roadmap</Text>
          </View>

          <View style={s.content}>
            <SectionLabel>Phased action plan — resolve blockers, test assumptions, scale what works</SectionLabel>

            <RoadmapPhase
              title="Phase 1: Days 1–30"
              subtitle="Resolve critical blockers"
              items={v3?.roadmap_phase1 ?? []}
            />
            <RoadmapPhase
              title="Phase 2: Days 31–60"
              subtitle="Test key assumptions"
              items={v3?.roadmap_phase2 ?? []}
            />
            <RoadmapPhase
              title="Phase 3: Days 61–90"
              subtitle="Scale what's working · Build U.S. operations foundation"
              items={v3?.roadmap_phase3 ?? []}
            />
          </View>

          <PageFooter
            left="Atlas Readiness Guide · STX Labs"
            right="Self-reported data only — not a recommendation to expand"
          />
        </Page>
      )}

    </Document>
  );
}
