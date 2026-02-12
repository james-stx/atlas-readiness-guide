'use client';

import { cn } from '@/lib/utils';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { TopBar } from './TopBar';
import { Sidebar } from './sidebar/Sidebar';
import { ContentPanel } from './content/ContentPanel';
import { ChatPanel } from './chat/ChatPanel';
import { MobileTabBar } from './mobile/MobileTabBar';
import { NetworkBanner } from '@/components/ui/network-banner';
import { WelcomeModal } from './WelcomeModal';
import { useEffect, useState } from 'react';

export function WorkspaceLayout() {
  const {
    isChatOpen,
    isSidebarCollapsed,
    mobileTab,
    openChat,
    progressState,
  } = useWorkspace();
  const { messages } = useAssessment();

  const [isMobile, setIsMobile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if returning user (has existing messages)
  const isReturningUser = messages.length > 1;
  const progress = progressState.overallProgress;

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  // Show welcome modal on mount
  useEffect(() => {
    // Small delay to prevent flash
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChooseGuided = () => {
    openChat();
    setShowWelcome(false);
  };

  const handleChooseExplore = () => {
    // Chat stays closed (default)
    setShowWelcome(false);
  };

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

        {/* Welcome Modal */}
        {showWelcome && (
          <WelcomeModal
            onChooseGuided={handleChooseGuided}
            onChooseExplore={handleChooseExplore}
            isReturningUser={isReturningUser}
            progress={progress}
          />
        )}
      </div>
    );
  }

  // ─── Desktop/Tablet layout ───
  // Sidebar + Content always visible. Chat slides in from right.
  return (
    <div className="flex h-dvh flex-col bg-white">
      <TopBar />
      <NetworkBanner />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — always visible on desktop */}
        {!isSidebarCollapsed && (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        )}

        {/* Content panel — always visible */}
        <div className="flex-1">
          <ContentPanel />
        </div>

        {/* Chat panel — slides in when open */}
        {isChatOpen && (
          <div className="animate-slide-in-right">
            <ChatPanel />
          </div>
        )}
      </div>

      {/* Welcome Modal */}
      {showWelcome && (
        <WelcomeModal
          onChooseGuided={handleChooseGuided}
          onChooseExplore={handleChooseExplore}
          isReturningUser={isReturningUser}
          progress={progress}
        />
      )}
    </div>
  );
}
