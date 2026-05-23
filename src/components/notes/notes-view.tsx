"use client";

import { useMemo, useState } from "react";
import { Search, StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/empty-state";
import { NoteCard } from "./note-card";
import { NOTE_CATEGORY_LABELS, type Note, type NoteCategory } from "@/lib/types";

export function NotesView({ notes }: { notes: Note[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NoteCategory | "all">("all");

  const filtered = useMemo(() => {
    return notes.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = (n.title + " " + (n.body ?? "")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [notes, query, category]);

  const pinned = filtered.filter((n) => n.pinned);
  const others = filtered.filter((n) => !n.pinned);

  return (
    <div className="space-y-4">
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
  );
}

