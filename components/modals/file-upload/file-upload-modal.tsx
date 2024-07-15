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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import qs from "query-string";

const CreateServerFormSchema = z.object({
  fileUrl: z.string().min(1),
});

type CreateServerFormType = z.infer<typeof CreateServerFormSchema>;

export default function FileUploadModal() {
  const { isOpen, modalType, data, onClose } = useModalStore();
  const handleClose = () => {
    onClose();
  };

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<CreateServerFormType>({
    resolver: zodResolver(CreateServerFormSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: CreateServerFormType) {
    try {
      const url = qs.stringifyUrl({
        url: data?.apiUrl || "", //theres a possibility that the data has not been passed
        query: data?.query,
      });
      const res = await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      form.reset();
      onClose();
    } catch (error) {
      toast.error(`[POST]: ${error}`, {
        position: "bottom-right",
      });
    }
  }

  return (
    <Dialog
      open={isOpen && modalType === "file-upload"}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Add an attachment
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-5">
                  <FormControl>
                    <FileUploader
                      endpoint="messageFile"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
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
              Send
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
