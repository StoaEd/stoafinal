"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MediumBackgroundPattern } from "@/components/ui/background-patterns/medium-background";
import { SidebarInset } from "@/components/ui/sidebar";
import HeaderWithBreadcrumbs from "@/components/ui/ui-templates/header-with-breadcrumbs";
import Editor from "@/components/editor/Editor";
import { db } from "@/lib/firebase/firebase";

export default function NotesPage() {
  const params = useParams();
  const noteID = Array.isArray(params.noteID) ? params.noteID[0] : params.noteID;
  const [content, setContent] = useState("<h1>Loading...</h1>");
  const [noteTitle, setNoteTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const editorRef = useRef<{ getEditorContent: () => string } | null>(null);

  useEffect(() => {
    const fetchNoteContent = async () => {
      if (!noteID) {
        setContent("<h1>No note ID provided</h1>");
        setLoading(false);
        return;
      }
      try {
        const noteDoc = await getDoc(doc(db, "notes", noteID));
        if (noteDoc.exists()) {
          const noteData = noteDoc.data();
          setContent(noteData?.content || "");
          setNoteTitle(noteData?.title || "Untitled Note");
        } else {
          setContent("<h1>Note not found</h1>");
        }
      } catch (error) {
        console.error("Error fetching note content:", error);
        setContent("<h1>Error loading note</h1>");
      } finally {
        setLoading(false);
      }
    };
    fetchNoteContent();
  }, [noteID]);

  const handleSave = async () => {
    if (!editorRef.current) {
      console.error("Editor reference is null");
      return;
    }
    try {
      const editorContent = editorRef.current.getEditorContent();
      await updateDoc(doc(db, "notes", String(noteID)), { content: editorContent });
      console.log("Note saved successfully");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <SidebarInset className="bg-secondary/47">
      <HeaderWithBreadcrumbs />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="relative bg-secondary/50 min-h-[70vh] flex-1 border-2 rounded-xl md:min-h-min p-10 flex flex-col gap-4">
          <MediumBackgroundPattern />
          <div className="flex flex-col z-5 gap-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {loading ? "Loading..." : noteTitle}
            </h1>
            <p className="text note-metadata">Below are the notes you have created. Click on a note to view it.</p>
            <div className="relative flex-grow h-full w-full rounded-lg shadow-primary/2 shadow-lg bg-secondary/30 p-4">
              <div className="h-full w-full">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    <Editor content={content} ref={editorRef} />
                    <button
                      onClick={handleSave}
                      className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
