"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  or,
  addDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

// Components
import { Button } from "@/components/ui/button";
import { MediumBackgroundPattern } from "@/components/ui/background-patterns/medium-background";
import { SidebarInset } from "@/components/ui/sidebar";
import HeaderWithBreadcrumbs from "@/components/ui/ui-templates/header-with-breadcrumbs";

// Firebase
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/lib/firebase/hooks/useAuth";
import { getCurrentUserId } from "@/lib/firebase/auth";
import { Note } from "@/lib/firebase/schema";

// Types
interface NoteSummary {
  NoteId: string;
  title: string;
}

// Components
const NoteCard = ({ note }: { note: NoteSummary }) => (
  <a href={`/dashboard/notes/shelf/${note.NoteId}`} key={note.NoteId}>
    <div className="bg-muted/20 p-4 rounded-lg hover:bg-primary/3 mb-2 border-2 border-primary/10">
      {note.title}
    </div>
  </a>
);

const ActionButtons = ({
  onCreateNote,
}: {
  onCreateNote: () => Promise<void>;
}) => (
  <div className="flex justify-start gap-4">
    <Button onClick={onCreateNote}>Create Note</Button>
    <Button>Create from Template</Button>
  </div>
);

// Main Component
export default function NotesPage() {
  const { user, loading } = useAuth();
  const [notesSummaryList, setNotesSummaryList] = useState<NoteSummary[]>([]);
  const router = useRouter();

  const handleCreateNote = async () => {
    try {
      const currentUserId = getCurrentUserId();
      console.log('userId : ' ,currentUserId)
      const newNote: Note = {
        NoteId: "",
        subjectId: "subject456",
        authorId: currentUserId ? currentUserId : "unknown",
        coAuthorsIds: [],
        timeCreated: Timestamp.now(),
        lastModified: Timestamp.now(),
        title: "One for all",
        content: "This is the content of the new note.",
        sharedStatus: false,
        publicStatus: false,
        referencedMaterialNotes: [],
        referencedPersonalNotes: [],
        referencedPublicNotes: [],
        comments: [],
      };

      const docRef = await addDoc(collection(db, "notes"), newNote);
      console.log("Document written with ID: ", docRef.id);

      // Navigate to the new note
      router.push(`/dashboard/notes/shelf/note-${docRef.id}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    async function loadNotes() {
      if(loading){
        setNotesSummaryList([
          {
            NoteId: "Not logged in",
            title: "Loading ...",
          },
        ]);
        return;
      }

      if (!user) {
        setNotesSummaryList([
          {
            NoteId: "Not logged in",
            title: "Please sign in to view notes",
          },
        ]);
        return;
      }


      try {
        const notesCollection = collection(db, "notes");
        const notesQuery = query(
          notesCollection,
          or(
            where("authorId", "==", getCurrentUserId()),
            where("coAuthorsIds", "array-contains", getCurrentUserId())
          )
        );

        const notesSnapshot = await getDocs(notesQuery);
        const notes = notesSnapshot.docs.map((doc) => ({
          NoteId: doc.id,
          title: doc.data().title || "No title found :(",
        }));

        setNotesSummaryList(
          notes.length
            ? notes
            : [
                {
                  NoteId: "no-notes",
                  title: "No notes found",
                },
              ]
        );
      } catch (error) {
        console.error("Error loading notes:", error);
        setNotesSummaryList([
          {
            NoteId: "error",
            title: "Error loading notes",
          },
        ]);
      }
    }

    loadNotes();
  }, [user,loading]);


  return (
    <SidebarInset className="bg-secondary/47">
      <HeaderWithBreadcrumbs />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="relative min-h-[70vh] flex-1 border-2 rounded-xl md:min-h-min p-10 flex flex-col gap-4">
          <MediumBackgroundPattern />
          <div className="flex flex-col z-5 gap-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Notes
            </h1>
            <ActionButtons onCreateNote={handleCreateNote} />
            <div className="bg-secondary/10 flex-grow h-full w-full rounded-lg  border-primary/10">
              {notesSummaryList.map((note) => (
                <NoteCard key={note.NoteId} note={note} />
              ))}
              
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
