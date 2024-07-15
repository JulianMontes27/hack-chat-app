import prismadb from "@/lib/prismadb";

export const findOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let convo =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!convo) {
    convo = await createConversation(memberOneId, memberTwoId);
  }

  return convo;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await prismadb.conversation.findFirst({
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
    return null; //to not block the app
  }
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    //create Conversation
    const convo = await prismadb.conversation.create({
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
    return convo;
  } catch {
    return null;
  }
};
