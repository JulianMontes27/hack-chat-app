"use client";

import useModalStore from "@/hooks/use-modal-store";

import axios from "axios";
import qs from "query-string";

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreateServerFormSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "No file uploaded.",
  }),
});

type MsgFileSchemaType = z.infer<typeof CreateServerFormSchema>;

export default function MessageFileModal() {
  const { modalType, onClose, data, isOpen } = useModalStore();
  const { query, apiUrl } = data;
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<MsgFileSchemaType>({
    resolver: zodResolver(CreateServerFormSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: MsgFileSchemaType) {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query: query,
      });

      const res = await axios.post(url, {
        ...values,
        content: values.fileUrl, //upload the
      });
      handleClose();
      router.refresh();
    } catch (error) {
      toast.error(`[POST]: ${error}`, {
        position: "bottom-right",
      });
    }
  }

  return (
    <Dialog
      open={isOpen && modalType === "msg-file"}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Upload file
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-5">
                  <FormLabel>File Url</FormLabel>
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
              Upload
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
