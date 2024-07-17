import currentProfileForPages from "@/lib/current-profile-pages";
import prismadb from "@/lib/prismadb";
import { NextApiResponseServerIO } from "@/types/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "METHOD NOT ALLOWED" });
  }
  try {
    const profile = await currentProfileForPages(req);
    const { messageId, channelId, serverId } = req.query;
    const { content } = req.body;

    if (!profile) return res.status(401);
    if (!serverId)
      return res.status(400).json({ message: "ServerId missing." });
    if (!channelId)
      return res.status(400).json({ message: "ServerId missing." });

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
    if (!server) return res.status(400).json({ message: "Server missing." });

    const channel = await prismadb.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) return res.status(400).json({ message: "Channel missing." });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) return res.status(400).json({ message: "Member missing." });

    let message = await prismadb.message.findFirst({
      where: {
        id: messageId as string,
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
    if (!message)
      return res.status(400).json({ message: "Message not found." });

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isMod = member.role === MemberRole.MOD;
    const canModify = isAdmin || isMod || isMessageOwner;

    if (!canModify)
      return res.status(400).json({ message: "Not allowed to modify." });

    if (req.method === "DELETE") {
      try {
        await prismadb.message.update({
          where: {
            id: messageId as string,
          },
          data: {
            deleted: true,
            content: "This message has been deleted.",
            fileUrl: null,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          },
        });
      } catch (error) {}
    }

    if (req.method === "PATCH") {
      //only the message owner can edit it
      if (!isMessageOwner) {
        return res.status(401).json({ message: "Unauthorized." });
      }
      try {
        await prismadb.message.update({
          where: {
            id: messageId as string,
          },
          data: {
            content,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          },
        });

        const updateKey = `chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);
      } catch (error) {}
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error." });
  }
}
