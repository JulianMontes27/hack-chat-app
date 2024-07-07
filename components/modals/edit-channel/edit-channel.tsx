import useModalStore from "@/hooks/use-modal-store";

import axios from "axios";

import { useParams, useRouter } from "next/navigation";

import toast from "react-hot-toast";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect } from "react";
import { ChannelType } from "@prisma/client";

import qs from "query-string";

const CreateServerFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Server name must be at least 2 characters.",
    })
    .optional(),
  type: z.nativeEnum(ChannelType),
});

type CreateServerFormType = z.infer<typeof CreateServerFormSchema>;

export default function EditChannelModal() {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const router = useRouter();
  const params = useParams();

  const handleClose = () => {
    onClose();
  };

  const form = useForm<CreateServerFormType>({
    resolver: zodResolver(CreateServerFormSchema),
    defaultValues: {
      name: data.channel?.name,
      type: data.channel?.type || ChannelType.TEXT,
    },
  });
  //seed the default values of the form
  useEffect(() => {
    if (data.channel) {
      form.setValue("type", data.channel.type);
      form.setValue("name", data.channel.name);
    }
  }, [data.channel, form]);

  async function onSubmit(values: CreateServerFormType) {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${data.channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.patch(url, values).then((res) => {
        if (res.status === 200) {
          toast.success("Changes saved.");
        }
      });
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Error submiting your request.");
    }
  }

  return (
    <>
      <Dialog
        open={isOpen && modalType === "edit-channel"}
        onOpenChange={handleClose}
      >
        <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
          <DialogHeader className="py-3 px-3">
            <DialogTitle className="font-bold text-2xl mb-2">
              Edit channel
            </DialogTitle>
            <DialogDescription className="flex flex-col w-full items-star gap-2">
              <span className="text-[16px] font-semibold ">
                Modify {data.channel?.name}&apos;s name and/or type.
              </span>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={"text-xs uppercase font-bold text-zinc-500/90"}
                    >
                      Channel name
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        className="bg-white"
                        placeholder={field.value}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your Channel&apos;s display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-5">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500/90">
                      Type
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem value={type} key={type}>
                            {type.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This is your Channel&apos;s type.
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
