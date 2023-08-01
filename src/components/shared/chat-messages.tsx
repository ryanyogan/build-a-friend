"use client";

import { Friend } from "@prisma/client";
import { ElementRef, useEffect, useRef, useState } from "react";
import ChatMessage, { ChatMessageProps } from "./chat-message";

interface ChatMessagesProps {
  friend: Friend;
  messages: ChatMessageProps[];
  isLoading: boolean;
}

export default function ChatMessages({
  friend,
  messages = [],
  isLoading,
}: ChatMessagesProps) {
  const scrollRef = useRef<ElementRef<"div">>(null);

  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1_000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={fakeLoading}
        src={friend.src}
        role="system"
        content={`Hello, I am ${friend.name}`}
      />

      {messages.map((message) => (
        <ChatMessage
          role={message.role}
          key={message.content}
          content={message.content}
          src={friend.src}
        />
      ))}

      {isLoading && <ChatMessage role="system" src={friend.src} isLoading />}

      <div ref={scrollRef} />
    </div>
  );
}
