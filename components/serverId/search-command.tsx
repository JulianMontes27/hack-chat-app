"use client";

import { useRouter, useParams } from "next/navigation";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

interface SearchCommandProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string | null;
          id: string;
        }[]
      | undefined;
  }[];
}

export const SearchCommand: React.FC<SearchCommandProps> = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const params = useParams();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    //on un-mount remove the event listener
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);

    if (type === "member") {
      //redirect to the conversion page
      return router.push(`/servers/${params.serverId}/chats/${id}`);
    }
    if (type === "channel") {
      //redirect to the conversion page
      return router.push(`/servers/${params.serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <div
        className="text-sm text-muted-foreground m-3 flex items-center justify-between   cursor-pointer bg-zinc-200/75 dark:bg-slate-800 rounded-lg transition duration-300 ease-in-out transform hover:scale-105  px-4 py-2 bg-white text-black"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-row items-center gap-3 bg-">
          <Search />
          Search
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search channels, members, ..." />
        <CommandList>
          {data.map(({ label, type, data }) =>
            data && data.length >= 1 ? (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ name, icon, id }) => (
                  <CommandItem key={id} className="cursor-pointer">
                    <h1
                      onClick={() => handleClick({ id, type })}
                      className="flex flex-row gap-2"
                    >
                      {icon}
                      {name}
                    </h1>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null
          )}
        </CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandDialog>
    </>
  );
};
