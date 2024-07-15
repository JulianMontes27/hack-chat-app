import currentProfileForPages from "@/lib/current-profile-pages";
import prismadb from "@/lib/prismadb";

import { NextApiResponseServerIO } from "@/types/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed.",
    });
  }
  try {
    const profile = await currentProfileForPages(req);
    if (!profile) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const { content, fileUrl } = req.body;
    const { channelId, serverId } = req.query;

    if (!serverId) {
      return res.status(401).json({ message: "ServerId missing." });
    }
    if (!channelId) {
      return res.status(401).json({ message: "ChannelId missing." });
    }
    if (!content) {
      return res.status(401).json({ message: "Content missing." });
    }

    //is the user sending the message part of the Server?
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
    if (!server) {
      return res.status(404).json({ message: "Server not found." });
    }
    //does the channel exist??
    const channel = await prismadb.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    const member = server.members.filter(
      (member) => member.profileId === profile.id
    );
    if (!member) {
      return res.status(401).json({ message: "Member not found." });
    }

    const message = await prismadb.message.create({
      data: {
        content,
        fileUrl,
        memberId: member[0].id,
        channelId: channel.id as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    //emit a socket io to all active connections
    const channelkey = `chat:${channel.id}:messages`;

    res?.socket?.server?.io?.emit(channelkey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error." });
  }
}
