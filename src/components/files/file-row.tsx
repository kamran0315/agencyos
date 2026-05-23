"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import type { FileItem } from "@/lib/types";

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function FileRow({ file }: { file: FileItem }) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
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
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatSize(file.size_bytes)}</p>
      </div>
      <Button size="sm" variant="ghost" onClick={handleDownload} disabled={downloading}>
        {downloading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Download className="size-3.5" />
        )}
        Download
      </Button>
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
    </li>
  );
}
