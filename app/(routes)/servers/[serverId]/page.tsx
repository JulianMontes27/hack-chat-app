import prismadb from "@/lib/prismadb";

import React from "react";

const ServerPage = async ({
  params,
}: {
  params: {
    serverId: string;
  };
}) => {
  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
    },
  });
  if (!server) {
    return null;
  }
  return <div className="h-full"></div>;
};

export default ServerPage;
