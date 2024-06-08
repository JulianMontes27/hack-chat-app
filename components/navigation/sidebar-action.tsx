import React from "react";

import ActionsTooltip from "../tootltip";

interface SidebarActionProps {
  icon: React.ReactNode;
}

const SidebarAction: React.FC<SidebarActionProps> = ({ icon }) => {
  return (
    <div className="w-full flex items-center justify-center mt-2 ">
      <ActionsTooltip side="right" align="center" label={"Create a server"}>
        <button className="group rounded-full h-[48px] w-[48px] bg-gray-700 flex items-center justify-center border-none transition">
          {icon}
        </button>
      </ActionsTooltip>
    </div>
  );
};

export default SidebarAction;
