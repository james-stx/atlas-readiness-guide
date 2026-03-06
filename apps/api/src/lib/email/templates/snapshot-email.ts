import type { Snapshot, DomainType, ConfidenceLevel, ExpansionPositioning, ReadinessLevel, SnapshotV3 } from '@atlas/types';

interface SnapshotEmailProps {
  snapshot: Snapshot;
  email: string;
}

// ─── Labels & colours ───────────────────────────────────────────────────────

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  high: '#16a34a',
  medium: '#d97706',
  low: '#dc2626',
};

const POSITIONING_LABELS: Record<ExpansionPositioning, string> = {
  expansion_ready: 'Expansion Ready',
  well_positioned: 'Well Positioned',
  conditionally_positioned: 'Conditionally Positioned',
  foundation_building: 'Foundation Building',
  early_exploration: 'Early Exploration',
};

const POSITIONING_COLORS: Record<ExpansionPositioning, { bg: string; text: string; border: string }> = {
  expansion_ready:        { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' },
  well_positioned:        { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
  conditionally_positioned: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  foundation_building:    { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
  early_exploration:      { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' },
};

const READINESS_LABELS: Record<ReadinessLevel, string> = {
  ready: 'Ready to Execute',
  ready_with_caveats: 'Ready with Caveats',
  not_ready: 'Not Yet Ready',
};

const READINESS_COLORS: Record<ReadinessLevel, { bg: string; text: string; border: string }> = {
  ready:               { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' },
  ready_with_caveats:  { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  not_ready:           { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
};

// ─── Main HTML template ─────────────────────────────────────────────────────

export function renderSnapshotEmail({ snapshot, email }: SnapshotEmailProps): string {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const v3 = snapshot.v3 as SnapshotV3 | undefined;

  // Readiness badge — prefer expansion_positioning (V5), fall back to readiness_level
  const positioningBadge = v3?.expansion_positioning
    ? buildPositioningBadge(v3.expansion_positioning)
    : snapshot.readiness_level
      ? buildReadinessBadge(snapshot.readiness_level)
      : '';

  // Executive summary (V5) or verdict summary (V2)
  const summaryText = v3?.executive_summary || snapshot.verdict_summary || '';

  // Key findings
  const keyFindings = (snapshot.key_findings ?? []).slice(0, 5).map((finding) => `
    <div style="padding: 12px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 10px;">
      <p style="font-size: 14px; color: #334155; margin: 0 0 8px 0; line-height: 1.6;">${escapeHtml(finding.finding)}</p>
      <div style="display: flex; gap: 8px;">
        <span style="padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; background-color: ${CONFIDENCE_COLORS[finding.confidence]}20; color: ${CONFIDENCE_COLORS[finding.confidence]};">
          ${finding.confidence.toUpperCase()}
        </span>
        <span style="padding: 2px 8px; border-radius: 4px; font-size: 10px; background-color: #f1f5f9; color: #64748b;">
          ${DOMAIN_LABELS[finding.domain]}
        </span>
      </div>
    </div>
  `).join('');

  // Coverage rows
  const coverageRows = (Object.entries(snapshot.coverage_summary ?? {}) as [DomainType, { high_confidence: number; medium_confidence: number; low_confidence: number }][])
    .map(([domain, levels]) => {
      const total = levels.high_confidence + levels.medium_confidence + levels.low_confidence;
      return `
        <tr>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${DOMAIN_LABELS[domain]}</td>
          <td style="padding: 8px 12px; font-size: 14px; color: #64748b; border-bottom: 1px solid #e2e8f0; text-align: center;">${total} inputs</td>
          <td style="padding: 8px 0; font-size: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: ${CONFIDENCE_COLORS.high};">${levels.high_confidence}H</span>
            &nbsp;/&nbsp;
            <span style="color: ${CONFIDENCE_COLORS.medium};">${levels.medium_confidence}M</span>
            &nbsp;/&nbsp;
            <span style="color: ${CONFIDENCE_COLORS.low};">${levels.low_confidence}L</span>
          </td>
        </tr>
      `;
    }).join('');

  // Top recommendations
  const recommendations = (snapshot.next_steps ?? []).slice(0, 3).map((step) => `
    <div style="display: flex; margin-bottom: 16px;">
      <div style="width: 26px; height: 26px; background-color: #37352F; color: #ffffff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; margin-right: 12px; flex-shrink: 0; line-height: 26px; text-align: center;">${step.priority}</div>
      <div style="flex: 1;">
        <p style="font-size: 14px; font-weight: 500; color: #0f172a; margin: 0 0 4px 0;">${escapeHtml(step.action)}</p>
        <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">${escapeHtml(step.rationale)}</p>
      </div>
    </div>
  `).join('');

  const hasRecommendations = (snapshot.next_steps ?? []).length > 0;
  const hasKeyFindings = (snapshot.key_findings ?? []).length > 0;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Atlas Readiness Report</title>
  </head>
  <body style="background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">

      <!-- ── Header ── -->
      <div style="background-color: #37352F; color: #ffffff; padding: 32px; text-align: center;">
        <div style="width: 48px; height: 48px; background-color: rgba(255,255,255,0.15); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; margin-bottom: 14px; line-height: 48px;">A</div>
        <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.3px;">Your Readiness Report</h1>
        <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 0 0 14px 0; letter-spacing: 0.5px; text-transform: uppercase;">Powered by STX Labs</p>
        <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 0;">Generated for ${escapeHtml(email)} &middot; ${generatedDate}</p>
      </div>

      <!-- ── Readiness badge + summary ── -->
      ${positioningBadge || summaryText ? `
      <div style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0; text-align: center;">
        ${positioningBadge}
        ${summaryText ? `<p style="font-size: 14px; color: #334155; line-height: 1.7; margin: ${positioningBadge ? '14px' : '0'} 0 0 0;">${escapeHtml(summaryText)}</p>` : ''}
      </div>
      ` : ''}

      <!-- ── Key Findings ── -->
      ${hasKeyFindings ? `
      <div style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 14px 0;">Key Findings</h2>
        ${keyFindings}
      </div>
      ` : ''}

      <!-- ── Coverage Summary ── -->
      <div style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 14px 0;">Coverage Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            ${coverageRows}
          </tbody>
        </table>
      </div>

      <!-- ── Top Recommendations ── -->
      ${hasRecommendations ? `
      <div style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 14px 0;">Top Recommendations</h2>
        ${recommendations}
      </div>
      ` : ''}

      <!-- ── STX Labs pitch ── -->
      <div style="padding: 28px 32px; background-color: #fafaf9; border-bottom: 1px solid #e2e8f0;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Work with STX Labs</h2>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 16px 0; line-height: 1.6;">
          STX Labs helps APAC founders navigate U.S. market entry — from strategy to execution.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tbody>
            ${[
              ['Strategic market positioning', 'Cut through assumptions with validated U.S. market analysis and a clear ICP for the American market.'],
              ['GTM execution with U.S. partners', 'Access our network of U.S. distribution partners, channel resellers, and enterprise buyers.'],
              ['Investor-ready expansion planning', 'Build the financial model and narrative that U.S. VCs and strategic investors expect.'],
            ].map(([title, desc]) => `
              <tr>
                <td style="padding: 10px 0; vertical-align: top; border-bottom: 1px solid #f1f0ec;">
                  <p style="font-size: 14px; font-weight: 500; color: #0f172a; margin: 0 0 3px 0;">&rarr; ${escapeHtml(title)}</p>
                  <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">${escapeHtml(desc)}</p>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="text-align: center;">
          <a href="https://stxlabs.co/discovery" style="display: inline-block; padding: 12px 28px; background-color: #37352F; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.01em;">
            Book a Discovery Call &rarr;
          </a>
        </div>
      </div>

      <!-- ── PDF note ── -->
      <div style="padding: 20px 32px; background-color: #f8fafc; text-align: center; border-bottom: 1px solid #e2e8f0;">
        <p style="font-size: 13px; color: #64748b; margin: 0;">
          Your full report is attached as a PDF.
        </p>
      </div>

      <!-- ── Footer ── -->
      <div style="padding: 20px 32px; background-color: #f1f5f9; text-align: center;">
        <p style="font-size: 12px; color: #94a3b8; margin: 0 0 6px 0;">
          Generated by <strong>Atlas</strong> &middot; <a href="https://stxlabs.co" style="color: #94a3b8;">STX Labs</a> &middot; Sydney, Australia
        </p>
        <p style="font-size: 11px; color: #cbd5e1; margin: 0; line-height: 1.5;">
          This report reflects your self-reported information and is not a recommendation to expand.<br />
          <a href="https://stxlabs.co/unsubscribe" style="color: #94a3b8;">Unsubscribe</a>
          &nbsp;&middot;&nbsp;
          <a href="https://stxlabs.co/privacy" style="color: #94a3b8;">Privacy Policy</a>
        </p>
      </div>

    </div>
  </body>
</html>
  `.trim();
}

// ─── Badge helpers ───────────────────────────────────────────────────────────

function buildPositioningBadge(positioning: ExpansionPositioning): string {
  const label = POSITIONING_LABELS[positioning];
  const colors = POSITIONING_COLORS[positioning];
  return `<span style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; background-color: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border};">${label}</span>`;
}

function buildReadinessBadge(level: ReadinessLevel): string {
  const label = READINESS_LABELS[level];
  const colors = READINESS_COLORS[level];
  return `<span style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; background-color: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border};">${label}</span>`;
}

// ─── Plain-text version ──────────────────────────────────────────────────────

export function getPlainTextVersion(snapshot: Snapshot, email: string): string {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const v3 = snapshot.v3 as SnapshotV3 | undefined;
  const positioning = v3?.expansion_positioning;
  const summaryText = v3?.executive_summary || snapshot.verdict_summary || '';

  let text = `YOUR ATLAS READINESS REPORT
===========================
Powered by STX Labs

Generated for ${email} on ${generatedDate}

`;

  if (positioning) {
    text += `READINESS POSITIONING: ${POSITIONING_LABELS[positioning]}\n\n`;
  } else if (snapshot.readiness_level) {
    text += `READINESS LEVEL: ${READINESS_LABELS[snapshot.readiness_level]}\n\n`;
  }

  if (summaryText) {
    text += `SUMMARY\n-------\n${summaryText}\n\n`;
  }

  if ((snapshot.key_findings ?? []).length > 0) {
    text += `KEY FINDINGS\n------------\n`;
    (snapshot.key_findings ?? []).slice(0, 5).forEach((finding, index) => {
      text += `\n${index + 1}. ${finding.finding}\n   [${finding.confidence.toUpperCase()} confidence - ${DOMAIN_LABELS[finding.domain]}]\n`;
    });
    text += '\n';
  }

  text += `COVERAGE SUMMARY\n----------------\n`;
  (Object.entries(snapshot.coverage_summary ?? {}) as [DomainType, { high_confidence: number; medium_confidence: number; low_confidence: number }][]).forEach(
    ([domain, levels]) => {
      const total = levels.high_confidence + levels.medium_confidence + levels.low_confidence;
      text += `${DOMAIN_LABELS[domain]}: ${total} inputs (${levels.high_confidence}H / ${levels.medium_confidence}M / ${levels.low_confidence}L)\n`;
    }
  );

  if ((snapshot.next_steps ?? []).length > 0) {
    text += `\nTOP RECOMMENDATIONS\n-------------------\n`;
    (snapshot.next_steps ?? []).slice(0, 3).forEach((step) => {
      text += `\n${step.priority}. ${step.action}\n   ${step.rationale}\n`;
    });
  }

  text += `
WORK WITH STX LABS
------------------
STX Labs helps APAC founders navigate U.S. market entry.

→ Strategic market positioning
→ GTM execution with U.S. partners
→ Investor-ready expansion planning

Book a discovery call: https://stxlabs.co/discovery

---
Your full report is attached as a PDF.

Generated by Atlas · STX Labs · Sydney, Australia
https://stxlabs.co · Unsubscribe: https://stxlabs.co/unsubscribe
This report reflects your self-reported information.
`;

  return text;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
