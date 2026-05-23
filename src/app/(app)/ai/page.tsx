"use client";

import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Endpoint = "proposal" | "summarize" | "breakdown";

const TOOLS: { id: Endpoint; title: string; description: string; placeholder: string }[] = [
  {
    id: "proposal",
    title: "Upwork proposal generator",
    description: "Paste a job description, get a polished proposal.",
    placeholder: "Paste the job post here…",
  },
  {
    id: "summarize",
    title: "Client requirements summarizer",
    description: "Distill long client messages into a tight requirements list.",
    placeholder: "Paste raw client emails or call notes…",
  },
  {
    id: "breakdown",
    title: "Project task breakdown",
    description: "Turn a project description into a starter task list.",
    placeholder: "Describe the project scope and goals…",
  },
];

export default function AIPage() {
  return (
    <div>
      <PageHeader
        title="AI Tools"
        description="Generate proposals, summarize requirements, plan tasks."
      />
      <div className="grid gap-4 p-6 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <AITool key={tool.id} {...tool} />
        ))}
      </div>
    </div>
  );
}

function AITool({
  id,
  title,
  description,
  placeholder,
}: {
  id: Endpoint;
  title: string;
  description: string;
  placeholder: string;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!input.trim()) {
      toast.error("Add some input first.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch(`/api/ai/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, jobDescription: input }),
      });
      const data = (await res.json()) as { text: string };
      setOutput(data.text);
    } catch {
      toast.error("AI request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4" />
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor={`${id}-in`}>Input</Label>
          <Textarea
            id={`${id}-in`}
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <Button onClick={run} disabled={loading} className="w-full">
          {loading && <Loader2 className="size-4 animate-spin" />}
          Generate
        </Button>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Output</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied");
                }}
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
            <Textarea
              rows={8}
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
