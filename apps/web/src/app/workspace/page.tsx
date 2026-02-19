'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';
import { useWorkspace } from '@/lib/context/workspace-context';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { Loader2 } from 'lucide-react';

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initRef = useRef(false);
  const viewParamHandled = useRef(false);
  const {
    session,
    messages,
    isLoading,
    initChat,
    recoverSession,
    hasStoredSession,
  } = useAssessment();
  const { switchToReport } = useWorkspace();

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

  // Handle URL parameter for view switching (e.g., /workspace?view=report)
  useEffect(() => {
    if (session && !viewParamHandled.current) {
      const view = searchParams.get('view');
      if (view === 'report') {
        switchToReport();
        // Clear the URL parameter
        router.replace('/workspace', { scroll: false });
      }
      viewParamHandled.current = true;
    }
  }, [session, searchParams, switchToReport, router]);

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

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-white">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-accent-600" />
            <p className="text-body text-[var(--text-secondary)]">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
