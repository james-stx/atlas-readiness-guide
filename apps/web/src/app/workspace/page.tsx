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

  // Redirect to snapshot when completed
  useEffect(() => {
    if (session?.status === 'completed') {
      router.push('/snapshot');
    }
  }, [session?.status, router]);

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
