import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { Editor, UseEditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { DependencyList } from "react";

function useRickTextEditor(
  options?: UseEditorOptions,
  deps?: DependencyList,
): Editor | null {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Highlight,
        Typography,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      ...options,
    },
    deps,
  );

  return editor;
}

export default useRickTextEditor;
