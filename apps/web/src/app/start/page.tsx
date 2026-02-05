'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAssessment } from '@/lib/context/assessment-context';
import { ArrowLeft, ArrowRight, Loader2, RotateCcw } from 'lucide-react';

export default function StartPage() {
  const router = useRouter();
  const {
    startSession,
    recoverSession,
    hasStoredSession,
    isLoading,
    error,
    session,
  } = useAssessment();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showRecoveryOption, setShowRecoveryOption] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    if (hasStoredSession) {
      setShowRecoveryOption(true);
    }
  }, [hasStoredSession]);

  // Redirect to chat once session is active
  useEffect(() => {
    if (session) {
      router.push('/workspace');
    }
  }, [session, router]);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleStartNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    try {
      await startSession(email);
    } catch (err) {
      // Error is handled by context
    }
  };

  const handleRecoverSession = async () => {
    setIsRecovering(true);
    try {
      const recovered = await recoverSession();
      if (!recovered) {
        setShowRecoveryOption(false);
      }
    } finally {
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

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Welcome */}
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-semibold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
              Let&apos;s understand your readiness
            </h1>
            <p className="text-neutral-500 mt-2">
              Enter your email to start or continue your assessment.
            </p>
          </div>

          {/* Recovery Option */}
          {showRecoveryOption && (
            <div className="bg-accent-50 border border-accent-200 rounded-xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <RotateCcw className="w-4 h-4 text-accent-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    Continue where you left off?
                  </p>
                  <p className="text-sm text-neutral-600 mb-4">
                    We found an existing session saved in your browser.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRecoverSession}
                      disabled={isRecovering}
                      variant="accent"
                      size="sm"
                    >
                      {isRecovering ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Continue
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRecoveryOption(false)}
                    >
                      Start fresh
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleStartNew} className="space-y-5">
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
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-sm text-red-600 mt-2">{emailError}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Starting...' : 'Start assessment'}
            </Button>
          </form>

          {/* Privacy note */}
          <p className="mt-6 text-xs text-neutral-400 text-center">
            Your email is used to save progress and deliver your results.
            <br />
            We don&apos;t share your information.{' '}
            <Link href="/privacy" className="text-neutral-500 hover:text-neutral-700 underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>

          {/* What to expect */}
          <div className="mt-12 pt-8 border-t border-neutral-100">
            <h2 className="text-sm font-medium text-neutral-900 mb-5">
              What to expect
            </h2>
            <div className="space-y-4">
              <ExpectationItem
                icon={<ClockIcon />}
                title="~25 minutes"
                description="Guided conversation at your pace"
              />
              <ExpectationItem
                icon={<GridIcon />}
                title="5 domains"
                description="Market, Product, GTM, Operations, Financials"
              />
              <ExpectationItem
                icon={<FileIcon />}
                title="Instant snapshot"
                description="Your readiness summary, ready to share"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ExpectationItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-500">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
