import { MemoryManager } from "@/lib/memory";
import { db } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { currentUser } from "@clerk/nextjs";
import { LangChainStream, StreamingTextResponse } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Thall shall not pass!", { status: 401 });
    }

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);
    if (!success) {
      return new NextResponse("Rate limited exceeded", { status: 429 });
    }

    const friend = await db.friend.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    if (!friend) {
      return new NextResponse("Friend not found :(", { status: 404 });
    }

    const name = friend.id;
    const friend_file_name = name + ".txt";
    const friendKey = {
      friendName: name,
      userId: user.id,
      modelName: "llama2-13b",
    };
    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(friendKey);
    if (records.length === 0) {
      await memoryManager.seedChatHistory(friend.seed, "\n\n", friendKey);
    }

    await memoryManager.writeToHistory("User: " + prompt + "\n", friendKey);

    const recentChatHistory = await memoryManager.readLatestHistory(friendKey);
    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      friend_file_name
    );

    let relevantHistory = "";
    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs
        .map((document) => document.pageContent)
        .join("\n");
    }

    const { handlers } = LangChainStream();
    const model = new Replicate({
      model:
        "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    model.verbose = true;

    const response = String(
      await model
        .call(
          `
      ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${friend.name}: prefix. 

      ${friend.instructions}

      Below are relevant details about ${friend.name}'s past and the conversation you are in.
      ${relevantHistory}


      ${recentChatHistory}\n${friend.name}:`
        )
        .catch(console.error)
    );

    const cleaned = response.replaceAll(",", "");
    const chunks = cleaned.split("\n");
    const res = chunks[0];

    await memoryManager.writeToHistory("" + response.trim(), friendKey);

    var Readable = require("stream").Readable;

    let s = new Readable();
    s.push(res);
    s.push(null);

    if (res !== undefined && res.length > 1) {
      memoryManager.writeToHistory("" + res.trim(), friendKey);

      await db.friend.update({
        where: {
          id: params.chatId,
        },
        data: {
          messages: {
            create: {
              content: res.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });
    }

    return new StreamingTextResponse(s);
  } catch (error) {
    console.error("CHAT_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
