import React from "react";

import { SearchCommand } from "./search-command";
import { Separator } from "../ui/separator";

interface ChannelsProps {
  data: {
    label: string;
    type: "channel" | "member";
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
      <Separator />
    </div>
  );
};

export default Channels;
