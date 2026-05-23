import { PageHeader } from "@/components/common/page-header";
import { ProjectList } from "@/components/projects/project-list";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { mockClients, mockProjects } from "@/lib/mock-data";

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader
        title="Projects"
        description="Every engagement, past and present."
      >
        <ProjectFormDialog />
      </PageHeader>
      <div className="p-6">
        <ProjectList projects={mockProjects} clients={mockClients} />
      </div>
    </div>
  );
}
