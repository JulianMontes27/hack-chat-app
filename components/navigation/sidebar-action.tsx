"use client";

import useModalStore from "@/hooks/use-modal-store";
import ActionsTooltip from "../tootltip";

interface SidebarActionProps {
  icon: React.ReactNode;
}

const SidebarAction: React.FC<SidebarActionProps> = ({ icon }) => {
  const { onOpen } = useModalStore();
  return (
    <div className="w-full flex items-center justify-center mt-2 ">
      <ActionsTooltip side="right" align="center" label={"Create a dev server"}>
        <button
          className="group rounded-full h-[48px] w-[48px] bg-gray-100 dark:bg-gray-500 flex items-center justify-center border-none transition"
          onClick={() => onOpen("create-server")}
        >
          {icon}
        </button>
      </ActionsTooltip>
    </div>
  );
};

export default SidebarAction;
