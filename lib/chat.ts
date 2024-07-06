import prismadb from "@/lib/prismadb";

export const findOrCreateChat = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let chat =
    (await findChat(memberOneId, memberTwoId)) ||
    (await findChat(memberTwoId, memberOneId));

  if (!chat) {
    chat = await createChat(memberOneId, memberTwoId);
  }

  return chat;
};

const findChat = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await prismadb.chat.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,  
          },
        },
      },
    });
  } catch {
    return null;
  }
};

const createChat = async (memberOneId: string, memberTwoId: string) => {
  try {
    //create chat
    const chat = await prismadb.chat.create({
      data: {
        memberOneId: memberOneId,
        memberTwoId: memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    return chat;
  } catch {
    return null; //to not block the app
  }
};
