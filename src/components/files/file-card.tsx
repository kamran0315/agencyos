"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  deleteFileAction,
  getSignedDownloadUrl,
} from "@/lib/actions/files";
import type { FileItem, Project } from "@/lib/types";

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

export function FileCard({
  file,
  project,
}: {
  file: FileItem;
  project?: Project | null;
}) {
  const router = useRouter();
  const Icon = iconFor(file.mime_type);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleDownload() {
    setDownloading(true);
    const result = await getSignedDownloadUrl(file.id);
    setDownloading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Card className="gap-3 transition-shadow hover:shadow-md">
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-md bg-muted">
              <Icon className="size-5 text-muted-foreground" />
            </div>
            <RowActions>
              <DropdownMenuItem onSelect={handleDownload}>
                <Download className="size-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </RowActions>
          </div>
          <div>
            <p className="truncate text-sm font-medium" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatSize(file.size_bytes)}
              {file.size_bytes ? " · " : ""}
              {format(new Date(file.created_at), "MMM d")}
            </p>
          </div>
          {project && (
            <Badge variant="outline" className="font-normal">
              {project.title}
            </Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="w-full"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            Download
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${file.name}"?`}
        description="The file will be permanently removed from storage."
        confirmLabel="Delete file"
        destructive
        successMessage="File deleted"
        onConfirm={async () => {
          const r = await deleteFileAction(file.id);
          if (r.ok) startTransition(() => router.refresh());
          return r;
        }}
      />
    </>
  );
}
