"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4">
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 bg-secondary pt-10 w-32 flex justify-center"
      >
        <SheetClose>
          <Sidebar />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
