// components/courses/CourseNotepad.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { debounce } from "lodash";
import api from "@/lib/api/axios";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, 
  Table as TableIcon, Loader2, 
  CheckCircle
} from "lucide-react";

interface CourseNotepadProps {
  courseSlug: string;
}

// ---------------- Toolbar --------------------
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 rounded-t">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
        type="button"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
        type="button"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("underline") ? "bg-gray-300" : ""}`}
        type="button"
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded text-xs font-bold hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""}`}
        type="button"
      >
        H1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded text-xs font-bold hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""}`}
        type="button"
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded text-xs font-bold hover:bg-gray-200 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""}`}
        type="button"
      >
        H3
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
        type="button"
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-300" : ""}`}
        type="button"
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Table */}
      <button
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
        className="p-1.5 rounded hover:bg-gray-200"
        title="Insert Table"
        type="button"
      >
        <TableIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

// ---------------- Main Component --------------------
export default function CourseNotepad({ courseSlug }: CourseNotepadProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveNotes = useMemo(() => {
    const performSave = async (htmlContent: string) => {
      setIsSaving(true);
      try {
        await api.patch(`/courses/notes/${courseSlug}/`, { content: htmlContent });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save notes", error);
      } finally {
        setIsSaving(false);
      }
    };
    return debounce(performSave, 1500);
  }, [courseSlug]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "Start typing your course notes here...",
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose max-w-none p-4 min-h-[400px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      saveNotes(html);
    },
  });

  useEffect(() => {
    const fetchNotes = async () => {
      if (!editor) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/courses/notes/${courseSlug}/`);
        const content = res.data.content || "";
        if (editor.isEmpty) {
          editor.commands.setContent(content);
        }
        setLastSaved(new Date(res.data.updated_at));
      } catch (error) {
        console.error("Failed to load notes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [courseSlug, editor]);

  useEffect(() => {
    return () => {
      saveNotes.cancel();
    };
  }, [saveNotes]);

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded bg-white overflow-hidden">
      
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b text-xs text-gray-500">
        <span className="font-semibold text-gray-700">Your Personal Course Notebook</span>
        <div className="flex items-center">
          {isLoading ? (
            <span>Loading...</span>
          ) : isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin mr-1" /> Saving...
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
              {lastSaved
                ? `Saved ${lastSaved.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Ready"}
            </>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <MenuBar editor={editor} />

      {/* Editor Content */}
      <div className="flex-grow bg-white cursor-text">
        <EditorContent editor={editor} />
      </div>

      {/* Global Styles for Editor Content */}
      <style jsx global>{`
        /* General Editor Container */
        .ProseMirror {
          min-height: 400px;
        }
        .ProseMirror:focus {
          outline: none;
        }

        /* 🟢 FIX: List Styles (Bullets & Numbers) */
        .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 0.5rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 0.5rem 0;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        /* 🟢 FIX: Table Styles (1px border, better spacing) */
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          table-layout: fixed;
        }
        .ProseMirror td,
        .ProseMirror th {
          border: 1px solid #e2e8f0; /* 1px light gray */
          padding: 8px 10px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror th {
          background-color: #f8f9fa;
          font-weight: 600;
          text-align: left;
        }
        
        /* 🟢 Bold Headers */
        .ProseMirror h1 {
          font-size: 1.75em;
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: 800; /* Bold */
        }
        .ProseMirror h2 {
          font-size: 1.4em;
          margin-top: 0.8em;
          margin-bottom: 0.4em;
          font-weight: 700; /* Bold */
        }
        .ProseMirror h3 {
          font-size: 1.2em;
          margin-top: 0.6em;
          margin-bottom: 0.4em;
          font-weight: 700; /* Bold */
        }
      `}</style>
    </div>
  );
}