"use client";

import useModalStore from "@/hooks/use-modal-store";
import ActionsTooltip from "../tootltip";
import { PlusIcon } from "lucide-react";

const SidebarAction = () => {
  const { onOpen } = useModalStore();
  return (
    <ActionsTooltip side="right" align="center" label={"Create a dev server"}>
      <div className="group relative flex items-center ">
        <button
          className="relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden border border-rose-400"
          onClick={() => onOpen("create-server")}
        >
          <PlusIcon className="m-auto" />
        </button>
      </div>
    </ActionsTooltip>
  );
};

export default SidebarAction;
