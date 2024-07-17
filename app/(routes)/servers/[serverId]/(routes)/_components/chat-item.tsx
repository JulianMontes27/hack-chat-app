"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import UserAvatar from "@/components/modals/manage-members/user-avatar";
import ActionsTooltip from "@/components/tootltip";

import { Member, MemberRole, Profile } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import qs from "query-string";
import axios from "axios";
import useModalStore from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  content: z.string().min(2).max(50),
});

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MOD: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

const ChatItem: React.FC<ChatItemProps> = ({
  id,
  content,
  member,
  timeStamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { onOpen } = useModalStore();

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //send values to the server
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("There was an error editing the message.", {
        position: "bottom-right",
      });
    }
  }

  const fileType = fileUrl?.split(".").pop();
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const isAdmin = member.role === MemberRole.ADMIN;
  const isMod = member.role === MemberRole.MOD;

  const isCurrentMemberOwner = currentMember.id === member.id;
  const isCurrentMemberMod = currentMember.role === MemberRole.MOD;
  const isCurrentMemberAdmin = currentMember.role === MemberRole.ADMIN;

  const canEditMessage = !deleted && isCurrentMemberOwner && !fileUrl;

  const canDeleteMessage =
    !deleted &&
    (isCurrentMemberOwner || isCurrentMemberAdmin || isCurrentMemberMod);

  return (
    <div className="relative flex items-start gap-2  p-4 transition w-full flex-col group">
      <div className="group flex gap-x-2 items-center justify-start w-full ">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imgUrl} />
        </div>
        <ActionsTooltip label={member.role}>
          <div className="flex items-center gap-2">
            <p
              className="cursor-pointer hover:scale-105 transition"
              onClick={() => {
                router.push(
                  `/servers/${member.serverId}/conversations/${member.id}`
                );
              }}
            >
              {member.profile.name}
            </p>

            {roleIconMap[member.role]}
          </div>
        </ActionsTooltip>
        <p className="text-xs dark:text-zinc-400 text-zinc-700">{timeStamp}</p>
      </div>
      <div className="bg-zinc-200/25 dark:bg-zinc-900/25 rounded-md w-full p-2">
        <div className="group relative">
          {isImage && (
            <Link
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md p-2 overflow-hidden border flex items-center bg-secondary w-48 h-48"
            >
              <Image
                src={fileUrl}
                alt={"image"}
                fill
                className="object-cover"
              />
            </Link>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md flex-row gap-4 ">
              <FileIcon className="h-10 w-10 text-indigo-500" />
              <Link
                href={fileUrl}
                target="_blank"
                rel="noopener noreferer"
                className="hover:text-indigo-900 transition-all dark:hover:text-indigo-300"
              >
                {fileUrl}
              </Link>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {!isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {isEditing && !fileUrl && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-row"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          disabled={form.formState.isSubmitting}
                          placeholder={content}
                          {...field}
                          className="h-full border-none focus-visible:ring-0 focus-visible:ring-offset-0  dark:bg-zinc-900/10 bg-zinc-200/40 "
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Save
                </Button>
              </form>
            </Form>
          )}
        </div>
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-2 right-5  rounded-sm">
          {canEditMessage && (
            <Edit
              className="h-5 w-5 ml-auto text-zinc-400 hover:text-zinc-600 cursor-pointer dark:text-zinc-300 dark:hover:text-zinc-100 transition"
              onClick={() => {
                setIsEditing((prev) => !prev);
              }}
            />
          )}
          {canDeleteMessage && (
            <Trash
              className="h-5 w-5 ml-auto text-zinc-400 cursor-pointer hover:text-rose-500  transition"
              onClick={() => {
                onOpen("delete-message", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                  member,
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
