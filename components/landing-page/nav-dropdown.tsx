import React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

type Routes = {
  href: string;
  label: string;
  isActive: boolean;
};

const NavbarDropdownMenu = ({ routes }: { routes: Routes[] }) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent className="bg-gray-900 w-full">
        <SheetHeader>
          <SheetTitle>HackChat!</SheetTitle>
          <SheetDescription>
            The best platform for interacting with other devs
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-9">
          {routes.map((route, index) => (
            <Link
              href={route.href}
              className={cn(
                "w-full px-4 shadow-sm hover:shadow-pink-600 transition",
                route.isActive ? "font-extrabold" : ""
              )}
              key={route.href}
            >
              {route.label}
              <Separator />
              {/* {index < routes.length - 1 && <Separator />} */}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarDropdownMenu;
