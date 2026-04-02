"use client";

import { useState, useCallback } from "react";
import { NavigationSidebar } from "@/components/chat/NavigationSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { SearchView } from "@/components/chat/SearchView";
import { ChatbotAnalyticsView } from "@/components/chat/ChatbotAnalyticsView";
import { ChatbotNewHeader } from "@/components/chat/ChatbotNewHeader";

export default function ChatbotNewPage() {
  const [activeView, setActiveView] = useState<"chat" | "search" | "analytics">("chat");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  /** Bumps when navigating from chat so SearchView picks up a new initialQuery reliably */
  const [searchNavKey, setSearchNavKey] = useState(0);

  const goToSearch = useCallback((query?: string) => {
    if (query) setSearchQuery(query);
    setSearchNavKey((k) => k + 1);
    setActiveView("search");
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <NavigationSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        historyOpen={isHistoryOpen}
        onToggleHistory={() => setIsHistoryOpen((v) => !v)}
      />

      <main
        className={`relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[padding] duration-300 ease-out ${
          isHistoryOpen ? "pl-64" : "pl-0"
        }`}
      >
        <ChatbotNewHeader onSmartSearch={() => goToSearch()} />

        <div className="relative z-0 min-h-0 flex-1 overflow-hidden">
          {activeView === "chat" && (
            <ChatView
              isHistoryOpen={isHistoryOpen}
              onToggleHistory={() => setIsHistoryOpen((v) => !v)}
              onNavigateToSearch={(query) => goToSearch(query)}
            />
          )}
          {activeView === "search" && (
            <SearchView key={`${searchNavKey}-${searchQuery}`} initialQuery={searchQuery} />
          )}
          {activeView === "analytics" && <ChatbotAnalyticsView />}
        </div>
      </main>
    </div>
  );
}
