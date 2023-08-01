"use client";

import { Friend, Message } from "@prisma/client";
import ChatHeader from "../shared/chat-header";

interface ChatClientProps {
  friend: Friend & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export default function ChatClient({ friend }: ChatClientProps) {
  return (
    <div className="flex flex-col p-4 h-full space-y-2">
      <ChatHeader friend={friend} />
    </div>
  );
}
