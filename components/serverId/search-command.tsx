"use client";

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
    type: string;
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

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div
        className="text-sm text-muted-foreground m-3 flex items-center justify-between dark:hover:bg-gray-800 transition cursor-pointer bg-zinc-200/75 dark:bg-slate-800 p-2 rounded-lg hover:"
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
          {data.map((group) =>
            group.data && group.data.length >= 1 ? (
              <CommandGroup key={group.label} heading={group.label}>
                {group.data?.map((item) => (
                  <CommandItem>
                    {item.icon}
                    {item.name}
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
