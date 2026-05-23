import { PageHeader } from "@/components/common/page-header";
import { NotesView } from "@/components/notes/notes-view";
import { NoteFormDialog } from "@/components/notes/note-form-dialog";
import { listNotes } from "@/lib/data/notes";

export default async function NotesPage() {
  const notes = await listNotes();
  return (
    <div>
      <PageHeader
        title="Notes & Requirements"
        description="Requirements, credentials, meeting notes, and more — searchable."
      >
        <NoteFormDialog />
      </PageHeader>
      <div className="p-6">
        <NotesView notes={notes} />
      </div>
    </div>
  );
}
