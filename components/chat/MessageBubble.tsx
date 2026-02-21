interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  formattedContent?: React.ReactNode;
}

export function MessageBubble({
  content,
  isUser,
  formattedContent,
}: MessageBubbleProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
          isUser
            ? "bg-zinc-800 text-zinc-300"
            : "bg-green-500 text-white font-semibold"
        }`}
      >
        {isUser ? "Bạn" : "AI"}
      </div>
      <div
        className={`flex-1 rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-zinc-900 text-zinc-100"
            : "bg-zinc-900 text-zinc-100"
        }`}
      >
        {formattedContent || content}
      </div>
    </div>
  );
}

