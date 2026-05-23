import { File } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { FileCard } from "@/components/files/file-card";
import { FileUploadButton } from "@/components/files/file-upload-button";
import { listFiles } from "@/lib/data/files";
import { listProjects } from "@/lib/data/projects";
import { getUserId } from "@/lib/data/auth";

export default async function FilesPage() {
  const [files, projects, ownerId] = await Promise.all([
    listFiles(),
    listProjects(),
    getUserId(),
  ]);
  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <div>
      <PageHeader
        title="Files"
        description="ZIPs, PDFs, brand assets, source files — all in one place."
      >
        {ownerId && <FileUploadButton ownerId={ownerId} />}
      </PageHeader>

      <div className="p-6">
        {files.length === 0 ? (
          <EmptyState
            icon={File}
            title="No files yet"
            description="Upload your first asset to get started."
            action={ownerId && <FileUploadButton ownerId={ownerId} />}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((f) => (
              <FileCard
                key={f.id}
                file={f}
                project={f.project_id ? projectById[f.project_id] : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
