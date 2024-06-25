"use client";

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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpRight, SquareArrowOutUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { useState } from "react";
import { Label } from "@/components/ui/label";

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
  const [inviteCode, setInviteCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const handleClick = () => {
    setModalOpen((prev) => !prev);
  };

  const router = useRouter();

  const form = useForm<CreateServerFormType>({
    resolver: zodResolver(CreateServerFormSchema),
    defaultValues: {
      name: "",
      imgUrl: "",
    },
  });

  async function onSubmit(values: CreateServerFormType) {
    try {
      //submit post form
      await axios.post(`/api/servers`, values);
      form.reset();
      router.push("/");
      router.refresh();
      toast.success("Created succesfully.");
    } catch (error) {
      toast.error(`[POST]: ${error}`, {
        position: "bottom-right",
      });
    }
  }

  const inviteCodeSubmit = (event: any) => {
    event.preventDefault();
    router.push(inviteCode);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <Dialog>
        <div className="max-w-xl flex">
          <DialogHeader className="py-3 px-3">
            <DialogTitle className="font-bold text-4xl mb-2 ">
              Create your first
              <DialogTrigger>
                <span
                  className={cn(
                    "inline-block bg-gradient-to-r from-rose-100 via-rose-400 to-rose-500 text-transparent bg-clip-text text-[40px] mx-2 ml-8 focus-visible:ring-0 focus-visible:ring-offset-0",
                    !modalOpen && "animate-pulse-big-small"
                  )}
                >
                  Dev-server!
                </span>
              </DialogTrigger>
            </DialogTitle>

            <DialogDescription className="flex flex-col w-full items-star gap-2">
              <span className="text-[16px] font-semibold ">
                Start working together with other devs by clicking the colored
                words
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogContent
          className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="py-3 px-3">
            <DialogTitle className="font-bold text-2xl mb-2 ">
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
                Create server
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="mt-4">
        <Dialog open={modalOpen} onOpenChange={handleClick}>
          <div className="max-w-xl flex">
            <DialogHeader className="py-3 px-3">
              <DialogTrigger className="text-lg flex flex-row gap-2 focus-visible:ring-0 focus-visible:ring-offset-0">
                Or... join a server with an{" "}
                <span className="text-rose-500">invite-code!</span>
                <ArrowUpRight />
              </DialogTrigger>
            </DialogHeader>
          </div>
          <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
            <DialogHeader className="py-3 px-3">
              <DialogTitle className="font-bold text-2xl mb-2">
                Join server
              </DialogTitle>
              <DialogDescription className="flex flex-col w-full items-star gap-2">
                <span className="text-[16px] font-semibold ">
                  Get ready to hack with your peers!
                </span>
              </DialogDescription>
            </DialogHeader>
            <div>
              <form onSubmit={inviteCodeSubmit}>
                <Label className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  SERVER INVITE CODE
                </Label>
                <div className="flex flex-row items-center gap-3">
                  <Input
                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 overflow-x-auto whitespace-nowrap"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                  <button type="submit">
                    <SquareArrowOutUpRight />
                  </button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
