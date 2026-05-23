"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ClientFormDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Client created", {
      description: "Demo mode — no record was persisted.",
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" />
            New client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New client</DialogTitle>
          <DialogDescription>
            Add a client to your roster. You can edit any of these later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Inc." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jane@acme.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 555 000 0000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="upwork">Upwork profile</Label>
              <Input id="upwork" placeholder="upwork.com/freelancers/~..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiverr">Fiverr profile</Label>
              <Input id="fiverr" placeholder="fiverr.com/..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" placeholder="https://" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Working style, preferences, anything worth remembering…"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
