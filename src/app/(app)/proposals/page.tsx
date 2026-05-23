import { PageHeader } from "@/components/common/page-header";
import { ProposalList } from "@/components/proposals/proposal-list";
import { AIGeneratorDialog } from "@/components/proposals/ai-generator-dialog";
import { mockProposals } from "@/lib/mock-data";

export default function ProposalsPage() {
  return (
    <div>
      <PageHeader
        title="Proposal Vault"
        description="Reusable templates and AI-generated responses."
      >
        <AIGeneratorDialog />
      </PageHeader>
      <div className="p-6">
        <ProposalList proposals={mockProposals} />
      </div>
    </div>
  );
}
