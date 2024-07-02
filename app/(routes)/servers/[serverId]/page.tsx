import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

const ServerPage = async ({
  params,
}: {
  params: {
    serverId: string;
  };
}) => {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  if (!params.serverId) {
    return redirect(`/`);
  }
  //if params.serverId exists, then check to see if there is a channel...
  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server) return null;

  return redirect(
    `/servers/${params.serverId}/channels/${server.channels[0].id}`
  );
};

export default ServerPage;
