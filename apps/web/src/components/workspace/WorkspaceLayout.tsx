'use client';

import { cn } from '@/lib/utils';
import { useWorkspace } from '@/lib/context/workspace-context';
import { TopBar } from './TopBar';
import { Sidebar } from './sidebar/Sidebar';
import { ContentPanel } from './content/ContentPanel';
import { ChatPanel } from './chat/ChatPanel';
import { MobileTabBar } from './mobile/MobileTabBar';
import { NetworkBanner } from '@/components/ui/network-banner';
import { useEffect, useState } from 'react';

export function WorkspaceLayout() {
  const {
    workspaceStage,
    isChatOpen,
    contentPanelRevealed,
    showOnboardingTooltip,
    dismissOnboardingTooltip,
    isSidebarCollapsed,
    mobileTab,
  } = useWorkspace();

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  // ─── Mobile layout ───
  if (isMobile) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <TopBar />
        <NetworkBanner />
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'domains' && (
            <div className="h-full overflow-y-auto">
              <Sidebar />
            </div>
          )}
          {mobileTab === 'content' && <ContentPanel />}
          {mobileTab === 'chat' && <ChatPanel />}
        </div>
        <MobileTabBar />
      </div>
    );
  }

  // ─── Desktop/Tablet layout ───
  return (
    <div className="flex h-dvh flex-col bg-white">
      <TopBar />
      <NetworkBanner />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isSidebarCollapsed && (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        )}

        {/* Content panel — hidden during chat-first stage */}
        {workspaceStage === 'full' && contentPanelRevealed && (
          <div className="relative flex-1 animate-content-reveal">
            <ContentPanel />

            {/* Onboarding tooltip */}
            {showOnboardingTooltip && (
              <div
                className="absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-lg border border-accent-600/20 bg-accent-50 px-4 py-2.5 shadow-medium animate-fade-in"
                role="status"
              >
                <p className="text-body-sm text-accent-700">
                  Your inputs appear here as we talk
                </p>
                <button
                  onClick={dismissOnboardingTooltip}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-[var(--text-tertiary)] shadow-soft"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chat-first: chat takes remaining width */}
        {workspaceStage === 'chat-first' && (
          <div className="flex-1">
            <ChatPanel />
          </div>
        )}

        {/* Chat panel — only in full stage, as side panel */}
        {workspaceStage === 'full' && isChatOpen && (
          <ChatPanel />
        )}
      </div>
    </div>
  );
}
