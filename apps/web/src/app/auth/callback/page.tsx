'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createSession, claimGuestSession } from '@/lib/api-client';
import { saveSessionToStorage } from '@/lib/storage';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error params in the URL hash before doing anything else.
        // When a magic link is expired/invalid, Supabase redirects here with
        // #error=access_denied&error_code=otp_expired — getSession() returns
        // null without throwing, so the page would spin forever without this.
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const urlError = hashParams.get('error');
        const urlErrorCode = hashParams.get('error_code');
        if (urlError) {
          if (urlErrorCode === 'otp_expired') {
            setError('This magic link has expired. Please request a new one.');
          } else {
            const desc = hashParams.get('error_description')?.replace(/\+/g, ' ');
            setError(desc || 'Sign-in failed. Please try again.');
          }
          return;
        }

        // Supabase detects the token from the URL hash automatically when
        // detectSessionInUrl: true (set in supabase.ts). We wait for the
        // auth state to resolve before proceeding.
        const {
          data: { session: supabaseSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!supabaseSession) {
          // If no session yet, wait for the auth state change event
          // (happens when Supabase processes the URL hash on load)
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (event === 'SIGNED_IN' && session) {
                subscription.unsubscribe();
                await createAtlasSession(session.user.email!, router);
              } else if (event === 'SIGNED_OUT') {
                subscription.unsubscribe();
                setError('Sign-in failed. Please try again.');
              }
            }
          );
          return;
        }

        // Session already available (e.g. user returned to the tab)
        await createAtlasSession(supabaseSession.user.email!, router);
      } catch (err) {
        console.error('[Atlas] Auth callback error:', err);
        setError(
          err instanceof Error ? err.message : 'Sign-in failed. Please try again.'
        );
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="mb-2 text-lg font-semibold text-neutral-900">
            Sign-in failed
          </h1>
          <p className="mb-6 text-sm text-neutral-500">{error}</p>
          <button
            onClick={() => router.push('/start')}
            className="text-sm text-[#2383E2] hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#2383E2]" />
        <p className="text-sm text-neutral-500">Completing sign in…</p>
      </div>
    </div>
  );
}

async function createAtlasSession(email: string, router: ReturnType<typeof useRouter>) {
  // If a guest session ID is in the URL, promote it rather than create a new session.
  // This preserves all messages/inputs the user built up as a guest.
  const guestSessionId = new URLSearchParams(window.location.search).get('guestSessionId');

  let session: Awaited<ReturnType<typeof createSession>>['session'];
  let recoveryToken: string | null;

  if (guestSessionId) {
    try {
      ({ session, recoveryToken } = await claimGuestSession(guestSessionId, email));
    } catch {
      // Guest session may have expired or already been claimed — fall back to a fresh session
      ({ session, recoveryToken } = await createSession(email));
    }
  } else {
    ({ session, recoveryToken } = await createSession(email));
  }

  if (recoveryToken) {
    saveSessionToStorage({
      sessionId: session.id,
      recoveryToken,
      email: session.email,
    });
  }
  // Honour a next-path set by the gate overlay (e.g. /workspace?view=report)
  const next = sessionStorage.getItem('atlas-auth-next') || '/workspace';
  sessionStorage.removeItem('atlas-auth-next');
  router.replace(next);
}
