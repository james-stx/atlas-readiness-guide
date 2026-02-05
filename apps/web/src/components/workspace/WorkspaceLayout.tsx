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
    isChatOpen,
    isSidebarCollapsed,
    mobileTab,
  } = useWorkspace();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsMobile(window.innerWidth < 768);
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
    </div>
  );
}
