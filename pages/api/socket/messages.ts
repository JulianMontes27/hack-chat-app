import currentProfileForPages from "@/lib/current-profile-pages";
import { NextApiRequest } from "next";

import prismadb from "@/lib/prismadb";
import { NextApiResponseServerIO } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  //check if the request is POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const profile = await currentProfileForPages(req);
    const { content, fileUrl } = req.body;
    const { channelId, serverId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized." });
    if (!serverId) return res.status(400).json({ error: "ServerId missing." });
    if (!channelId)
      return res.status(400).json({ error: "ChannelId missing." });
    if (!content) return res.status(400).json({ error: "Content missing." });

    //check if the user sending the message is a member of the server
    const server = await prismadb.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) return res.status(404).json({ error: "Server not found." });

    const channel = await prismadb.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) return res.status(404).json({ error: "Channel not found." });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) return res.status(404).json({ error: "Member not found." });

    const msg = await prismadb.message.create({
      data: {
        content,
        memberId: member.id,
        channelId: channelId as string,
        fileUrl,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io.emit(channelKey, msg);

    return res.status(200).json(msg);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
