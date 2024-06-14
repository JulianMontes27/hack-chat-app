"use client";

import useModalStore from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import UserAvatar from "./user-avatar";

import { ServerWithMembersAndProfiles } from "@/components/server-id-channels-list";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const roleIconMap = {
  GUEST: null,
  MOD: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export default function InviteModal() {
  const { isOpen, onClose, modalType, data } = useModalStore();

  const { server } = data as { server: ServerWithMembersAndProfiles };

  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  );
  return (
    <Dialog
      open={isOpen && modalType === "manage-members"}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Manage members
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2 text-[16px] font-semibold ">
            <p>{server?.members.length} Members</p>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[420px] w-full rounded-md mt-8">
          {server?.members.map((member) => (
            <div key={member.id} className="mb-6">
              <div>
                <div className="flex flex-row items-center gap-3">
                  <UserAvatar src={member.profile.imgUrl} />
                  <p>{member.profile.name}</p>
                  {roleIconMap[member.role]}
                </div>
                <div>
                  <p className="text-sm text-zinc-500/90 mt-2">
                    {member.profile.email}
                  </p>
                </div>
              </div>

              <div>
                
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
