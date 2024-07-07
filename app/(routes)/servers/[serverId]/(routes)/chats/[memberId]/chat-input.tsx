"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, SendHorizontal, Smile } from "lucide-react";

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
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                  <button type="button">
                    <Plus />
                  </button>
                  <Input
                    className="focus-visible:ring-0 border-0 focus-visible:ring-offset-0 bg-zinc-300 dark:bg-zinc-900"
                    placeholder="Say hello!"
                    {...field}
                  />
                  <Smile />
                </section>
              </FormControl>
            </FormItem>
          )}
        />
        <button type="submit" className="bg-transparent">
          <SendHorizontal className="mr-2 h-5 w-5 absolute top-6 right-10" />
        </button>
      </form>
    </Form>
  );
};

export default ChatInput;
