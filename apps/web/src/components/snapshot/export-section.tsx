'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Mail, Check, Loader2, Copy } from 'lucide-react';
import { getPdfDownloadUrl, sendSnapshotEmail } from '@/lib/api-client';
import type { KeyStats, ReadinessLevel } from '@atlas/types';

interface ExportSectionProps {
  sessionId: string;
  email: string;
  keyStats?: KeyStats;
  readinessLevel?: ReadinessLevel;
  className?: string;
}

const READINESS_LABELS: Record<ReadinessLevel, string> = {
  ready: 'ready to execute',
  ready_with_caveats: 'ready with caveats',
  not_ready: 'not yet ready',
};

export function ExportSection({
  sessionId,
  email,
  keyStats,
  readinessLevel,
  className,
}: ExportSectionProps) {
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [emailState, setEmailState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleDownload() {
    setDownloadState('loading');

    try {
      const url = getPdfDownloadUrl(sessionId);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `atlas-readiness-report-${sessionId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setDownloadState('done');
      setTimeout(() => setDownloadState('idle'), 3000);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadState('idle');
    }
  }

  async function handleEmailSend() {
    setEmailState('loading');
    setEmailError(null);

    try {
      await sendSnapshotEmail(sessionId);
      setEmailState('done');
    } catch (error) {
      console.error('Email send failed:', error);
      setEmailState('error');
      setEmailError(error instanceof Error ? error.message : 'Failed to send email');
    }
  }

  function handleCopyStats() {
    if (!keyStats) return;

    const domainsValidated = keyStats.high_confidence_inputs > 0 ?
      Math.min(5, Math.ceil(keyStats.high_confidence_inputs / 2)) : 0;

    const stats = [
      `• Assessed ${readinessLevel ? READINESS_LABELS[readinessLevel] : 'readiness'} for U.S. expansion`,
      `• ${keyStats.topics_covered} of ${keyStats.total_topics} readiness topics covered`,
      `• ${keyStats.high_confidence_inputs} high-confidence data points`,
      keyStats.critical_gaps_count > 0
        ? `• ${keyStats.critical_gaps_count} critical gap${keyStats.critical_gaps_count > 1 ? 's' : ''} identified for resolution`
        : '• No critical blockers identified',
    ].join('\n');

    navigator.clipboard.writeText(stats);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-1">
        Share & Export
      </h3>
      <p className="text-[13px] text-[#5C5A56] mb-4">
        Download or email your report to share with your team.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={handleDownload}
          disabled={downloadState === 'loading'}
          className="flex-1 bg-[#2383E2] hover:bg-[#1a6fc0] text-white"
        >
          {downloadState === 'loading' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : downloadState === 'done' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {downloadState === 'done' ? 'Downloaded!' : 'Download PDF'}
        </Button>

        <Button
          onClick={handleEmailSend}
          disabled={emailState === 'loading' || emailState === 'done'}
          variant="outline"
          className="flex-1 border-[#E8E6E1] hover:border-[#D4D1CB] hover:bg-[#FAF9F7] text-[#37352F]"
        >
          {emailState === 'loading' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : emailState === 'done' ? (
            <Check className="w-4 h-4 mr-2 text-[#0F7B6C]" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          {emailState === 'done' ? 'Sent!' : 'Email Report'}
        </Button>
      </div>

      {emailState === 'done' && (
        <p className="text-[13px] text-[#0F7B6C] mb-4 text-center">
          Report sent to {email}
        </p>
      )}

      {emailState === 'error' && emailError && (
        <p className="text-[13px] text-[#E03E3E] mb-4 text-center">{emailError}</p>
      )}

      {/* Deck-ready stats */}
      {keyStats && (
        <>
          <div className="border-t border-[#E8E6E1] my-4" />

          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97]">
              Key Stats for Your Deck
            </h4>
            <Button
              onClick={handleCopyStats}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[12px] text-[#9B9A97] hover:text-[#37352F]"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="bg-[#FAF9F7] rounded-lg p-4 text-[13px] text-[#5C5A56] space-y-1">
            <p>• {keyStats.topics_covered} of {keyStats.total_topics} readiness topics assessed</p>
            <p>• {keyStats.high_confidence_inputs} high-confidence inputs captured</p>
            {keyStats.critical_gaps_count > 0 ? (
              <p>• {keyStats.critical_gaps_count} critical gap{keyStats.critical_gaps_count > 1 ? 's' : ''} identified</p>
            ) : (
              <p>• No critical blockers identified</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
