import {
  File,
  FileArchive,
  FileImage,
  FileText,
  Upload,
} from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { listFiles } from "@/lib/data/files";
import { listProjects } from "@/lib/data/projects";

function iconFor(mime: string | null) {
  if (!mime) return File;
  if (mime.startsWith("image/")) return FileImage;
  if (mime === "application/pdf") return FileText;
  if (mime === "application/zip") return FileArchive;
  return File;
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default async function FilesPage() {
  const [files, projects] = await Promise.all([listFiles(), listProjects()]);
  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <div>
      <PageHeader
        title="Files"
        description="ZIPs, PDFs, brand assets, source files — all in one place."
      >
        <Button>
          <Upload className="size-4" />
          Upload
        </Button>
      </PageHeader>

      <div className="p-6">
        {files.length === 0 ? (
          <EmptyState
            icon={File}
            title="No files yet"
            description="Upload your first asset to get started."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((f) => {
              const Icon = iconFor(f.mime_type);
              const project = f.project_id ? projectById[f.project_id] : null;
              return (
                <Card key={f.id} className="gap-3 transition-shadow hover:shadow-md">
                  <CardContent className="space-y-2">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="truncate text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(f.size_bytes)} ·{" "}
                        {format(new Date(f.created_at), "MMM d")}
                      </p>
                    </div>
                    {project && (
                      <Badge variant="outline" className="font-normal">
                        {project.title}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
