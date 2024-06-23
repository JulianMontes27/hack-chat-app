import { auth } from "@clerk/nextjs/server";

import prismadb from "./prismadb";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await prismadb.profile.findUnique({
    where: {
      userId: userId,
    },
  });
  
  return profile;
};
