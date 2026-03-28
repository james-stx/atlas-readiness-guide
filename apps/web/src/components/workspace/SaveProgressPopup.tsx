'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as api from '@/lib/api-client';

interface SaveProgressPopupProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onClaimed: (email: string, recoveryToken: string) => void;
}

type Step = 'email' | 'sending' | 'otp' | 'verifying' | 'error';

export function SaveProgressPopup({ isOpen, onClose, sessionId, onClaimed }: SaveProgressPopupProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<Step>('email');
  const [errorMsg, setErrorMsg] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Reset when popup opens
  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setEmail('');
      setOtpCode('');
      setEmailError('');
      setErrorMsg('');
    }
  }, [isOpen]);

  // Focus OTP input when it appears
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpInputRef.current?.focus(), 50);
    }
  }, [step]);

  const validateEmail = (v: string): boolean => {
    if (!v) { setEmailError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setEmailError('Enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setStep('sending');
    setErrorMsg('');
    try {
      await api.sendOtp(email);
      setStep('otp');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send code. Try again.');
      setStep('error');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setStep('verifying');
    setErrorMsg('');
    try {
      await api.verifyOtp(email, otpCode.trim());
      const { session, recoveryToken } = await api.claimGuestSession(sessionId, email);
      onClaimed(session.email, recoveryToken);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid code. Please try again.');
      setStep('otp');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />

      {/* Popup */}
      <div
        className="fixed z-50 w-[300px] rounded-xl border border-[#E8E6E1] bg-white shadow-xl top-[52px] right-4"
        role="dialog"
        aria-label="Save your progress"
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {step === 'otp' || step === 'verifying' ? (
                <button
                  onClick={() => setStep('email')}
                  className="rounded p-0.5 text-[#9B9A97] hover:text-[#37352F] transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
              ) : null}
              <p className="text-[13px] font-semibold text-[#37352F]">
                {step === 'otp' || step === 'verifying' ? 'Enter your code' : 'Save your progress'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded p-0.5 text-[#9B9A97] hover:text-[#37352F] transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Email step */}
          {(step === 'email' || step === 'sending' || step === 'error') && (
            <>
              <p className="mb-4 text-[12px] leading-relaxed text-[#5C5A56]">
                Create a free account to keep your assessment and receive your report by email.
              </p>

              <form onSubmit={handleSendCode} className="space-y-2">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  className={`h-9 text-[13px] ${emailError ? 'border-red-400 focus:ring-red-400' : ''}`}
                  disabled={step === 'sending'}
                  autoFocus
                />
                {emailError && (
                  <p className="text-[11px] text-red-600">{emailError}</p>
                )}
                {step === 'error' && errorMsg && (
                  <p className="text-[11px] text-red-600">{errorMsg}</p>
                )}

                <Button
                  type="submit"
                  disabled={step === 'sending' || !email}
                  className="w-full h-9 bg-[#2383E2] hover:bg-[#1a6fc0] text-white text-[13px]"
                >
                  {step === 'sending' ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {step === 'sending' ? 'Sending…' : 'Send verification code'}
                </Button>
              </form>

              <p className="mt-2.5 text-center text-[11px] text-[#9B9A97]">
                We'll send a 6-digit code · No password needed
              </p>
            </>
          )}

          {/* OTP step */}
          {(step === 'otp' || step === 'verifying') && (
            <>
              <p className="mb-4 text-[12px] leading-relaxed text-[#5C5A56]">
                We sent a 6-digit code to{' '}
                <span className="font-medium text-[#37352F]">{email}</span>
              </p>

              <form onSubmit={handleVerify} className="space-y-2">
                <Input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-9 text-[13px] tracking-widest text-center font-mono"
                  disabled={step === 'verifying'}
                />
                {errorMsg && (
                  <p className="text-[11px] text-red-600">{errorMsg}</p>
                )}

                <Button
                  type="submit"
                  disabled={step === 'verifying' || otpCode.length < 6}
                  className="w-full h-9 bg-[#2383E2] hover:bg-[#1a6fc0] text-white text-[13px]"
                >
                  {step === 'verifying' ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {step === 'verifying' ? 'Verifying…' : 'Verify & save'}
                </Button>
              </form>

              <button
                onClick={() => handleSendCode({ preventDefault: () => {} } as React.FormEvent)}
                className="mt-2.5 w-full text-center text-[11px] text-[#9B9A97] hover:text-[#5C5A56] transition-colors"
              >
                Didn't get it? Resend code
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
