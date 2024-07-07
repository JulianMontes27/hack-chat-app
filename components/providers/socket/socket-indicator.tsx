"use client";

import { Badge } from "@/components/ui/badge";

import { useSocket } from "./socket-provider";

const SocketIndicator = () => {
  const { socket, isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant={"outline"}
        className="bg-yellow-600 text-white border-none"
      >
        Fallback: Polling every 1s
      </Badge>
    );
  }
  return (
    <Badge
      variant={"outline"}
      className="bg-emerald-500 text-white border-none p-0 h-2 w-2"
    />
  );
};

export default SocketIndicator;
