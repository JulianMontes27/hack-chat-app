import { currentProfile } from "@/lib/current-profile";

import prismadb from "@/lib/prismadb";

import { NextRequest, NextResponse } from "next/server";

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
  if (!profile) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { name, imgUrl } = body;

  try {
    const res = await prismadb.server.update({
      where: {
        id: params.serverId,
      },
      data: {
        name,
        imgUrl,
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error.", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  const profile = await currentProfile();
  if (!profile) return new NextResponse("Unauthorized", { status: 401 });

  if (!params.serverId)
    return new NextResponse("Server Id is required", { status: 500 });

  try {
    const res = await prismadb.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.error();
  }
}
