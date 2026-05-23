"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadFileToStorage } from "@/lib/storage";
import { recordUploadedFileAction } from "@/lib/actions/files";

interface Props {
  ownerId: string;
  projectId?: string | null;
  clientId?: string | null;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  label?: string;
}

export function FileUploadButton({
  ownerId,
  projectId,
  clientId,
  variant = "default",
  size = "default",
  label = "Upload",
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);

    let successCount = 0;
    let failureCount = 0;

    for (const file of Array.from(fileList)) {
      const uploadResult = await uploadFileToStorage(file, ownerId);
      if (!uploadResult.ok) {
        failureCount++;
        toast.error(`Upload failed (${file.name}): ${uploadResult.error}`);
        continue;
      }

      const recordResult = await recordUploadedFileAction({
        name: file.name,
        storage_path: uploadResult.storage_path,
        mime_type: file.type || null,
        size_bytes: file.size,
        project_id: projectId ?? null,
        client_id: clientId ?? null,
      });

      if (recordResult.ok) {
        successCount++;
      } else {
        failureCount++;
        toast.error(`Saved file but failed to record (${file.name}): ${recordResult.error}`);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(
        `Uploaded ${successCount} file${successCount === 1 ? "" : "s"}`
      );
      router.refresh();
    }
    if (failureCount === 0 && successCount === 0) {
      toast.info("No files were processed.");
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {label}
      </Button>
    </>
  );
}
