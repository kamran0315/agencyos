"use client";

import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AIGeneratorDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  async function handleGenerate() {
    if (!jobDescription.trim()) {
      toast.error("Paste the job description first.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/ai/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = (await res.json()) as { text: string };
      setResult(data.text);
    } catch {
      toast.error("Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setResult("");
          setJobDescription("");
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <Sparkles className="size-4" />
            AI generate
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-4" />
            AI proposal generator
          </DialogTitle>
          <DialogDescription>
            Paste a job description and we&apos;ll draft an Upwork-style proposal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job">Job description</Label>
            <Textarea
              id="job"
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the Upwork job post here…"
            />
          </div>

          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Generated proposal</Label>
                <Button size="sm" variant="ghost" onClick={copy}>
                  <Copy className="size-3.5" />
                  Copy
                </Button>
              </div>
              <Textarea
                rows={10}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {result ? "Regenerate" : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
