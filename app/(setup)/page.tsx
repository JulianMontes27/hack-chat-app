import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

import LandingPage from "@/components/landing-page/public-landing-page";

const SetupPage = async () => {
  const user = await currentUser();
  //if the client browser has no user (logged in) cookie...
  if (!user) {
    return <LandingPage />;
  }
  //if there is a User logged in, check if there is a profile linked to it
  let profile = await prismadb.profile.findUnique({
    where: {
      userId: user?.id,
    },
  });

  //if there is no profile linked to the currently signed in User...
  if (!profile) {
    //create profile
    profile = await prismadb.profile.create({
      data: {
        userId: user.id,
        name: user.fullName,
        email: user.emailAddresses[0].emailAddress,
        imgUrl: user.imageUrl,
      },
    });
  }
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
    return redirect(`/servers/${server.id}`);
  }

  return redirect("/onboarding");
};

export default SetupPage;
