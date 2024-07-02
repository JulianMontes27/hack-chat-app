import React from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "@/components/navigation/sidebar";
import ServerIdChannelsList from "../server-id-channels-list";

const MobileDropdown = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 flex gap-0">
        <div className="w-[72px]">
          <Sidebar />
        </div>
        <ServerIdChannelsList serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileDropdown;
