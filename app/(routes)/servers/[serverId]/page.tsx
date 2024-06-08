import React from "react";

const page = ({
  params,
}: {
  params: {
    serverId: string;
  };
}) => {
  return <div>{params.serverId}</div>;
};

export default page;
