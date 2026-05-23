import { PageHeader } from "@/components/common/page-header";
import { ClientList } from "@/components/clients/client-list";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { mockClients, mockProjects } from "@/lib/mock-data";

export default function ClientsPage() {
  return (
    <div>
      <PageHeader
        title="Clients"
        description="Everyone you've worked with or are working with."
      >
        <ClientFormDialog />
      </PageHeader>
      <div className="p-6">
        <ClientList clients={mockClients} projects={mockProjects} />
      </div>
    </div>
  );
}
