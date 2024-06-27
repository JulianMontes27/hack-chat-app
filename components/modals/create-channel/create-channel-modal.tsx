"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import axios from "axios";
import qs from "query-string";

import useModalStore from "@/hooks/use-modal-store";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ServerWithMembersAndProfiles } from "@/components/server-id-channels-list";

import toast from "react-hot-toast";
import { ChannelType } from "@prisma/client";

const formSchema = z.object({
  channel_name: z
    .string()
    .min(2)
    .max(50)
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'.",
    }),
  channel_type: z.nativeEnum(ChannelType),
});

export default function CreateChannelModal() {
  const { isOpen, onClose, modalType, data, onOpen } = useModalStore();
  const router = useRouter();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel_name: "",
      channel_type: ChannelType.TEXT, //the default channel type is 'Text'
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params.serverId,
        },
      });
      const res = await axios.post(url, values);
      form.reset();
      router.refresh();
      toast.success("Channel created");

      onClose();
    } catch (error) {
      toast.error("An error ocurred creating channel.");
    }
  }

  return (
    <Dialog
      open={isOpen && modalType === "create-channel"}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl">
            Create channel
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2 text-[16px] font-semibold "></DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="channel_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white focus:ring-0 text-black "
                        placeholder="Q&A"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the channel&apos;s public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="channel_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px] bg-white">
                          <SelectValue placeholder="Text" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:text-black">
                        {Object.keys(ChannelType).map((type) => (
                          <SelectItem value={type} key={type}>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                className="w-full transform transition-transform duration-300 ease-in-out hover:scale-105 px-4 py-2 text-white rounded bg-blue-900"
                disabled={form.formState.isSubmitting}
              >
                Submit
              </button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
