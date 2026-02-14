'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { Loader2 } from 'lucide-react';

export default function WorkspacePage() {
  const router = useRouter();
  const initRef = useRef(false);
  const {
    session,
    messages,
    isLoading,
    initChat,
    recoverSession,
    hasStoredSession,
  } = useAssessment();

  console.log('[Atlas] WorkspacePage render - session:', !!session, 'hasStoredSession:', hasStoredSession, 'status:', session?.status);

  // Redirect if no session
  useEffect(() => {
    if (!session && !hasStoredSession) {
      router.push('/start');
    } else if (!session && hasStoredSession) {
      recoverSession().then((recovered) => {
        if (!recovered) {
          router.push('/start');
        }
      });
    }
  }, [session, hasStoredSession, router, recoverSession]);

  // Initialize chat when session is ready
  useEffect(() => {
    if (session && !initRef.current && messages.length === 0) {
      initRef.current = true;
      initChat().catch(console.error);
    }
  }, [session, messages.length, initChat]);

  // Note: We no longer auto-redirect to snapshot when completed
  // Users should be able to navigate freely between workspace and report
  // The sidebar shows a "View Report" link when a report exists

  // Loading state while recovering session
  if (!session) {
    return (
      <div className="flex h-dvh items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-accent-600" />
          <p className="text-body text-[var(--text-secondary)]">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  return <WorkspaceLayout />;
}
