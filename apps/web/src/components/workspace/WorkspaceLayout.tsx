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
import { DomainInsightProvider } from '@/lib/context/domain-insight-context';
import { DOMAINS, DOMAIN_TOPICS } from '@/lib/progress';
import { useEffect, useState, useMemo } from 'react';

export function WorkspaceLayout() {
  const {
    isChatOpen,
    isSidebarCollapsed,
    mobileTab,
    openChat,
    progressState,
    selectDomain,
  } = useWorkspace();
  const { messages, session } = useAssessment();

  const [isMobile, setIsMobile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if returning user (has existing messages)
  const isReturningUser = messages.length > 1;
  const progress = progressState.overallProgress;

  // Build domain summaries for returning user modal
  const domainSummaries = useMemo(() => {
    return DOMAINS.map((domain) => {
      const dp = progressState.domainProgress[domain.key];
      const topics = DOMAIN_TOPICS[domain.key] || [];
      return {
        key: domain.key,
        label: domain.label,
        status: dp.status,
        covered: dp.coveredTopics.length,
        total: topics.length,
      };
    });
  }, [progressState]);

  // Find the last domain with activity (in progress or has inputs)
  const lastDomain = useMemo(() => {
    const inProgressDomain = DOMAINS.find(
      (d) => progressState.domainProgress[d.key].status === 'in_progress'
    );
    if (inProgressDomain) return inProgressDomain.label;

    // Fall back to session's current domain
    if (session?.current_domain) {
      const domain = DOMAINS.find((d) => d.key === session.current_domain);
      return domain?.label;
    }
    return undefined;
  }, [progressState, session]);

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
    setShowWelcome(false);
  };

  const handleContinue = () => {
    const inProgressDomain = DOMAINS.find(
      (d) => progressState.domainProgress[d.key].status === 'in_progress'
    );
    if (inProgressDomain) {
      selectDomain(inProgressDomain.key);
    }
    openChat();
    setShowWelcome(false);
  };

  // ─── Mobile layout ───
  if (isMobile) {
    return (
      <DomainInsightProvider>
        <div className="flex h-dvh flex-col bg-white">
          <TopBar />
          <NetworkBanner />
          <div className="flex-1 overflow-hidden">
            {mobileTab === 'domains' && (
              <div className="h-full overflow-y-auto">
                <Sidebar />
              </div>
            )}
            {/* Keep both panels mounted so state/effects persist across tab switches.
                Use CSS hide/show instead of conditional rendering so that
                ContentPanel's domain-sync effect and showInProgress logic
                continue to run even while the user is in the chat tab. */}
            <div className={cn(mobileTab !== 'content' && 'hidden')}>
              <ContentPanel />
            </div>
            <div className={cn(mobileTab !== 'chat' && 'hidden')}>
              <ChatPanel />
            </div>
          </div>
          <MobileTabBar />

          {showWelcome && (
            <WelcomeModal
              onChooseGuided={handleChooseGuided}
              onChooseExplore={handleChooseExplore}
              onContinue={handleContinue}
              isReturningUser={isReturningUser}
              progress={progress}
              domainSummaries={domainSummaries}
              lastDomain={lastDomain}
            />
          )}
        </div>
      </DomainInsightProvider>
    );
  }

  // ─── Desktop/Tablet layout ───
  return (
    <DomainInsightProvider>
      <div className="flex h-dvh flex-col bg-white">
        <TopBar />
        <NetworkBanner />

        <div className="flex flex-1 overflow-hidden">
          {!isSidebarCollapsed && (
            <div className="hidden md:block">
              <Sidebar />
            </div>
          )}

          <div className="flex-1">
            <ContentPanel />
          </div>

          {isChatOpen && (
            <div className="animate-slide-in-right">
              <ChatPanel />
            </div>
          )}
        </div>

        {showWelcome && (
          <WelcomeModal
            onChooseGuided={handleChooseGuided}
            onChooseExplore={handleChooseExplore}
            onContinue={handleContinue}
            isReturningUser={isReturningUser}
            progress={progress}
            domainSummaries={domainSummaries}
            lastDomain={lastDomain}
          />
        )}
      </div>
    </DomainInsightProvider>
  );
}
