import { auth, currentUser } from "@clerk/nextjs/server";
import prismadb from "./prismadb";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return auth().redirectToSignIn();
  }
  try {
    const profile = await prismadb.profile.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!profile) {
      //create a new profile with the user's data
      const newProfile = await prismadb.profile.create({
        data: {
          userId: user.id,
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
          imgUrl: user.imageUrl,
        },
      });
    }
    return profile;
  } catch (error) {
    throw new Error("Error creating profile.");
  }
};
