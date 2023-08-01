"use client";

import { Friend, Message } from "@prisma/client";
import { useCompletion } from "ai/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ChatForm from "../inputs/chat-form";
import ChatHeader from "../shared/chat-header";
import { ChatMessageProps } from "../shared/chat-message";
import ChatMessages from "../shared/chat-messages";

interface ChatClientProps {
  friend: Friend & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export default function ChatClient({ friend }: ChatClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(friend.messages);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${friend.id}`,
      onFinish(_prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };

        setMessages((currentMessages) => [...currentMessages, systemMessage]);

        setInput("");

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col p-4 h-full space-y-2">
      <ChatHeader friend={friend} />

      <ChatMessages friend={friend} isLoading={isLoading} messages={messages} />

      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
