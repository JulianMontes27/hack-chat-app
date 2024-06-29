import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      channelId: string;
    };
  }
) {
  const profile = await currentProfile();
  if (!profile) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { name, type } = body;

  if (!params.channelId) {
    return new NextResponse("[PATCH_CHANNELID]: Channel Id is required.", {
      status: 400,
    });
  }
  if (name === "general") {
    return new NextResponse(
      `[PATCH_CHANNELID]: '${name}' is reserved. Choose any other name.`,
      {
        status: 400,
      }
    );
  }
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");
  if (!serverId) {
    return new NextResponse("[PATCH_CHANNELS]: Server Id is required", {
      status: 403,
    });
  }

  console.log(name, type);

  try {
    const res = await prismadb.server.update({
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
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error.", { status: 500 });
  }
}
