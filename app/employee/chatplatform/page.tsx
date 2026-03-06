import { AppHeader } from "@/components/layout/AppHeader";
import { ChatLayout } from "@/components/chat/ChatLayout";

export default function ChatPlatformPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <AppHeader /> */}
      <ChatLayout />
    </div>
  );
}
