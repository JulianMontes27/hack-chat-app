import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor"); //from what message to load the next batch of messages
    const channelId = searchParams.get("channelId");
    if (!channelId) {
      return new NextResponse("ChannelID missing", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await prismadb.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await prismadb.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }
    console.log(messages, messages.length === 0 && "0");

    return NextResponse.json({
      data: messages,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}
