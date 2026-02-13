/**
 * RichTextEditor — TipTap-based rich text editor for blog content
 * 
 * REQUIRES: Install these packages before use:
 *   pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder
 * 
 * If packages are not installed, falls back to plain textarea.
 */
import { useEffect, useState } from "react";

// Dynamically try to import TipTap — graceful fallback if not installed
let EditorContent: any = null;
let useEditor: any = null;
let StarterKit: any = null;
let LinkExtension: any = null;
let ImageExtension: any = null;
let PlaceholderExtension: any = null;
let tiptapAvailable = false;

try {
  const tiptapReact = require("@tiptap/react");
  const starterKit = require("@tiptap/starter-kit");
  EditorContent = tiptapReact.EditorContent;
  useEditor = tiptapReact.useEditor;
  StarterKit = starterKit.default || starterKit;
  try { LinkExtension = require("@tiptap/extension-link").default || require("@tiptap/extension-link"); } catch {}
  try { ImageExtension = require("@tiptap/extension-image").default || require("@tiptap/extension-image"); } catch {}
  try { PlaceholderExtension = require("@tiptap/extension-placeholder").default || require("@tiptap/extension-placeholder"); } catch {}
  tiptapAvailable = true;
} catch {
  tiptapAvailable = false;
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  rows?: number;
}

// Toolbar button
function TBtn({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title?: string }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${active ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
      {children}
    </button>
  );
}

function TipTapEditor({ value, onChange, placeholder, dir }: RichTextEditorProps) {
  const extensions: any[] = [StarterKit];
  if (LinkExtension) extensions.push(LinkExtension.configure({ openOnClick: false }));
  if (ImageExtension) extensions.push(ImageExtension);
  if (PlaceholderExtension && placeholder) extensions.push(PlaceholderExtension.configure({ placeholder }));

  const editor = useEditor({
    extensions,
    content: value || "",
    onUpdate: ({ editor: e }: any) => onChange(e.getHTML()),
    editorProps: {
      attributes: { class: "prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none", dir: dir || "ltr" },
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("Link URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-slate-50">
        <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><b>B</b></TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><i>I</i></TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="H2">H2</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="H3">H3</TBtn>
        <div className="w-px bg-slate-200 mx-1" />
        <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">• List</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">1. List</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">" Quote</TBtn>
        <div className="w-px bg-slate-200 mx-1" />
        <TBtn onClick={addLink} active={editor.isActive("link")} title="Link">🔗 Link</TBtn>
        <TBtn onClick={addImage} title="Image">🖼 Image</TBtn>
        <div className="w-px bg-slate-200 mx-1" />
        <TBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</TBtn>
        <TBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</TBtn>
      </div>
      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}

// Fallback plain textarea
function PlainEditor({ value, onChange, placeholder, dir, rows = 8 }: RichTextEditorProps) {
  return (
    <div>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir} rows={rows}
        className="flex min-h-[200px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500" />
      <p className="text-[10px] text-amber-500 mt-1">⚠ TipTap not installed. Run: pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder</p>
    </div>
  );
}

export default function RichTextEditor(props: RichTextEditorProps) {
  if (tiptapAvailable && useEditor) {
    return <TipTapEditor {...props} />;
  }
  return <PlainEditor {...props} />;
}
