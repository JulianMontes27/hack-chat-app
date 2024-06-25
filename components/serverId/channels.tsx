import React from "react";

import { Channel } from "@prisma/client";

interface ChannelsProps {
  channels: Channel[];
}

const Channels: React.FC<ChannelsProps> = ({ channels }) => {
  return <div>{channels.length}</div>;
};

export default Channels;
