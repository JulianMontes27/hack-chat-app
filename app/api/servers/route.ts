import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  //check for auth (current profile)
  const profile = await currentProfile();
  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 }); //the client lacks proper authentication credentials or has provided invalid credentials.
  }
  try {
    const body = await req.json();
    const { name, imgUrl } = body;

    if (!name) {
      return new NextResponse("[SERVERS_POST]: name is required.", {
        status: 500,
      });
    }
    if (!imgUrl) {
      return new NextResponse("[SERVERS_POST]: imgUrl is required.", {
        status: 500,
      });
    }

    const server = await prismadb.server.create({
      data: {
        profileId: profile.id,
        name,
        imgUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: "ADMIN" }],
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
