import { Friend } from "@prisma/client";
import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardFooter, CardHeader } from "../ui/card";

interface FriendsProps {
  friends: (Friend & {
    _count: {
      messages: number;
    };
  })[];
}

export default function Friends({ friends }: FriendsProps) {
  if (friends.length === 0) {
    return (
      <div className="pt-10 flex flex-col items-center justify-center space-y-3">
        <div className="relative w-60 h-60">
          <Image
            fill
            alt="placeholder"
            className="grayscale"
            src="/empty.png"
          />
        </div>
        <p className="text-sm text-muted-foreground">No friends found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
      {friends.map((friend) => (
        <Card
          className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
          key={friend.id}
        >
          <Link href={`/chat/${friend.id}`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative w-32 h-32">
                <Image
                  fill
                  alt="friend"
                  src={friend.src}
                  className="rounded-xl object-cover"
                />
              </div>

              <p className="font-bold">{friend.name}</p>
              <p className="text-xs">{friend.description}</p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <p className="lowercase">@{friend.userName}</p>
              <div className="flex items-center">
                <MessagesSquare className="w-3 h-3 mr-1" />
                {friend._count.messages}
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
}
