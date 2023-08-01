import CreateFriendForm from "@/components/inputs/create-friend-form";
import { db } from "@/lib/prisma";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface FriendPageProps {
  params: {
    friendId: string;
  };
}

export const revalidate = 60;

export default async function FriendPage({ params }: FriendPageProps) {
  //TODO: Check pro subscription ;-)
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  let friend;
  if (params.friendId) {
    friend = await db.friend.findUnique({
      where: { id: params.friendId, userId },
    });
  }

  const categories = await db.category.findMany();

  return <CreateFriendForm initialData={friend} categories={categories} />;
}
