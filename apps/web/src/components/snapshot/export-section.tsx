'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Mail, Check, Loader2 } from 'lucide-react';
import { getPdfDownloadUrl, sendSnapshotEmail } from '@/lib/api-client';

interface ExportSectionProps {
  sessionId: string;
  email: string;
  className?: string;
}

export function ExportSection({ sessionId, email, className }: ExportSectionProps) {
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [emailState, setEmailState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);

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
      a.download = `atlas-readiness-snapshot-${sessionId.slice(0, 8)}.pdf`;
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

  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-6', className)}>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Export Your Snapshot
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        Download or email your readiness snapshot to share with your team.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleDownload}
          disabled={downloadState === 'loading'}
          variant="outline"
          className="flex-1"
        >
          {downloadState === 'loading' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : downloadState === 'done' ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {downloadState === 'done' ? 'Downloaded!' : 'Download PDF'}
        </Button>

        <Button
          onClick={handleEmailSend}
          disabled={emailState === 'loading' || emailState === 'done'}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {emailState === 'loading' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : emailState === 'done' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          {emailState === 'done' ? 'Sent!' : 'Email to Me'}
        </Button>
      </div>

      {emailState === 'done' && (
        <p className="text-sm text-green-600 mt-3 text-center">
          Snapshot sent to {email}
        </p>
      )}

      {emailState === 'error' && emailError && (
        <p className="text-sm text-red-600 mt-3 text-center">{emailError}</p>
      )}
    </div>
  );
}
