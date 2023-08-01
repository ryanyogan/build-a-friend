"use client";

import { Friend } from "@prisma/client";
import ChatMessage from "./chat-message";

interface ChatMessagesProps {
  friend: Friend;
  messages: any[];
  isLoading: boolean;
}

export default function ChatMessages({
  friend,
  messages = [],
  isLoading,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        src={friend.src}
        role="system"
        content={`Hello, I am ${friend.name}`}
      />
      <ChatMessage role="user" content="What is up!" />
    </div>
  );
}
