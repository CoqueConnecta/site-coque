import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon, Globe } from 'lucide-react';
import type { AdminOutletContext } from '../types';
import type { CmsBlogPost } from '../../../../types/cms';
import { fetchAdminPosts, saveBlogPost, deleteBlogPost } from '../../../../services/blogService';
import { RichTextEditor } from '../../components/shared/RichTextEditor';
import { ImageLibraryModal } from '../../components/layout/ImageLibraryModal';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function BlogRoute() {
  const adminContext = useOutletContext<AdminOutletContext>();

  // Posts state
  const [posts, setPosts] = useState<CmsBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View state: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form states
  const [titlePt, setTitlePt] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [excerptPt, setExcerptPt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [contentPt, setContentPt] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState('');
  const [slug, setSlug] = useState('');
  const [published, setPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState('');

  // Media picker local state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [shouldApplyMetadata, setShouldApplyMetadata] = useState(true);

  // Active form tab: 'pt' | 'en'
  const [formTab, setFormTab] = useState<'pt' | 'en'>('pt');

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminPosts();
      setPosts(data.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
    } catch (err) {
      toast.error('Erro ao carregar postagens.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Update slug automatically when titlePt changes (only when creating)
  useEffect(() => {
    if (viewMode === 'create') {
      setSlug(generateSlug(titlePt));
    }
  }, [titlePt, viewMode]);

  const handleStartCreate = () => {
    setTitlePt('');
    setTitleEn('');
    setExcerptPt('');
    setExcerptEn('');
    setContentPt('');
    setContentEn('');
    setCoverImage('');
    setAuthor('');
    setSlug('');
    setPublished(false);
    setPublishedAt(new Date().toISOString().substring(0, 10)); // Default to today (YYYY-MM-DD)
    setEditingPostId(null);
    setFormTab('pt');
    setViewMode('create');
  };

  const handleStartEdit = (post: CmsBlogPost) => {
    setEditingPostId(post.id);
    setTitlePt(post.title?.pt || '');
    setTitleEn(post.title?.en || '');
    setExcerptPt(post.excerpt?.pt || '');
    setExcerptEn(post.excerpt?.en || '');
    setContentPt(post.content?.pt || '');
    setContentEn(post.content?.en || '');
    setCoverImage(post.coverImage || '');
    setAuthor(post.author || '');
    setSlug(post.slug || '');
    setPublished(post.published || false);
    
    // Parse date for datetime-local input (YYYY-MM-DDThh:mm)
    const dateStr = post.publishedAt 
      ? new Date(post.publishedAt).toISOString().substring(0, 16)
      : new Date().toISOString().substring(0, 16);
    setPublishedAt(dateStr);
    
    setFormTab('pt');
    setViewMode('edit');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titlePt.trim()) {
      toast.error('O título em português é obrigatório.');
      return;
    }

    if (!slug.trim()) {
      toast.error('O slug é obrigatório.');
      return;
    }

    const formattedSlug = generateSlug(slug);

    // Validate unique slug (excluding the post currently being edited)
    const isSlugTaken = posts.some(p => p.slug === formattedSlug && p.id !== editingPostId);
    if (isSlugTaken) {
      toast.error('Este slug já está sendo usado por outro post.');
      return;
    }

    // Format ISO string for Firebase
    const isoPublishedAt = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();

    const postData: Omit<CmsBlogPost, 'id'> = {
      slug: formattedSlug,
      title: { pt: titlePt.trim(), en: titleEn.trim() },
      excerpt: { pt: excerptPt.trim(), en: excerptEn.trim() },
      content: { pt: contentPt, en: contentEn },
      coverImage: coverImage.trim(),
      author: author.trim(),
      published,
      publishedAt: isoPublishedAt,
    };

    const savePromise = saveBlogPost(editingPostId, postData);

    await toast.promise(savePromise, {
      loading: 'Salvando postagem...',
      success: 'Postagem salva com sucesso!',
      error: 'Erro ao salvar postagem.',
    });

    setViewMode('list');
    loadPosts();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente o post "${title}"?`)) {
      return;
    }

    try {
      await deleteBlogPost(id);
      toast.success('Postagem excluída.');
      loadPosts();
    } catch (err) {
      toast.error('Erro ao excluir postagem.');
      console.error(err);
    }
  };

  const handleSelectAsset = (asset: any) => {
    setCoverImage(asset.url);
    setIsMediaModalOpen(false);
    toast.success('Imagem de capa selecionada.');
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--admin-text-1)]">Gerenciamento do Blog</h2>
            <p className="text-sm text-[var(--admin-text-3)]">Crie, edite e gerencie as postagens exibidas no site.</p>
          </div>
          <button
            onClick={handleStartCreate}
            className="flex items-center justify-center gap-2 rounded-md bg-[var(--admin-accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Postagem
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12 text-[var(--admin-text-3)] text-sm">
            Carregando postagens...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] p-12 text-center text-sm text-[var(--admin-text-3)]">
            Nenhuma postagem encontrada. Comece criando uma nova!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-sm">
            <table className="w-full border-collapse text-left text-sm text-[var(--admin-text-2)]">
              <thead className="bg-[var(--admin-surface-2)] text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-3)] border-b border-[var(--admin-border)]">
                <tr>
                  <th className="px-6 py-4">Capa</th>
                  <th className="px-6 py-4">Título (PT)</th>
                  <th className="px-6 py-4">Autor</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border)]">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--admin-surface-2)]/50 transition-colors">
                    <td className="px-6 py-4">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt=""
                          className="h-10 w-16 rounded object-cover bg-gray-100 border border-[var(--admin-border)]"
                        />
                      ) : (
                        <div className="h-10 w-16 rounded bg-[var(--admin-surface-2)] border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-text-4)]">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[var(--admin-text-1)]">
                      {post.title?.pt || <span className="italic text-[var(--admin-text-4)]">Sem título</span>}
                      {post.title?.en && (
                        <span className="block text-xs font-normal text-[var(--admin-text-3)] mt-0.5">
                          EN: {post.title.en}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{post.author || '-'}</td>
                    <td className="px-6 py-4 text-xs tabular-nums">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.published
                            ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                            : 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400'
                        }`}
                      >
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(post)}
                          className="rounded p-1.5 text-[var(--admin-text-3)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text-1)] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title?.pt || '')}
                          className="rounded p-1.5 text-[var(--admin-danger-text)] hover:bg-[var(--admin-danger-bg)] transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Editor Mode (Create / Edit)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setViewMode('list')}
          className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-2 text-[var(--admin-text-2)] hover:bg-[var(--admin-surface-2)] shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-[var(--admin-text-1)]">
            {viewMode === 'create' ? 'Nova Postagem' : 'Editar Postagem'}
          </h2>
          <p className="text-sm text-[var(--admin-text-3)]">
            Preencha os campos abaixo. Lembre-se de preencher em português e inglês.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Localization Tabs & Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm space-y-6">
            {/* Tabs Headers */}
            <div className="flex border-b border-[var(--admin-border)]">
              <button
                type="button"
                onClick={() => setFormTab('pt')}
                className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                  formTab === 'pt'
                    ? 'border-[var(--admin-accent)] text-[var(--admin-accent)]'
                    : 'border-transparent text-[var(--admin-text-3)] hover:text-[var(--admin-text-1)]'
                }`}
              >
                🇧🇷 Português
              </button>
              <button
                type="button"
                onClick={() => setFormTab('en')}
                className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                  formTab === 'en'
                    ? 'border-[var(--admin-accent)] text-[var(--admin-accent)]'
                    : 'border-transparent text-[var(--admin-text-3)] hover:text-[var(--admin-text-1)]'
                }`}
              >
                🇺🇸 English
              </button>
            </div>

            {/* Tab content PT */}
            {formTab === 'pt' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-[var(--admin-text-2)] mb-1">
                    Título (PT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={titlePt}
                    onChange={(e) => setTitlePt(e.target.value)}
                    placeholder="Título da postagem..."
                    className="h-10 w-full rounded-md border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-3 text-sm text-[var(--admin-text-1)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus)]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--admin-text-2)] mb-1">
                    Resumo / Excerpt (PT)
                  </label>
                  <textarea
                    value={excerptPt}
                    onChange={(e) => setExcerptPt(e.target.value)}
                    placeholder="Uma descrição curta que aparece na listagem..."
                    rows={3}
                    className="w-full rounded-md border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] p-3 text-sm text-[var(--admin-text-1)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus)]/20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--admin-text-2)] mb-1">
                    Conteúdo (PT)
                  </label>
                  <RichTextEditor
                    value={contentPt}
                    onChange={setContentPt}
                    ariaLabel="Conteúdo da postagem em Português"
                  />
                </div>
              </div>
            )}

            {/* Tab content EN */}
            {formTab === 'en' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-[var(--admin-text-2)] mb-1">
                    Título (EN)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Title in English..."
                    className="h-10 w-full rounded-md border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-3 text-sm text-[var(--admin-text-1)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus)]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--admin-text-2)] mb-1">
                    Resumo / Excerpt (EN)
                  </label>
                  <textarea
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    placeholder="Short description for the English list..."
                    rows={3}
                    className="w-full rounded-md border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] p-3 text-sm text-[var(--admin-text-1)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus)]/20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--admin-text-2)] mb-1">
                    Conteúdo (EN)
                  </label>
                  <RichTextEditor
                    value={contentEn}
                    onChange={setContentEn}
                    ariaLabel="Conteúdo da postagem em Inglês"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Settings & Metadata */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--admin-text-3)]">
              Configurações do Post
            </h3>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text-2)] mb-1">Autor</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Equipe Coque Connecta"
                className="h-9 w-full rounded-md border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-3 text-sm text-[var(--admin-text-1)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus)]/20"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text-2)] mb-1">
                Slug (URL do Post)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex-post-url"
                className="h-9 w-full rounded-md border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-3 text-sm text-[var(--admin-text-1)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus)]/20 text-xs font-mono"
              />
            </div>

            {/* Publication Date */}
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text-2)] mb-1">
                Data de Publicação
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="h-9 w-full rounded-md border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-3 text-sm text-[var(--admin-text-1)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-focus)]/20 text-xs"
              />
            </div>

            {/* Published Switch */}
            <label className="flex items-center gap-3 cursor-pointer py-1 select-none">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-gray-300 text-[var(--admin-accent)] focus:ring-[var(--admin-accent)]/20"
              />
              <div>
                <span className="block text-sm font-semibold text-[var(--admin-text-1)]">Publicar postagem</span>
                <span className="block text-xs text-[var(--admin-text-3)]">
                  Ficará visível no site imediatamente.
                </span>
              </div>
            </label>
          </div>

          {/* Cover Image Card */}
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--admin-text-3)]">
              Imagem de Capa
            </h3>

            {coverImage ? (
              <div className="space-y-3">
                <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 border border-[var(--admin-border)]">
                  <img src={coverImage} alt="Cover Preview" className="h-full w-full object-cover" />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="flex-1 text-center rounded border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--admin-text-2)] hover:opacity-80 transition-all cursor-pointer"
                  >
                    Alterar capa
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="rounded bg-red-50 border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="flex flex-col items-center justify-center gap-2 aspect-video w-full rounded-md border-2 border-dashed border-[var(--admin-border)] bg-[var(--admin-surface-2)]/50 hover:bg-[var(--admin-surface-2)] text-[var(--admin-text-3)] hover:text-[var(--admin-text-1)] transition-all cursor-pointer"
              >
                <Globe className="w-8 h-8 opacity-40" />
                <span className="text-xs font-medium">Selecionar imagem de capa</span>
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="flex-1 rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--admin-text-2)] hover:bg-[var(--admin-surface-2)] shadow-sm transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-[var(--admin-accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 shadow-sm transition-all cursor-pointer"
            >
              Salvar Postagem
            </button>
          </div>
        </div>
      </form>

      {/* Reusing Admin Media Modal */}
      <ImageLibraryModal
        isOpen={isMediaModalOpen}
        pickerLabel="Imagem de Capa do Blog"
        onClose={() => setIsMediaModalOpen(false)}
        shouldApplyMetadata={shouldApplyMetadata}
        onToggleShouldApplyMetadata={setShouldApplyMetadata}
        mediaAssetsCount={adminContext.mediaAssets.length}
        mediaSearch={adminContext.mediaSearch}
        onMediaSearchChange={adminContext.onMediaSearchChange}
        categories={adminContext.categories}
        selectedCategory={adminContext.selectedCategory}
        onSelectCategory={adminContext.onSelectCategory}
        filteredAssets={adminContext.filteredAssets}
        onSelectAsset={handleSelectAsset}
        isUploading={adminContext.isUploading}
        uploadProgress={adminContext.uploadProgress}
        onUpload={adminContext.onUpload}
        onCategoryCreate={adminContext.onCategoryCreate}
        onUpdateMetadata={adminContext.onUpdateMetadata}
      />
    </div>
  );
}
