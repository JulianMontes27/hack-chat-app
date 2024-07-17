"use client";

import axios from "axios";

import useModalStore from "@/hooks/use-modal-store";

import { useState } from "react";

import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import qs from "query-string";
import { useRouter } from "next/navigation";

export default function DeleteMessageModal() {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onClose, modalType, data } = useModalStore();

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: data?.apiUrl || "",
        query: data.query,
      });
      await axios.delete(url);
      
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Internal error.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={isOpen && modalType === "delete-message"}
      onOpenChange={onClose}
    >
      <DialogContent
        className="bg-zinc-200 text-black sm:max-w-[425px] overflow-hidden rounded-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Delete message
          </DialogTitle>
          <div className="text-zinc-500">
            Are you sure you want to delete the following message by{" "}
            <strong>{data.member?.profile.name}</strong>
          </div>
        </DialogHeader>
        <div className="flex flex-row gap-5">
          <button
            className="w-full transform transition-transform duration-300 ease-in-out hover:scale-110 px-4 py-2 rounded  bg-indigo-900 text-white"
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
