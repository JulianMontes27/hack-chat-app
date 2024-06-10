import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import prismadb from "@/lib/prismadb";

import CreateServerModal from "@/components/modals/create-server/create-server-modal";

const SetupPage = async () => {
  //call the initial-profile function to retrive or create a profile with the existing user
  const profile = await initialProfile();
  //find if this profile is member of a server
  const server = await prismadb.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });
  //if the profile is part of a server
  if (server) {
    redirect(`/servers/${server.id}`);
  }
  //this only runs if the user-profile is NOT part of a server
  redirect("/initial-create-server");
};

export default SetupPage;
