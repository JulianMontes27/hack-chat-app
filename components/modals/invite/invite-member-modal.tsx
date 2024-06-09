"use client";

import axios, { AxiosError, AxiosResponse } from "axios";

import useModalStore from "@/hooks/use-modal-store";

import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCcwIcon } from "lucide-react";

export default function InviteModal() {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const origin = useOrigin();

  const { server } = data;

  const initialCode = `${origin}/invite/${server?.inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(initialCode)
      .then((res) => {
        setIsCopied(true);
        toast.success("Invite code copied.");
      })
      .catch((err) => {
        toast.error(err);
      });

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  //handle generate new invite code
  const handleNewInviteCode = async () => {
    try {
      setisLoading(true);
      //patch the existing Server
      const res = await axios
        .patch(`/api/servers/${server?.id}/invite-code`)
        .then((res: AxiosResponse) => {
          toast.success("Invite code regenerated succesfully.", {
            position: "bottom-right",
          });
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    } catch (error) {
      throw new Error("Something went wrong. Try again later.");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen && modalType === "invite-member"}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Invite dev-member
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2">
            <span className="text-[16px] font-semibold ">
              Expand your community by inviting other devs!
            </span>
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
            SERVER INVITE CODE
          </Label>
          <div className="flex flex-row">
            <Input
              value={initialCode}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 overflow-x-auto whitespace-nowrap"
              disabled={isLoading}
            />
            <Button
              variant={"default"}
              size={"icon"}
              onClick={handleCopy}
              className="text-black bg-transparent"
              disabled={isLoading}
            >
              {isCopied ? (
                <Check className="bg-transparent text-zinc-400" />
              ) : (
                <Copy />
              )}
            </Button>
          </div>
          <Button
            onClick={handleNewInviteCode}
            variant={"link"}
            size={"sm"}
            className="text-zinc-500 mt-4 flex items-center gap-2"
            disabled={isLoading}
          >
            Generate new code
            <RefreshCcwIcon />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
