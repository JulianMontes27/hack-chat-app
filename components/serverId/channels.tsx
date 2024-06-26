import React from "react";

import { SearchCommand } from "./search-command";

interface ChannelsProps {
  data: {
    label: string;
    type: string;
    data:
      | {
          icon: React.ReactNode;
          name: string | null;
          id: string;
        }[]
      | undefined;
  }[];
}

const Channels: React.FC<ChannelsProps> = ({ data }) => {
  return (
    <div>
      <SearchCommand data={data} />
    </div>
  );
};

export default Channels;
