"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  children: React.ReactNode;
  /** Stops the row click from firing when the menu button is clicked. */
  stopPropagation?: boolean;
}

export function RowActions({ children, stopPropagation = true }: Props) {
  return (
    <div
      onClick={
        stopPropagation
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open actions menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
