import CreateFriendForm from "@/components/inputs/create-friend-form";
import { db } from "@/lib/prisma";

interface FriendPageProps {
  params: {
    friendId: string;
  };
}

export const revalidate = 60;

export default async function FriendPage({ params }: FriendPageProps) {
  //TODO: Check pro subscription ;-)
  let friend;
  if (params.friendId) {
    friend = await db.friend.findUnique({
      where: { id: params.friendId },
    });
  }

  const categories = await db.category.findMany();

  return <CreateFriendForm initialData={friend} categories={categories} />;
}
