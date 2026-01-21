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
      router.push('/chat');
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
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Begin Your Assessment
            </h1>
            <p className="text-slate-600 mt-2">
              Enter your email to start or continue your U.S. expansion
              readiness assessment.
            </p>
          </div>

          {/* Recovery Option */}
          {showRecoveryOption && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-cyan-800 mb-3">
                We found an existing session. Would you like to continue where
                you left off?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleRecoverSession}
                  disabled={isRecovering}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  {isRecovering ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4 mr-2" />
                  )}
                  Continue Session
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRecoveryOption(false)}
                  className="flex-1"
                >
                  Start Fresh
                </Button>
              </div>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleStartNew} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Work Email
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
                className={emailError ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Starting...' : 'Start Assessment'}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Your email is used to save your progress and deliver your
              readiness snapshot. We don&apos;t share your information.
            </p>
          </div>

          {/* What to expect */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              What to Expect
            </h2>
            <ul className="space-y-3">
              {[
                { time: '20-30 min', desc: 'Guided conversation' },
                { time: '5 domains', desc: 'Market, Product, GTM, Ops, Finance' },
                { time: 'Instant', desc: 'Readiness snapshot at the end' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {item.time}
                  </span>
                  <span className="text-sm text-slate-600">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
