import React from "react";

import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

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
  return (
    <div>
      {profile?.name}
      <UserButton />
    </div>
  );
};

export default SetupPage;
