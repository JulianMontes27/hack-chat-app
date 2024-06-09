import { v4 as uuidv4 } from "uuid";

import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import { currentProfile } from "@/lib/current-profile";

export async function PATCH(
  res: NextRequest,
  {
    params,
  }: {
    params: {
      serverId: string;
    };
  }
) {
  // check for auth
  const profile = await currentProfile();
  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!params.serverId) {
    return new NextResponse("Invite code missing.", { status: 500 });
  }

  try {
    const res = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: profile?.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("[PATCH]: Error patching invite code.");
  }
}
