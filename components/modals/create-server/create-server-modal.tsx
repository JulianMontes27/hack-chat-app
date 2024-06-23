"use client";

import useModalStore from "@/hooks/use-modal-store";

import axios from "axios";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import FileUploader from "@/components/file-uploader";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreateServerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Server name must be at least 2 characters.",
  }),
  imgUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});

type CreateServerFormType = z.infer<typeof CreateServerFormSchema>;

export default function CreateServerModal() {
  const { isOpen, onClose, modalType } = useModalStore();
  const handleClose = () => {
    onClose();
  };
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<CreateServerFormType>({
    resolver: zodResolver(CreateServerFormSchema),
    defaultValues: {
      name: "",
      imgUrl: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: CreateServerFormType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      //submit post form
      await axios.post(`/api/servers`, values);
      form.reset();
      router.refresh();
      toast.success("Created succesfully.");

      onClose();
    } catch (error) {
      toast.error(`[POST]: ${error}`, {
        position: "bottom-right",
      });
    }
  }

  return (
    <>
      <Dialog
        open={isOpen && modalType === "create-server"}
        onOpenChange={handleClose}
      >
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-5">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <FileUploader
                        endpoint="serverImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your Server&apos;s public image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="react-native-devs"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormDescription>
                      This is your Server&apos;s display name.
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
        </DialogContent>
      </Dialog>
    </>
  );
}
