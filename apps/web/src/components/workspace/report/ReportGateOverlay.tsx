'use client';

import { useState } from 'react';
import { Lock, Check, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

type GateState = 'form' | 'sending' | 'sent' | 'error';

const BENEFITS = [
  'Generate your full Readiness Report',
  'Keep your assessment across devices',
  'Receive your PDF report by email',
];

export function ReportGateOverlay() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [state, setState] = useState<GateState>('form');
  const [sendError, setSendError] = useState('');

  const validateEmail = (v: string): boolean => {
    if (!v) { setEmailError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setState('sending');
    setSendError('');

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      // Store the desired destination so /auth/callback can redirect there
      sessionStorage.setItem('atlas-auth-next', '/workspace?view=report');

      // Embed the guest session ID in the redirect URL so it survives across tabs
      // (sessionStorage is tab-scoped; the URL param is not)
      const guestSessionId = sessionStorage.getItem('atlas_guest_session_id');
      const callbackUrl = guestSessionId
        ? `${appUrl}/auth/callback?guestSessionId=${guestSessionId}`
        : `${appUrl}/auth/callback`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: callbackUrl,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setState('sent');
    } catch (err) {
      setState('error');
      setSendError(err instanceof Error ? err.message : 'Failed to send link. Please try again.');
    }
  };

  return (
    <div className="overflow-y-auto bg-white workspace-panel">
      <div className="flex min-h-full items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">

          {state === 'sent' ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="h-7 w-7 text-[#0F7B6C]" />
              </div>
              <h2 className="mb-2 text-[18px] font-semibold text-[#37352F]">
                Check your inbox
              </h2>
              <p className="mb-1 text-[14px] text-[#5C5A56]">
                We sent a sign-in link to
              </p>
              <p className="mb-6 font-semibold text-[#37352F]">{email}</p>
              <p className="text-[13px] leading-relaxed text-[#9B9A97]">
                Click the link to sign in and your report will open automatically.
                The link expires in 1 hour.
              </p>
            </div>
          ) : (
            /* ── Gate form ── */
            <div className="rounded-xl border border-[#E8E6E1] bg-white p-8 shadow-sm">
              {/* Icon */}
              <div className="mb-5 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF5FF]">
                  <Lock className="h-6 w-6 text-[#2383E2]" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="mb-2 text-center text-[18px] font-semibold text-[#37352F]">
                Your report is one step away
              </h2>
              <p className="mb-5 text-center text-[13px] text-[#5C5A56]">
                Create a free account to unlock your full Readiness Report.
              </p>

              {/* Benefits */}
              <ul className="mb-6 space-y-2">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2.5 text-[13px] text-[#37352F]">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#DDEDEA]">
                      <Check className="h-3 w-3 text-[#0F7B6C]" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={() => email && validateEmail(email)}
                    className={`h-11 ${emailError ? 'border-red-400 focus:ring-red-400' : ''}`}
                    disabled={state === 'sending'}
                    autoFocus
                  />
                  {emailError && (
                    <p className="mt-1 text-[12px] text-red-600">{emailError}</p>
                  )}
                </div>

                {state === 'error' && sendError && (
                  <p className="text-[12px] text-red-600">{sendError}</p>
                )}

                <Button
                  type="submit"
                  disabled={state === 'sending' || !email}
                  className="w-full bg-[#2383E2] hover:bg-[#1a6fc0] text-white"
                  size="lg"
                >
                  {state === 'sending' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  {state === 'sending' ? 'Sending…' : 'Send magic link'}
                </Button>
              </form>

              <p className="mt-3 text-center text-[11px] text-[#9B9A97]">
                Takes 30 seconds · No password needed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
