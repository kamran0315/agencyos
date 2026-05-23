"use client";

import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/(auth)/login/actions";
import Link from "next/link";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-2 gap-2">
          <Avatar className="size-7">
            <AvatarFallback className="bg-foreground text-background">A</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-none">Admin</p>
            <p className="text-xs text-muted-foreground leading-tight">
              admin@agencyos.app
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <User className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOut}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOut className="size-4" />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
