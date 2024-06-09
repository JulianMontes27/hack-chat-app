import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionsTooltipProps {
  children: React.ReactNode;
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

const ActionsTooltip: React.FC<ActionsTooltipProps> = ({
  children,
  label,
  side,
  align,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="font-semibold text-sm capitalize dark:text-white text-black"
        >
          {label.toLowerCase()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionsTooltip;
