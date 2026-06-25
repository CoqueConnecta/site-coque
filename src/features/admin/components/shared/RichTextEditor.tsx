import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Markdown } from '@tiptap/markdown';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  RemoveFormatting,
  Unlink,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  /** Markdown string (read from Firebase / CMS state) */
  value: string;
  /** Called with Markdown string whenever content changes */
  onChange: (md: string) => void;
  /** Highlights the border amber to signal unsaved changes */
  isDirty?: boolean;
}

// ─── Link dialog ─────────────────────────────────────────────────────────────

interface LinkDialogProps {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  initialUrl: string;
  onConfirm: (url: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

function LinkDialog({ anchorRef, initialUrl, onConfirm, onRemove, onClose }: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  // Position below the toolbar button
  const rect = anchorRef.current?.getBoundingClientRect();
  const top = rect ? rect.bottom + window.scrollY + 6 : 0;
  const left = rect ? rect.left + window.scrollX : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popover */}
      <div
        role="dialog"
        aria-label="Inserir link"
        className="absolute z-50 flex flex-col gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3 shadow-xl"
        style={{ top, left, minWidth: 300 }}
      >
        <label className="text-xs font-semibold text-[var(--admin-text-2)]">URL do link</label>
        <input
          ref={inputRef}
          type="url"
          value={url}
          placeholder="https://exemplo.com"
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); onConfirm(url); }
            if (e.key === 'Escape') onClose();
          }}
          className="h-9 w-full rounded-lg border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-3 text-sm text-[var(--admin-text-1)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus)]/20"
        />
        <div className="flex items-center justify-between gap-2">
          {initialUrl && (
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[var(--admin-danger-text)] hover:bg-[var(--admin-danger-bg)] transition-colors"
            >
              <Unlink className="h-3.5 w-3.5" />
              Remover link
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--admin-text-3)] hover:bg-[var(--admin-surface)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onConfirm(url)}
              className="rounded-lg bg-[var(--admin-active-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--admin-active-text)] hover:opacity-80 transition-opacity"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function ToolbarButton({ onClick, isActive, title, children, buttonRef }: ToolbarButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onMouseDown={(e) => {
        // Prevent editor from losing focus when clicking toolbar buttons
        e.preventDefault();
        onClick();
      }}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      className={[
        'flex h-7 w-7 items-center justify-center rounded-md text-sm transition-colors',
        isActive
          ? 'bg-[var(--admin-active-bg)] text-[var(--admin-active-text)]'
          : 'text-[var(--admin-text-3)] hover:bg-[var(--admin-surface)] hover:text-[var(--admin-text-1)]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function ToolbarDivider() {
  return <div className="mx-0.5 h-5 w-px bg-[var(--admin-border)]" />;
}

// ─── RichTextEditor ───────────────────────────────────────────────────────────

export function RichTextEditor({ value, onChange, isDirty = false }: RichTextEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const linkButtonRef = useRef<HTMLButtonElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable heading levels we don't use
        heading: { levels: [2, 3] },
        // Disable block types we don't expose in toolbar
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Markdown,
    ],
    content: value,
    // Tell TipTap to treat the initial content as Markdown
    contentType: 'markdown',
    onUpdate({ editor }) {
      // Serialize content back to Markdown on every change
      const md = editor.getMarkdown();
      onChange(md);
    },
  });

  // Sync external value changes (e.g. when the parent resets the form)
  const prevValueRef = useRef(value);
  useEffect(() => {
    if (!editor || value === prevValueRef.current) return;
    prevValueRef.current = value;

    const currentMd = editor.getMarkdown();
    if (currentMd !== value) {
      // Update without triggering onUpdate; parse Markdown to TipTap JSON first
      const parsed = editor.markdown?.parse(value);
      editor.commands.setContent(parsed ?? value, { emitUpdate: false });
    }
  }, [value, editor]);

  // ── Border style ──────────────────────────────────────────────────────────
  const borderClass = isDirty
    ? 'border-amber-400 focus-within:border-amber-400 focus-within:ring-amber-400/30'
    : 'border-[var(--admin-input-bd)] focus-within:border-[var(--admin-accent)] focus-within:ring-[var(--admin-focus)]/20';

  // ── Link helpers ──────────────────────────────────────────────────────────
  const currentLinkUrl = editor?.getAttributes('link').href ?? '';

  function handleLinkConfirm(url: string) {
    if (!editor) return;
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: trimmed }).run();
    }
    setLinkDialogOpen(false);
  }

  function handleLinkRemove() {
    editor?.chain().focus().unsetLink().run();
    setLinkDialogOpen(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={[
        'w-full overflow-hidden rounded-xl border bg-[var(--admin-input-bg)] shadow-sm transition focus-within:ring-4',
        borderClass,
      ].join(' ')}
    >
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--admin-border)] px-2 py-1.5">
        {/* Heading */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor?.isActive('heading', { level: 2 })}
          title="Título H2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor?.isActive('heading', { level: 3 })}
          title="Título H3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Inline marks */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive('bold')}
          title="Negrito (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive('italic')}
          title="Itálico (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive('bulletList')}
          title="Lista com marcadores"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton
          buttonRef={linkButtonRef}
          onClick={() => setLinkDialogOpen((v) => !v)}
          isActive={editor?.isActive('link') || linkDialogOpen}
          title="Inserir / editar link"
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Clear formatting */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Limpar formatação"
        >
          <RemoveFormatting className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* ── Editor area ──────────────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        className="rich-text-editor min-h-32 px-3.5 py-3 text-sm text-[var(--admin-text-1)] outline-none"
      />

      {/* ── Link dialog (portal-like absolute positioning) ────────────────── */}
      {linkDialogOpen && (
        <LinkDialog
          anchorRef={linkButtonRef}
          initialUrl={currentLinkUrl}
          onConfirm={handleLinkConfirm}
          onRemove={handleLinkRemove}
          onClose={() => setLinkDialogOpen(false)}
        />
      )}
    </div>
  );
}
