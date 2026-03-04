'use client';

import {
  Compass,
  PanelRightClose,
  MessageSquare,
  Clock,
  Upload,
  Check,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { SaveProgressPopup } from './SaveProgressPopup';

const SENT_KEY = 'atlas-save-progress-sent';

export function TopBar() {
  const { progressState, toggleChat, isChatOpen } = useWorkspace();
  const { isGuest, session, clearSession } = useAssessment();
  const router = useRouter();

  const [popupOpen, setPopupOpen] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const progress = progressState.overallProgress;

  // Initialise sent state from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLinkSent(!!sessionStorage.getItem(SENT_KEY));
    }
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    if (!avatarMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [avatarMenuOpen]);

  const remainingTime = useMemo(() => {
    const completedTopics = Math.round((progress / 100) * 25);
    const remainingTopics = 25 - completedTopics;
    const minutes = remainingTopics * 4;
    if (minutes <= 0) return null;
    if (minutes < 60) return `~${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `~${hours}h ${mins}m` : `~${hours}h`;
  }, [progress]);

  // Derive avatar initials from email
  const avatarInitials = useMemo(() => {
    if (!session?.email) return '?';
    const local = session.email.split('@')[0];
    return local.slice(0, 2).toUpperCase();
  }, [session?.email]);

  const handleSignOut = async () => {
    setAvatarMenuOpen(false);
    await supabase.auth.signOut();
    clearSession();
    router.push('/start');
  };

  return (
    <header className="relative flex h-12 items-center justify-between border-b border-[#E8E6E1] bg-white px-4 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#37352F]">
          <Compass className="h-4 w-4 text-white" />
        </div>
        <span className="text-[14px] font-semibold text-[#37352F]">Atlas</span>
      </div>

      {/* Center: Progress */}
      <div className="hidden items-center gap-3 sm:flex">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-[120px] overflow-hidden rounded-full bg-[#E8E6E1]">
            <div
              className="h-full rounded-full bg-[#2383E2] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[12px] tabular-nums text-[#9B9A97]">{progress}%</span>
          {remainingTime && (
            <>
              <span className="text-[#D4D1CB]">·</span>
              <span className="flex items-center gap-1 text-[12px] text-[#9B9A97]">
                <Clock className="h-3 w-3" />
                {remainingTime}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: Auth indicator + Chat toggle */}
      <div className="flex items-center gap-2">

        {/* Guest section */}
        {isGuest && (
          <>
            {/* GUEST badge */}
            <span
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#92400E] cursor-default select-none"
              aria-label="Signed in as guest"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              Guest
            </span>

            {/* Save progress chip */}
            <button
              onClick={() => setPopupOpen(true)}
              className={cn(
                'hidden sm:flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] transition-colors',
                linkSent
                  ? 'border-[#A3E6CB] bg-[#F0FDF4] text-[#0F7B6C]'
                  : 'border-[#E8E6E1] bg-white text-[#5C5A56] hover:border-[#2383E2] hover:text-[#2383E2]'
              )}
              aria-label="Save your progress"
            >
              {linkSent ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Sent ✓</span>
                </>
              ) : (
                <>
                  <Upload className="h-3 w-3" />
                  <span>Save progress</span>
                </>
              )}
            </button>
          </>
        )}

        {/* Signed-in avatar chip */}
        {!isGuest && session && (
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarMenuOpen((o) => !o)}
              className="flex items-center gap-1 rounded-lg px-1.5 py-1 hover:bg-[#F7F6F3] transition-colors"
              aria-label="Account menu"
              aria-expanded={avatarMenuOpen}
            >
              <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#37352F] text-[11px] font-semibold text-white select-none">
                {avatarInitials}
              </div>
              <ChevronDown className="h-3 w-3 text-[#9B9A97]" />
            </button>

            {/* Dropdown */}
            {avatarMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-[200px] rounded-xl border border-[#E8E6E1] bg-white shadow-lg z-50">
                <div className="border-b border-[#F1F0EC] px-4 py-3">
                  <p className="truncate text-[12px] text-[#5C5A56]">{session.email}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-[#5C5A56] hover:bg-[#F7F6F3] hover:text-[#37352F] transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat toggle */}
        <button
          onClick={toggleChat}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors',
            isChatOpen
              ? 'text-[#9B9A97] hover:bg-[#F7F6F3] hover:text-[#5C5A56]'
              : 'bg-[#2383E2] text-white hover:bg-[#1A6DC0]'
          )}
          aria-label={isChatOpen ? 'Close chat panel' : 'Open chat panel'}
        >
          {isChatOpen ? (
            <>
              <PanelRightClose className="h-4 w-4" />
              <span className="hidden text-[13px] sm:inline">Close</span>
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4" />
              <span className="hidden text-[13px] font-medium sm:inline">Ask Atlas</span>
            </>
          )}
        </button>
      </div>

      {/* Save progress popup (portal-like, positioned fixed relative to viewport) */}
      <SaveProgressPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onSent={() => setLinkSent(true)}
      />
    </header>
  );
}
