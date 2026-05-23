"use client";

import { useMemo, useState } from "react";
import { Pin, Plus, Search, StickyNote } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/empty-state";
import { mockNotes } from "@/lib/mock-data";
import {
  NOTE_CATEGORY_LABELS,
  type NoteCategory,
} from "@/lib/types";

export default function NotesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NoteCategory | "all">("all");

  const filtered = useMemo(() => {
    return mockNotes.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = (n.title + " " + (n.body ?? "")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, category]);

  const pinned = filtered.filter((n) => n.pinned);
  const others = filtered.filter((n) => !n.pinned);

  return (
    <div>
      <PageHeader
        title="Notes & Requirements"
        description="Requirements, credentials, meeting notes, and more — searchable."
      >
        <Button>
          <Plus className="size-4" />
          New note
        </Button>
      </PageHeader>

      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              className="pl-9"
            />
          </div>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as NoteCategory | "all")}
          >
            <SelectTrigger size="sm" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(Object.entries(NOTE_CATEGORY_LABELS) as [NoteCategory, string][]).map(
                ([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={StickyNote}
            title="No notes found"
            description="Try clearing the search or category filter."
          />
        ) : (
          <>
            {pinned.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pinned
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {pinned.map((n) => (
                    <NoteCard key={n.id} note={n} />
                  ))}
                </div>
              </section>
            )}

            {others.length > 0 && (
              <section className="space-y-2">
                {pinned.length > 0 && (
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    All notes
                  </h2>
                )}
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {others.map((n) => (
                    <NoteCard key={n.id} note={n} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function NoteCard({ note }: { note: (typeof mockNotes)[number] }) {
  return (
    <Card className="gap-2 transition-shadow hover:shadow-md">
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              {note.pinned && <Pin className="size-3 text-muted-foreground" />}
              {note.title}
            </p>
            <p className="text-xs text-muted-foreground">
              Updated {format(new Date(note.updated_at), "MMM d, yyyy")}
            </p>
          </div>
          <Badge variant="secondary" className="capitalize">
            {NOTE_CATEGORY_LABELS[note.category]}
          </Badge>
        </div>
        {note.body && (
          <p className="line-clamp-4 whitespace-pre-wrap text-xs text-muted-foreground">
            {note.body}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
