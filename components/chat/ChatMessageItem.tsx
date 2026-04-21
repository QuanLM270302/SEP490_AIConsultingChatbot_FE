"use client";

import type { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { ReferencesSection } from "./ReferencesSection";
import { RatingButtons } from "./RatingButtons";
import { formatAnswer } from "@/lib/utils/formatAnswer";
import { isRatingMessageId } from "@/lib/chatMessageId";

interface ChatMessageItemProps {
  message: Message;
  onRate: (messageId: string, rating: "helpful" | "not-helpful") => void;
}

export function ChatMessageItem({ message, onRate }: ChatMessageItemProps) {
  return (
    <div className="space-y-6">
      {/* Question */}
      <MessageBubble content={message.question} isUser={true} />

      {/* Answer */}
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white">
          AI
        </div>
        <div className="flex-1 space-y-4">
          <div className="rounded-lg bg-zinc-100 px-4 py-3 text-sm leading-relaxed text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
            <div className="whitespace-pre-line">
              {formatAnswer(message.answer)}
            </div>
          </div>

          <ReferencesSection references={message.references} />

          {isRatingMessageId(message.id) ? (
            <RatingButtons
              messageId={message.id}
              currentRating={message.rating || null}
              onRate={onRate}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

