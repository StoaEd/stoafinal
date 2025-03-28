"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useImperativeHandle } from "react";

const Editor = forwardRef(({ content }: { content: string }, ref) => {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    autofocus: "end",
    content: content,
  });

  useImperativeHandle(ref, () => ({
    getEditorContent: () => editor?.getHTML(),
  }));

  return (
    <EditorContent
      editor={editor}
      className="prose dark:prose-invert inset-0 max-w-full"
    />
  );
});
Editor.displayName = "Editor";

export default Editor;
