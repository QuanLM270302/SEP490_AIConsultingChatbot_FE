"use client";

import { useState } from "react";
import { NavigationSidebar } from "@/components/chat/NavigationSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { SearchView } from "@/components/chat/SearchView";
import { KnowledgeBaseView } from "@/components/chat/KnowledgeBaseView";

export default function ChatbotNewPage() {
  const [activeView, setActiveView] = useState<"chat" | "search" | "knowledge" | "analytics">("chat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeView === "chat" && <ChatView />}
        {activeView === "search" && <SearchView />}
        {activeView === "knowledge" && <KnowledgeBaseView />}
        {activeView === "analytics" && (
          <div className="flex h-full items-center justify-center bg-zinc-950">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white">Analytics</h2>
              <p className="mt-2 text-zinc-400">Coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
