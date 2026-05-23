import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/common/status-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getClientById } from "@/lib/data/clients";
import { listProjectsByClient } from "@/lib/data/projects";
import { listNotesByClient } from "@/lib/data/notes";
import { listFilesByClient } from "@/lib/data/files";
import { formatCurrency, getInitials } from "@/lib/utils";
import { format } from "date-fns";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  const [projects, notes, files] = await Promise.all([
    listProjectsByClient(client.id),
    listNotesByClient(client.id),
    listFilesByClient(client.id),
  ]);

  const totalValue = projects.reduce((s, p) => s + (p.budget ?? 0), 0);

  return (
    <div>
      <PageHeader title={client.name} description={client.company ?? undefined}>
        <Button asChild variant="ghost" size="sm">
          <Link href="/clients">
            <ArrowLeft className="size-4" />
            All clients
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarFallback className="bg-muted text-base font-semibold">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{client.name}</p>
                {client.company && (
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                )}
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <ContactRow icon={Mail} label="Email" value={client.email} link={client.email ? `mailto:${client.email}` : null} />
              <ContactRow icon={Phone} label="Phone" value={client.phone} />
              <ContactRow icon={Globe} label="Website" value={client.website} link={client.website} />
              <ContactRow icon={ExternalLink} label="Upwork" value={client.upwork_url} link={client.upwork_url} />
              <ContactRow icon={ExternalLink} label="Fiverr" value={client.fiverr_url} link={client.fiverr_url} />
              <ContactRow icon={Building2} label="Joined" value={format(new Date(client.created_at), "MMM d, yyyy")} />
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Stat label="Projects" value={projects.length} />
              <Stat label="Lifetime value" value={formatCurrency(totalValue)} />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="projects">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-4">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  {projects.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No projects yet for this client.
                    </p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {projects.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/projects/${p.id}`}
                            className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-accent/40"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{p.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Budget {p.budget ? formatCurrency(p.budget) : "—"} ·{" "}
                                {p.deadline ? format(new Date(p.deadline), "MMM d") : "no deadline"}
                              </p>
                            </div>
                            <ProjectStatusBadge status={p.status} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardContent className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No notes for this client yet.
                    </p>
                  ) : (
                    notes.map((n) => (
                      <div key={n.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{n.category}</p>
                        </div>
                        {n.body && (
                          <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                            {n.body}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <Card>
                <CardContent>
                  {files.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No files uploaded yet.
                    </p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {files.map((f) => (
                        <li key={f.id} className="flex items-center justify-between py-2.5">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{f.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {f.size_bytes ? (f.size_bytes / 1024 / 1024).toFixed(2) + " MB" : ""}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost">
                            Download
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  link,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null;
  link?: string | null;
}) {
  if (!value) {
    return (
      <div className="flex items-center gap-2.5 text-muted-foreground/60">
        <Icon className="size-4" />
        <span className="text-xs">{label} not set</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="size-4 text-muted-foreground" />
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="truncate hover:underline">
          {value}
        </a>
      ) : (
        <span className="truncate">{value}</span>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
