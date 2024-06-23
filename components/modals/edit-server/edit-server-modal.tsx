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
import { useEffect } from "react";

const CreateServerFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Server name must be at least 2 characters.",
    })
    .optional(),
  imgUrl: z
    .string()
    .min(1, {
      message: "Server image is required.",
    })
    .optional(),
});

type CreateServerFormType = z.infer<typeof CreateServerFormSchema>;

export default function EditServerModal() {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const handleClose = () => {
    onClose();
  };

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<CreateServerFormType>({
    resolver: zodResolver(CreateServerFormSchema),
    defaultValues: {
      name: data.server?.name,
      imgUrl: data.server?.imgUrl,
    },
  });

  useEffect(() => {
    if (data.server) {
      form.setValue("imgUrl", data.server.imgUrl);
      form.setValue("name", data.server.name);
    }
  }, [data.server, form]);

  // 2. Define a submit handler.
  async function onSubmit(values: CreateServerFormType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const res = await axios
        .patch(`/api/servers/${data.server?.id}`, values)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Changes saved.");
          }
        });
      router.refresh();
      onClose(); //close modal when everything is udpated.
    } catch (error) {
      toast.error("Error submiting your request.");
    }
  }

  return (
    <>
      <Dialog
        open={isOpen && modalType === "edit-server"}
        onOpenChange={handleClose}
      >
        <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
          <DialogHeader className="py-3 px-3">
            <DialogTitle className="font-bold text-2xl mb-2">
              Edit server
            </DialogTitle>
            <DialogDescription className="flex flex-col w-full items-star gap-2">
              <span className="text-[16px] font-semibold ">
                Customize your server however you like.
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
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500/90">
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <FileUploader
                        endpoint="serverImage"
                        value={field.value!}
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
                    <FormLabel
                      className={"text-xs uppercase font-bold text-zinc-500/90"}
                    >
                      Server name
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder={data.server?.name}
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
                Save
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
