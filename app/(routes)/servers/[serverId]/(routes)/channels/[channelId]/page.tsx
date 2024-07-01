import React from "react";

const ServerChannelPage = ({ params }: { params: { channelId: string } }) => {
  return <div>{params.channelId}</div>;
};

export default ServerChannelPage;
