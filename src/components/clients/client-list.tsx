"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Mail, Phone, ExternalLink, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { ClientFormDialog } from "./client-form-dialog";
import { Button } from "@/components/ui/button";
import type { Client, Project } from "@/lib/types";
import { getInitials, truncate } from "@/lib/utils";

interface Props {
  clients: Client[];
  projects: Project[];
}

export function ClientList({ clients, projects }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return clients;
    const q = query.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.company?.toLowerCase().includes(q) ?? false) ||
        (c.email?.toLowerCase().includes(q) ?? false)
    );
  }, [clients, query]);

  const projectCount = (clientId: string) =>
    projects.filter((p) => p.client_id === clientId).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "client" : "clients"}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients found"
          description={
            query
              ? "Try a different search term."
              : "Add your first client to get started."
          }
          action={!query && <ClientFormDialog />}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <Card
              key={client.id}
              className="group gap-3 transition-shadow hover:shadow-md"
            >
              <div className="px-6">
                <div className="flex items-start gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-muted text-foreground">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-sm font-semibold hover:underline"
                    >
                      {client.name}
                    </Link>
                    {client.company && (
                      <p className="text-xs text-muted-foreground">
                        {client.company}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {projectCount(client.id)} project
                    {projectCount(client.id) === 1 ? "" : "s"}
                  </Badge>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  {client.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="size-3.5" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="size-3.5" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-1.5">
                      <ExternalLink className="size-3.5" />
                      <span className="truncate">{client.website}</span>
                    </div>
                  )}
                </div>
                {client.notes && (
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground border-t border-border pt-3">
                    {truncate(client.notes, 140)}
                  </p>
                )}
              </div>
              <div className="border-t border-border px-6 pt-3">
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href={`/clients/${client.id}`}>View details</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
