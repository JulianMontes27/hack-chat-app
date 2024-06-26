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
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function DeleteServerModal() {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onClose, modalType, data } = useModalStore();

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete(`/api/servers/${data?.server?.id}`);
      onClose();
      router.push("/");
      router.refresh();
      toast(`${data?.server?.id} was deleted.`);
    } catch (error) {
      toast.error("Internal error.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={isOpen && modalType === "delete-server"}
      onOpenChange={onClose}
    >
      <DialogContent
        className="bg-zinc-200 text-black sm:max-w-[425px] overflow-hidden rounded-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Delete server
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2">
            <span className="text-[16px] text-gray-600">
              If you delete the{" "}
              <span className="text-rose-400">
                <strong>Server</strong>
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
          <Button
            className="w-full transform transition-transform duration-300 ease-in-out hover:scale-110 px-4 py-2 text-white rounded bg-rose-600"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
