"use client";

import { useState } from "react";
import { NavigationSidebar } from "@/components/chat/NavigationSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { SearchView } from "@/components/chat/SearchView";

export default function ChatbotNewPage() {
  const [activeView, setActiveView] = useState<"chat" | "search" | "analytics">("chat");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        historyOpen={isHistoryOpen}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeView === "chat" && (
          <ChatView
            isHistoryOpen={isHistoryOpen}
            onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
            onNavigateToSearch={(query) => {
              if (query) setSearchQuery(query);
              setActiveView("search");
            }}
          />
        )}
        {activeView === "search" && <SearchView initialQuery={searchQuery} />}
        {activeView === "analytics" && (
          <div className="flex h-full items-center justify-center bg-zinc-100 px-6 dark:bg-zinc-900">
            <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white">Analytics</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
