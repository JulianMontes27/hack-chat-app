"use client";

import { CreateModalForm } from "./modal-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function CreateServerModal() {
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    setisMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <Dialog open>
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Create server
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2">
            <span className="text-[16px] font-semibold ">
              Start working together with other devs!
            </span>
            <span>
              Customize your server. Be sure to make it unique and inviting to
              others!
            </span>
          </DialogDescription>
        </DialogHeader>

        <CreateModalForm />
      </DialogContent>
    </Dialog>
  );
}