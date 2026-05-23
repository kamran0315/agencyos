"use client";

import { useMemo, useState } from "react";
import { Copy, FileText, Search, Tag } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/empty-state";
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

  function copy(body: string) {
    navigator.clipboard.writeText(body);
    toast.success("Copied to clipboard");
  }

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
                <Card key={p.id} className="gap-3 transition-shadow hover:shadow-md">
                  <CardContent className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Used {p.use_count}×
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {PROPOSAL_CATEGORY_LABELS[p.category]}
                      </Badge>
                    </div>

                    <pre className="line-clamp-4 whitespace-pre-wrap font-sans text-xs text-muted-foreground">
                      {p.body}
                    </pre>

                    {p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="font-normal"
                          >
                            <Tag className="size-2.5" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <div className="border-t border-border px-6 pt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full"
                      onClick={() => copy(p.body)}
                    >
                      <Copy className="size-3.5" />
                      Copy proposal
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
