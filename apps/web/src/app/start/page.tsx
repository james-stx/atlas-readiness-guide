'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AtlasLogo } from '@/components/AtlasLogo';
import { ArrowLeft, ArrowRight, Loader2, RotateCcw, Mail, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAssessment } from '@/lib/context/assessment-context';
import { supabase } from '@/lib/supabase';

type View = 'choice' | 'signin' | 'code';

export default function StartPage() {
  const router = useRouter();
  const { startSession, startGuestSession, recoverSession, hasStoredSession, session } = useAssessment();

  const [view, setView] = useState<View>('choice');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsSending(true);
    setSendError('');

    try {
      // Omitting emailRedirectTo sends a 6-digit OTP code instead of a magic link.
      // This is immune to email security scanners that pre-click links.
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setView('code');
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send code. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    setIsVerifying(true);
    setVerifyError('');

    try {
      // Supabase assigns different token types depending on whether this is a
      // new signup or an existing-user sign-in. Try both to cover all cases.
      const token = otpCode.trim();
      let result = await supabase.auth.verifyOtp({ email, token, type: 'email' });
      if (result.error) {
        result = await supabase.auth.verifyOtp({ email, token, type: 'magiclink' });
      }

      const { data, error } = result;
      if (error) throw error;
      if (!data.user?.email) throw new Error('Sign-in succeeded but no email returned.');

      // Create Atlas session — saves to localStorage + sets context session state.
      // The session state update triggers the useEffect above → router.push('/workspace').
      await startSession(data.user.email);
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleContinueAsGuest = async () => {
    setIsStartingGuest(true);
    try {
      await startGuestSession();
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
            <AtlasLogo variant="dark" size={48} className="mx-auto mb-6" />
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
              {view === 'code' ? 'Check your inbox' : "Let's understand your readiness"}
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
                    Keep your progress across devices and receive your PDF report by email. We'll send a 6-digit code — no password needed.
                  </p>
                </div>
              </button>

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

          {/* Sign in — email entry */}
          {view === 'signin' && (
            <div>
              <button
                onClick={() => setView('choice')}
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
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

                <Button type="submit" disabled={isSending || !email} className="w-full" size="lg">
                  {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                  {isSending ? 'Sending…' : 'Send verification code'}
                </Button>

                <p className="text-xs text-neutral-400 text-center">
                  No password needed. Code expires in 1 hour.
                </p>
              </form>
            </div>
          )}

          {/* Code entry */}
          {view === 'code' && (
            <div>
              <p className="text-neutral-600 mb-1 text-center">
                We sent a 6-digit code to
              </p>
              <p className="font-semibold text-neutral-900 mb-6 text-center">{email}</p>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-2">
                    Verification code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-12 text-center text-xl tracking-widest font-mono"
                    disabled={isVerifying}
                    autoFocus
                    autoComplete="one-time-code"
                  />
                </div>

                {verifyError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{verifyError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isVerifying || otpCode.length < 6}
                  className="w-full"
                  size="lg"
                >
                  {isVerifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                  {isVerifying ? 'Verifying…' : 'Continue'}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-4 text-sm mt-6">
                <button
                  onClick={() => { setView('signin'); setOtpCode(''); setVerifyError(''); }}
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  Wrong email?
                </button>
                <span className="text-neutral-300">·</span>
                <button
                  onClick={handleSendCode as unknown as React.MouseEventHandler}
                  disabled={isSending}
                  className="text-[#2383E2] hover:underline disabled:opacity-50"
                >
                  {isSending ? 'Sending…' : 'Resend code'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
