"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FileUploader from "../file-uploader";

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

const CreateServerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Server name must be at least 2 characters.",
  }),
  imgUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});

type CreateServerFormType = z.infer<typeof CreateServerFormSchema>;

export function CreateModalForm() {
  // 1. Define your form.
  const form = useForm<CreateServerFormType>({
    resolver: zodResolver(CreateServerFormSchema),
    defaultValues: {
      name: "",
      imgUrl: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateServerFormType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={form.formState.isSubmitting}
                  placeholder="react-native-comumnity"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imgUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <FileUploader
                  endpoint="serverImage"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant={"default"}
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full text-white bg-indigo-500 hover:bg-indigo-500/90"
        >
          Create
        </Button>
      </form>
    </Form>
  );
}
