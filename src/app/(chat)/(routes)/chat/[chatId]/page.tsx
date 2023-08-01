import ChatClient from "@/components/clients/chat-client";
import { db } from "@/lib/prisma";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId } = auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const friend = await db.friend.findUnique({
    where: { id: params.chatId },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!friend) {
    return redirect("/");
  }

  return <ChatClient friend={friend} />;
}
