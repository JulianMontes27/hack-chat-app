"use client";

import { useSocketContext } from "@/components/providers/socket/socket-provider";
import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import qs from "query-string";
import axios from "axios";
import useModalStore from "@/hooks/use-modal-store";
import EmojiPicker from "./emoji-picker";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name?: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1).max(200),
  fileUrl: z.string(),
});

const ChatInput: React.FC<ChatInputProps> = ({ query, apiUrl, name, type }) => {
  const { onOpen } = useModalStore();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    //submit message to the /api/socket/messages
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);

      form.reset();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-3 absolute bottom-0 w-full"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <section className="relative rounded-md ">
                  <button
                    type="button"
                    className="absolute top-2 left-2 h-[24px] w-[24px]"
                    disabled={form.formState.isSubmitting}
                  >
                    <Plus
                      className="text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 transition duration-300 ease-in-out transform hover:scale-110 "
                      onClick={() => onOpen("file-upload", { apiUrl, query })}
                    />
                  </button>
                  <Input
                    placeholder={`Message ${
                      type === "channel" ? `#${name}` : name
                    }`}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 pl-10 w-full bg-zinc-200 dark:bg-zinc-900"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />

                  <div className="absolute right-3 top-2">
                    <EmojiPicker
                      onSelect={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </section>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
