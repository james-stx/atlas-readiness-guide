'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, RotateCcw, Mail, CheckCircle2, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAssessment } from '@/lib/context/assessment-context';
import { supabase } from '@/lib/supabase';

type View = 'choice' | 'signin' | 'sent';

export default function StartPage() {
  const router = useRouter();
  const { startGuestSession, recoverSession, hasStoredSession, session } = useAssessment();

  const [view, setView] = useState<View>('choice');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [isStartingGuest, setIsStartingGuest] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    if (hasStoredSession) setShowRecovery(true);
  }, [hasStoredSession]);

  useEffect(() => {
    if (session) router.push('/workspace');
  }, [session, router]);

  const validateEmail = (value: string): boolean => {
    if (!value) { setEmailError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsSending(true);
    setSendError('');

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${appUrl}/auth/callback`,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setView('sent');
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send link. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleContinueAsGuest = async () => {
    setIsStartingGuest(true);
    try {
      await startGuestSession();
      // session state update triggers the useEffect above → router.push('/workspace')
    } catch {
      setIsStartingGuest(false);
    }
  };

  const handleRecoverSession = async () => {
    setIsRecovering(true);
    const recovered = await recoverSession();
    if (!recovered) {
      setShowRecovery(false);
      setIsRecovering(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-100">
        <div className="max-w-wide mx-auto px-6 py-4 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-semibold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
              {view === 'sent' ? 'Check your inbox' : "Let's understand your readiness"}
            </h1>
            {view === 'choice' && (
              <p className="text-neutral-500 mt-2">
                Assess your U.S. expansion readiness in 25–30 minutes. Free.
              </p>
            )}
          </div>

          {/* Session recovery banner */}
          {showRecovery && view === 'choice' && (
            <div className="bg-accent-50 border border-accent-200 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <RotateCcw className="w-4 h-4 text-accent-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    Continue where you left off?
                  </p>
                  <p className="text-sm text-neutral-600 mb-4">
                    We found a saved session in your browser.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRecoverSession}
                      disabled={isRecovering}
                      variant="accent"
                      size="sm"
                    >
                      {isRecovering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Continue
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRecovery(false)}
                    >
                      Start fresh
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Choice view */}
          {view === 'choice' && (
            <div className="space-y-3">
              {/* Sign In card */}
              <button
                onClick={() => setView('signin')}
                className="w-full flex items-start gap-4 p-5 rounded-xl border-2 border-[#2383E2] bg-[#F7FBFF] hover:bg-[#EBF5FF] transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#2383E2] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[15px] font-semibold text-neutral-900">Sign In</span>
                    <span className="text-[11px] font-medium text-[#2383E2] bg-[#2383E2]/10 px-2 py-0.5 rounded-full">Recommended</span>
                  </div>
                  <p className="text-[13px] text-neutral-500 leading-relaxed">
                    Keep your progress across devices and receive your PDF report by email. Magic link — no password needed.
                  </p>
                </div>
              </button>

              {/* Guest card */}
              <button
                onClick={handleContinueAsGuest}
                disabled={isStartingGuest}
                className="w-full flex items-start gap-4 p-5 rounded-xl border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {isStartingGuest ? (
                    <Loader2 className="w-5 h-5 text-neutral-500 animate-spin" />
                  ) : (
                    <UserX className="w-5 h-5 text-neutral-500" />
                  )}
                </div>
                <div>
                  <span className="text-[15px] font-semibold text-neutral-900">
                    {isStartingGuest ? 'Starting…' : 'Continue as Guest'}
                  </span>
                  <p className="text-[13px] text-neutral-500 leading-relaxed mt-0.5">
                    Start immediately with no account. Note: the report requires sign-in, and guest sessions expire after 24 hours.
                  </p>
                </div>
              </button>

              <p className="text-xs text-neutral-400 text-center pt-2">
                We don&apos;t share your information.{' '}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-600">
                  Privacy Policy
                </Link>
              </p>
            </div>
          )}

          {/* Sign In view — magic link form */}
          {view === 'signin' && (
            <div>
              <button
                onClick={() => setView('choice')}
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Work email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={() => email && validateEmail(email)}
                    className={`h-12 ${emailError ? 'border-red-400 focus:ring-red-400' : ''}`}
                    disabled={isSending}
                    autoFocus
                  />
                  {emailError && <p className="text-sm text-red-600 mt-1.5">{emailError}</p>}
                </div>

                {sendError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{sendError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSending || !email}
                  className="w-full"
                  size="lg"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {isSending ? 'Sending…' : 'Send magic link'}
                </Button>

                <p className="text-xs text-neutral-400 text-center">
                  No password needed. Link expires in 1 hour.
                </p>
              </form>
            </div>
          )}

          {/* Sent view — confirmation */}
          {view === 'sent' && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              </div>
              <p className="text-neutral-600 mb-1">
                We sent a sign-in link to
              </p>
              <p className="font-semibold text-neutral-900 mb-6">{email}</p>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
                Click the link in that email to continue. The link expires in 1 hour.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <button
                  onClick={() => { setView('signin'); setSendError(''); }}
                  className="text-[#2383E2] hover:underline"
                >
                  Wrong email?
                </button>
                <span className="text-neutral-300">·</span>
                <button
                  onClick={handleSendMagicLink}
                  disabled={isSending}
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  {isSending ? 'Sending…' : 'Resend'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
