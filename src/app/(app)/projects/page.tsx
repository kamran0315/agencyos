import { PageHeader } from "@/components/common/page-header";
import { ProjectList } from "@/components/projects/project-list";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { listClients } from "@/lib/data/clients";
import { listProjects } from "@/lib/data/projects";

export default async function ProjectsPage() {
  const [projects, clients] = await Promise.all([
    listProjects(),
    listClients(),
  ]);
  return (
    <div>
      <PageHeader
        title="Projects"
        description="Every engagement, past and present."
      >
        <ProjectFormDialog clients={clients} />
      </PageHeader>
      <div className="p-6">
        <ProjectList projects={projects} clients={clients} />
      </div>
    </div>
  );
}
