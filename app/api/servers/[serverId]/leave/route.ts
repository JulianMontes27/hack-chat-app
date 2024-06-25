import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      serverId: string;
    };
  }
) {
  const profile = await currentProfile();
  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!params.serverId) {
    return new NextResponse("Server ID is missing.", { status: 400 });
  }
  try {
    const res = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.error();
  }
}
