import { useUser } from "@clerk/nextjs";
import { Friend, Message } from "@prisma/client";
import axios from "axios";
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import BotAvatar from "./bot-avatar";

interface ChatHeaderProps {
  friend: Friend & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export default function ChatHeader({ friend }: ChatHeaderProps) {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/friend/${friend.id}`);

      toast({
        description: "Deleted!",
      });
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
        <Button onClick={() => router.back()} size="icon" variant="ghost">
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <BotAvatar src={friend.src} />

        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{friend.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessagesSquare className="w-3 h-3 m-1" />
              {friend._count.messages}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Created by {friend.userName}
          </p>
        </div>
      </div>

      {user?.id === friend.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/friend/${friend.id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
