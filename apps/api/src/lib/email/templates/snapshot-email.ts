import type { Snapshot, DomainType, ConfidenceLevel } from '@atlas/types';

interface SnapshotEmailProps {
  snapshot: Snapshot;
  email: string;
  downloadUrl: string;
}

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

export function renderSnapshotEmail({ snapshot, email, downloadUrl }: SnapshotEmailProps): string {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const keyFindings = snapshot.key_findings.slice(0, 5).map((finding, index) => `
    <div style="padding: 12px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 12px;">
      <p style="font-size: 14px; color: #334155; margin: 0 0 8px 0; line-height: 1.5;">${escapeHtml(finding.finding)}</p>
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

  const coverageRows = (Object.entries(snapshot.coverage_summary) as [DomainType, { high_confidence: number; medium_confidence: number; low_confidence: number }][])
    .map(([domain, levels]) => {
      const total = levels.high_confidence + levels.medium_confidence + levels.low_confidence;
      return `
        <tr>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${DOMAIN_LABELS[domain]}</td>
          <td style="padding: 8px 12px; font-size: 14px; color: #64748b; border-bottom: 1px solid #e2e8f0; text-align: center;">${total} inputs</td>
          <td style="padding: 8px 0; font-size: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: ${CONFIDENCE_COLORS.high};">${levels.high_confidence} high</span>
            /
            <span style="color: ${CONFIDENCE_COLORS.medium};">${levels.medium_confidence} medium</span>
            /
            <span style="color: ${CONFIDENCE_COLORS.low};">${levels.low_confidence} low</span>
          </td>
        </tr>
      `;
    }).join('');

  const recommendations = snapshot.next_steps.slice(0, 3).map((step) => `
    <div style="display: flex; margin-bottom: 16px;">
      <div style="width: 28px; height: 28px; background-color: #5754FF; color: #ffffff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 12px; flex-shrink: 0; line-height: 28px; text-align: center;">${step.priority}</div>
      <div style="flex: 1;">
        <p style="font-size: 14px; font-weight: 500; color: #0f172a; margin: 0 0 4px 0;">${escapeHtml(step.action)}</p>
        <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.4;">${escapeHtml(step.rationale)}</p>
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Atlas Readiness Snapshot</title>
  </head>
  <body style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background-color: #5754FF; color: #ffffff; padding: 32px; text-align: center;">
        <div style="width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 16px; line-height: 48px;">A</div>
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 8px 0;">Your Readiness Snapshot</h1>
        <p style="font-size: 14px; opacity: 0.9; margin: 0 0 12px 0;">A summary of what you know vs. what you're assuming about U.S. expansion</p>
        <p style="font-size: 12px; opacity: 0.7; margin: 0;">Generated for ${escapeHtml(email)} on ${generatedDate}</p>
      </div>

      <!-- Key Findings -->
      <div style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="font-size: 18px; font-weight: bold; color: #0f172a; margin: 0 0 16px 0;">Key Findings</h2>
        ${keyFindings}
      </div>

      <!-- Coverage Summary -->
      <div style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="font-size: 18px; font-weight: bold; color: #0f172a; margin: 0 0 16px 0;">Coverage Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            ${coverageRows}
          </tbody>
        </table>
      </div>

      <!-- Top Recommendations -->
      <div style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="font-size: 18px; font-weight: bold; color: #0f172a; margin: 0 0 16px 0;">Top Recommendations</h2>
        ${recommendations}
      </div>

      <!-- Download CTA -->
      <div style="padding: 32px; background-color: #f8fafc; text-align: center;">
        <p style="font-size: 14px; color: #64748b; margin: 0 0 20px 0; line-height: 1.5;">
          Download your complete snapshot PDF for the full analysis including all strengths,
          assumptions, and gaps.
        </p>
        <a href="${escapeHtml(downloadUrl)}" style="display: inline-block; padding: 12px 32px; background-color: #5754FF; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
          Download Full PDF
        </a>
      </div>

      <!-- Footer -->
      <div style="padding: 24px 32px; background-color: #f1f5f9; text-align: center;">
        <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;">
          Generated by Atlas Readiness Guide
        </p>
        <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.4;">
          This snapshot reflects your self-reported information.
          It is not a score or recommendation to expand.
        </p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Plain text version for email clients that don't support HTML
export function getPlainTextVersion(snapshot: Snapshot, email: string): string {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let text = `
YOUR ATLAS READINESS SNAPSHOT
=============================

Generated for ${email} on ${generatedDate}

KEY FINDINGS
------------
`;

  snapshot.key_findings.slice(0, 5).forEach((finding, index) => {
    text += `\n${index + 1}. ${finding.finding}\n   [${finding.confidence.toUpperCase()} confidence - ${DOMAIN_LABELS[finding.domain]}]\n`;
  });

  text += `
COVERAGE SUMMARY
----------------
`;

  (Object.entries(snapshot.coverage_summary) as [DomainType, { high_confidence: number; medium_confidence: number; low_confidence: number }][]).forEach(
    ([domain, levels]) => {
      const total = levels.high_confidence + levels.medium_confidence + levels.low_confidence;
      text += `${DOMAIN_LABELS[domain]}: ${total} inputs (${levels.high_confidence} high / ${levels.medium_confidence} medium / ${levels.low_confidence} low)\n`;
    }
  );

  text += `
TOP RECOMMENDATIONS
-------------------
`;

  snapshot.next_steps.slice(0, 3).forEach((step) => {
    text += `\n${step.priority}. ${step.action}\n   ${step.rationale}\n`;
  });

  text += `
---
Generated by Atlas Readiness Guide
This snapshot reflects your self-reported information.
It is not a score or recommendation to expand.
`;

  return text;
}
