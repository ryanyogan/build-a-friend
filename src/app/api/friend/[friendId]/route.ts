import { db } from "@/lib/prisma";
import { formSchema } from "@/schemas/form-schema";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface IParams {
  params: {
    friendId: string;
  };
}

export async function PATCH(request: Request, { params }: IParams) {
  try {
    const body = await request.json();
    const user = await currentUser();

    const { name, seed, src, instructions, description, categoryId } =
      formSchema.parse(body);

    if (!user?.id || !user?.firstName) {
      return new NextResponse("Forgetabouttttiitt", { status: 401 });
    }

    if (!params.friendId) {
      return new NextResponse("Why would you do that?!", { status: 400 });
    }

    if (
      !name ||
      !seed ||
      !src ||
      !instructions ||
      !description ||
      !categoryId
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const friend = await db.friend.update({
      where: {
        id: params.friendId,
      },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    });

    return NextResponse.json(friend);
  } catch (error) {
    console.error("[FRIEND_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
