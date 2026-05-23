import { PageHeader } from "@/components/common/page-header";
import { ClientList } from "@/components/clients/client-list";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { listClients } from "@/lib/data/clients";
import { listProjects } from "@/lib/data/projects";

export default async function ClientsPage() {
  const [clients, projects] = await Promise.all([
    listClients(),
    listProjects(),
  ]);
  return (
    <div>
      <PageHeader
        title="Clients"
        description="Everyone you've worked with or are working with."
      >
        <ClientFormDialog />
      </PageHeader>
      <div className="p-6">
        <ClientList clients={clients} projects={projects} />
      </div>
    </div>
  );
}
