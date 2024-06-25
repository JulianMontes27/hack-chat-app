"use client";

import axios, { AxiosError, AxiosResponse } from "axios";

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

export default function LeaveServerModal() {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, modalType, data } = useModalStore();

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/api/servers/${data?.server?.id}/leave`);
      onClose();
      router.push("/");
      router.refresh();
      toast.success(`You left ${data.server?.name}`);
    } catch (error) {
      toast.error("Internal error.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={isOpen && modalType === "leave-server"}
      onOpenChange={onClose}
    >
      <DialogContent
        className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Leave server
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2">
            <span className="text-[16px] font-semibold ">
              Are you sure you want to leave{" "}
              <span className="text-rose-400">{data?.server?.name}</span>?
            </span>
          </DialogDescription>
        </DialogHeader>
        <div>
          <Button
            variant={"destructive"}
            className="w-full bg-rose-500 hover:bg-rose-600 transition cursor-pointer"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
