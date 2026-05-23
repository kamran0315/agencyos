import { PageHeader } from "@/components/common/page-header";
import { ProposalList } from "@/components/proposals/proposal-list";
import { AIGeneratorDialog } from "@/components/proposals/ai-generator-dialog";
import { listProposals } from "@/lib/data/proposals";

export default async function ProposalsPage() {
  const proposals = await listProposals();
  return (
    <div>
      <PageHeader
        title="Proposal Vault"
        description="Reusable templates and AI-generated responses."
      >
        <AIGeneratorDialog />
      </PageHeader>
      <div className="p-6">
        <ProposalList proposals={proposals} />
      </div>
    </div>
  );
}
