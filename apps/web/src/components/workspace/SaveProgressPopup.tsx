'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

const SENT_KEY = 'atlas-save-progress-sent';

interface SaveProgressPopupProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after the magic link is sent successfully (sets the "sent" state). */
  onSent: (email: string) => void;
}

type FormState = 'form' | 'sending' | 'sent' | 'error';

export function SaveProgressPopup({ isOpen, onClose, onSent }: SaveProgressPopupProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formState, setFormState] = useState<FormState>('form');
  const [sendError, setSendError] = useState('');

  // Auto-dismiss 3 s after success
  useEffect(() => {
    if (formState !== 'sent') return;
    const timer = setTimeout(() => {
      sessionStorage.setItem(SENT_KEY, 'true');
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [formState, onClose]);

  // Reset form state when popup opens
  useEffect(() => {
    if (isOpen) {
      setFormState('form');
      setSendError('');
      setEmailError('');
    }
  }, [isOpen]);

  const validateEmail = (v: string): boolean => {
    if (!v) { setEmailError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setEmailError('Enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setFormState('sending');
    setSendError('');

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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
      setFormState('sent');
      onSent(email);
    } catch (err) {
      setFormState('error');
      setSendError(err instanceof Error ? err.message : 'Failed to send link. Try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop — closes on outside click */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />

      {/* Popup panel */}
      <div
        className="fixed z-50 w-[280px] rounded-xl border border-[#E8E6E1] bg-white shadow-xl top-[52px] right-4"
        role="dialog"
        aria-label="Save your progress"
      >
        {formState === 'sent' ? (
          /* Success state */
          <div className="p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <Check className="h-5 w-5 text-[#0F7B6C]" />
            </div>
            <p className="text-[14px] font-semibold text-[#37352F]">Check your inbox!</p>
            <p className="mt-1 text-[12px] text-[#9B9A97]">
              Link sent to <span className="font-medium text-[#5C5A56]">{email}</span>
            </p>
          </div>
        ) : (
          /* Form state */
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#37352F]">Save your progress</p>
              <button
                onClick={onClose}
                className="rounded p-0.5 text-[#9B9A97] hover:text-[#37352F] transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-4 text-[12px] leading-relaxed text-[#5C5A56]">
              Create a free account to keep your assessment and receive your report by email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                className={`h-9 text-[13px] ${emailError ? 'border-red-400 focus:ring-red-400' : ''}`}
                disabled={formState === 'sending'}
                autoFocus
              />
              {emailError && (
                <p className="text-[11px] text-red-600">{emailError}</p>
              )}
              {formState === 'error' && sendError && (
                <p className="text-[11px] text-red-600">{sendError}</p>
              )}

              <Button
                type="submit"
                disabled={formState === 'sending' || !email}
                className="w-full h-9 bg-[#2383E2] hover:bg-[#1a6fc0] text-white text-[13px]"
              >
                {formState === 'sending' ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                )}
                {formState === 'sending' ? 'Sending…' : 'Send magic link'}
              </Button>
            </form>

            <p className="mt-2.5 text-center text-[11px] text-[#9B9A97]">
              Takes 30 sec · No password needed
            </p>
          </div>
        )}
      </div>
    </>
  );
}
