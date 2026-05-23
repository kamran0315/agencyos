"use client";

import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/empty-state";
import { ProposalCard } from "./proposal-card";
import {
  PROPOSAL_CATEGORY_LABELS,
  type Proposal,
  type ProposalCategory,
} from "@/lib/types";

const CATEGORIES: ProposalCategory[] = [
  "upwork",
  "fiverr",
  "discovery",
  "onboarding",
  "followup",
];

export function ProposalList({ proposals }: { proposals: Proposal[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<ProposalCategory | "all">("all");

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      if (tab !== "all" && p.category !== tab) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = [p.title, p.body, p.tags.join(" ")].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [proposals, tab, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search proposals…"
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as ProposalCategory | "all")}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c}>
              {PROPOSAL_CATEGORY_LABELS[c]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No proposals found"
              description="Try a different category or search term."
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filtered.map((p) => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
