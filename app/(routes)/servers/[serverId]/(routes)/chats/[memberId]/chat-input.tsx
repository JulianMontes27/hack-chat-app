"use client";

import axios from "axios";
import qs from "query-string";

import useModalStore from "@/hooks/use-modal-store";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>; //an object where keys are strings (string) and values can be of any type (any). This is typically used for query parameters that might be passed to an API endpoint.
  name: string;
  type: "chat" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput: React.FC<ChatInputProps> = ({ apiUrl, query, name, type }) => {
  const { onOpen } = useModalStore();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // try {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve(console.log(values));
    //     }, 2000); // 2-second delay
    //   });
    // } catch (error) {}
    try {
      //form URL
      const url = qs.stringifyUrl({
        url: "/api/socket/messages",
        query: query,
      });
      const res = await axios.post(url, values); //send message to the socket io server
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl p-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <section className=" flex flex-row m-auto items-center justify-center">
                  <button
                    type="button"
                    disabled={form.formState.isSubmitting}
                    onClick={() => onOpen("msg-file", { apiUrl, query })}
                  >
                    <Plus className="absolute left-6 top-6" />
                  </button>
                  <Input
                    className="focus-visible:ring-0 border-0 focus-visible:ring-offset-0 bg-zinc-300 dark:bg-zinc-900 pl-11"
                    placeholder={`Message ${
                      type === "chat" ? name : "#" + name
                    }`}
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                  <Smile className="absolute top-6 right-6" />
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
