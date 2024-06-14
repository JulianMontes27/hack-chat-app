import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      memberId: string;
    };
  }
) {
  const userProfile = await currentProfile();
  if (!userProfile) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const { role } = await req.json();
  const serverId = searchParams.get("serverId");
  if (!serverId)
    return new NextResponse("Server Id is missing", { status: 400 });
  if (!params.memberId)
    return new NextResponse("Member Id is missing", { status: 400 });

  try {
    const server = await prismadb.server.update({
      where: {
        id: serverId,
        profileId: userProfile.id, //admin
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: userProfile.id, //DO NOT delete admin (server needs an ADMIN)
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("[PATCH] Internal error.");
  }
}
