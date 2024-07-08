import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";
import prismadb from "./prismadb";

export default async function currentProfileForPages(req: NextApiRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  }

  const profile = await prismadb.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
}
