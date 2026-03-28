"use client";

import { useState } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMain } from "./ChatMain";
import { ChatHistorySidebar } from "./ChatHistorySidebar";

export function ChatLayout() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="flex flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      <ChatSidebar
        open={true}
        onNewChat={() => setCurrentChatId(null)}
      />
      <ChatHistorySidebar
        open={historyOpen}
        onToggle={() => setHistoryOpen(false)}
        onSelectChat={(chatId) => {
          setCurrentChatId(chatId || null);
          setHistoryOpen(false);
        }}
        onNewChat={() => setCurrentChatId(null)}
        currentChatId={currentChatId}
      />
      <ChatMain 
        chatId={currentChatId}
        onToggleHistory={() => setHistoryOpen(!historyOpen)}
        historyOpen={historyOpen}
      />
    </div>
  );
}
