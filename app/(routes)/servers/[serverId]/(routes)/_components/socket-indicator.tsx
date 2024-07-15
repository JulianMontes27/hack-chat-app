"use client";

import { useSocketContext } from "@/components/providers/socket/socket-provider";

import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SocketIndicator = () => {
  const { isConnected } = useSocketContext();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {isConnected ? (
            <div className="bg-emerald-200 rounded-xl text-xs  h-2 w-2" />
          ) : (
            <div className="bg-yellow-600 rounded-xl text-xs px-2 text-white">
              Fallback: Polling every 1s
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent>{isConnected && <div>Connected</div>}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SocketIndicator;
