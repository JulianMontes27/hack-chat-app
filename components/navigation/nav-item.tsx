"use client";

import React from "react";
import Image from "next/image";

import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import ActionsTooltip from "../tootltip";

interface NavItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const NavItem: React.FC<NavItemProps> = ({ id, imageUrl, name }) => {
  const params = useParams();
  const router = useRouter();
  return (
    <ActionsTooltip label={`${name}`} side="right" align="center">
      <button
        onClick={() => router.push(`/servers/${id}`)}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden"
          )}
        >
          <Image src={imageUrl} alt={name} fill />
        </div>
      </button>
    </ActionsTooltip>
  );
};

export default NavItem;
