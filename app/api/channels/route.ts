import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  //check for auth (current profile)
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");
  const profile = await currentProfile();
  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 }); //the client lacks proper authentication credentials or has provided invalid credentials.
  }

  const body = await req.json();
  const { channel_name, channel_type } = body;

  if (!channel_name) {
    return new NextResponse("[SERVERS_POST]: Name is required.", {
      status: 500,
    });
  }
  if (channel_name === "general")
    return new NextResponse("Nmae cannot be 'general'", { status: 400 });
  if (!serverId) {
    return new NextResponse("[CHANNELS: POST]:Server id required.", {
      status: 400,
    });
  }
  if (!channel_type) {
    return new NextResponse("[SERVERS_POST]: Type is required.", {
      status: 500,
    });
  }
  try {
    const server = await prismadb.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MOD],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name: channel_name,
            type: channel_type,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return NextResponse.error();
  }
}
