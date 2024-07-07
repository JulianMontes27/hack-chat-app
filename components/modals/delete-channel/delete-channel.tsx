"use client";

import axios from "axios";

import useModalStore from "@/hooks/use-modal-store";

import { useState } from "react";

import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";

import qs from "query-string";
import { channel } from "diagnostics_channel";

export default function DeleteChannelModal() {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onClose, modalType, data } = useModalStore();

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          channelId: data.channel?.id,
          serverId: data.server?.id,
        },
      });
      await axios.patch(url);
      router.refresh();
      toast.success(`${data.channel?.name} deleted.`);

      onClose();
    } catch (error) {
      toast.error("Internal error.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={isOpen && modalType === "delete-channel"}
      onOpenChange={onClose}
    >
      <DialogContent
        className="bg-zinc-200 text-black sm:max-w-[425px] overflow-hidden rounded-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Delete channel
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2">
            <span className="text-[16px] text-gray-600">
              If you delete
              <span className="text-rose-400 ml-2">
                <strong>{`#${data.channel?.name}`}</strong>
              </span>
              , there is no way to recuperate it. Are you sure you want to
              proceed?
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-5">
          <button
            className="w-full transform transition-transform duration-300 ease-in-out hover:scale-110 px-4 py-2 text-white rounded bg-sky-900"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="w-full transform transition-transform duration-300 ease-in-out hover:scale-110 px-4 py-2 text-white rounded bg-rose-600 "
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
