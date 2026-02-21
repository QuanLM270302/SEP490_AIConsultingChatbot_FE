import type { Message } from "@/types/chat";
import { EmptyState } from "./EmptyState";
import { ChatMessageItem } from "./ChatMessageItem";

interface ChatMessageListProps {
  messages: Message[];
  selectedMessage: string | null;
  onSelectExample: (example: string) => void;
  onRate: (messageId: string, rating: "helpful" | "not-helpful") => void;
}

export function ChatMessageList({
  messages,
  selectedMessage,
  onSelectExample,
  onRate,
}: ChatMessageListProps) {
  const displayMessages = selectedMessage
    ? messages.filter((msg) => msg.id === selectedMessage)
    : messages;

  if (messages.length === 0) {
    return <EmptyState onSelectExample={onSelectExample} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {displayMessages.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} onRate={onRate} />
      ))}
    </div>
  );
}

