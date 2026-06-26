import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Trash2, Check, UploadCloud, Search, Pencil } from 'lucide-react';
import type { MediaAsset } from '../../types';
import { optimizeImage, formatBytes } from '../../../../utils/imageOptimizer';

type MediaLibraryRouteProps = {
  mediaAssets: MediaAsset[];
  mediaSearch: string;
  onMediaSearchChange: (value: string) => void;
  categories: { id: string; label: string }[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  filteredAssets: MediaAsset[];
  isUploading: boolean;
  uploadProgress: number;
  onUpload: (file: File, category: string, title?: string, alt?: string) => Promise<void>;
  onDelete: (id: string, url: string) => Promise<void>;
  onCategoryCreate: (label: string) => Promise<string>;
  onUpdateMetadata: (id: string, title: string, alt: string, category?: string) => Promise<void>;
};

export function MediaLibraryRoute({
  mediaAssets,
  mediaSearch,
  onMediaSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  filteredAssets,
  isUploading,
  uploadProgress,
  onUpload,
  onDelete,
  onCategoryCreate,
  onUpdateMetadata,
}: MediaLibraryRouteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);
  const [deleteConfirmAsset, setDeleteConfirmAsset] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<{
    originalSize: string;
    compressedSize: string;
  } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'optimizing' | 'uploading' | 'success' | 'error'>('idle');

  const [imageTitle, setImageTitle] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const uploadCategories = categories.filter((c) => c.id !== 'all');

  const handleSaveNewCategory = async () => {
    const label = newCategoryLabel.trim();
    if (!label) {
      toast.error('O nome da categoria não pode ser vazio.');
      return;
    }
    try {
      const createdId = await onCategoryCreate(label);
      setUploadCategory(createdId);
      setIsCreatingCategory(false);
      setNewCategoryLabel('');
      toast.success(`Categoria "${label}" criada com sucesso!`);
    } catch (err) {
      toast.error('Erro ao criar categoria.');
      console.error(err);
    }
  };

  const handleStartEdit = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setEditTitle(asset.title || '');
    setEditAlt(asset.alt || '');
    setEditCategory(asset.category || '');
  };

  const handleSaveEdit = async () => {
    if (!editingAsset) return;
    setIsSavingEdit(true);
    try {
      await onUpdateMetadata(editingAsset.id, editTitle.trim(), editAlt.trim(), editCategory);
      toast.success('Imagem atualizada com sucesso!');
      setEditingAsset(null);
    } catch (err) {
      toast.error('Erro ao atualizar metadados.');
      console.error(err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageTitle(file.name.replace(/\.[^/.]+$/, ''));
      setImageAlt('');
      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setUploadStatus('idle');
      setOptimizationResult(null);
      e.target.value = '';
    }
  };

  const handleOptimizeAndSave = async () => {
    if (!selectedFile) return;

    setUploadStatus('optimizing');
    try {
      const result = await optimizeImage(selectedFile);
      setUploadStatus('uploading');
      setOptimizationResult({
        originalSize: result.originalFormatted,
        compressedSize: result.compressedFormatted,
      });

      await onUpload(result.file, uploadCategory, imageTitle.trim(), imageAlt.trim());

      setUploadStatus('success');
      setSelectedFile(null);
      setUploadCategory('');
      setImageTitle('');
      setImageAlt('');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      setTimeout(() => {
        setUploadStatus('idle');
        setOptimizationResult(null);
      }, 5000);
    } catch (err) {
      setUploadStatus('error');
      toast.error('Erro ao otimizar ou enviar imagem.');
      console.error(err);
    }
  };

  const handleCopyLink = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedAssetId(asset.id);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopiedAssetId(null), 2000);
    } catch (err) {
      toast.error('Erro ao copiar o link.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmAsset) return;
    setIsDeleting(true);
    const deletePromise = onDelete(deleteConfirmAsset.id, deleteConfirmAsset.url);

    toast.promise(deletePromise, {
      loading: 'Excluindo imagem...',
      success: 'Imagem excluída com sucesso!',
      error: 'Erro ao excluir imagem do Firebase.',
    });

    try {
      await deletePromise;
      setDeleteConfirmAsset(null);
    } catch (err) {
      console.error('[MediaLibraryRoute] Error deleting asset:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      {/* Upload Sidebar */}
      <div className="space-y-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-sm h-fit">
        <h4 className="text-sm font-bold uppercase tracking-wide text-[var(--admin-text-3)] flex items-center gap-2">
          <UploadCloud className="h-4 w-4 text-[var(--admin-accent)]" /> Enviar Nova Imagem
        </h4>

        <div className="space-y-3 rounded-md border border-[var(--admin-border-sub)] bg-[var(--admin-bg)] p-3">
          {isCreatingCategory ? (
            <div className="space-y-2 pt-1 animate-fade-in">
              <span className="block text-xs font-semibold text-[var(--admin-text-3)]">Nova Categoria</span>
              <input
                type="text"
                value={newCategoryLabel}
                onChange={(e) => setNewCategoryLabel(e.target.value)}
                placeholder="Ex: Eventos"
                className="h-9 w-full rounded border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-2 text-sm text-[var(--admin-text-1)] outline-none focus:ring-1 focus:ring-[var(--admin-accent)]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveNewCategory}
                  className="flex-1 h-9 rounded bg-[var(--admin-accent)] px-3 text-xs font-semibold text-white hover:opacity-90 shadow-sm transition-all"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingCategory(false);
                    setNewCategoryLabel('');
                    setUploadCategory('');
                  }}
                  className="flex-1 h-9 rounded bg-[var(--admin-surface-2)] border border-[var(--admin-border)] px-3 text-xs font-semibold text-[var(--admin-text-2)] hover:bg-[var(--admin-border-sub)] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-[var(--admin-text-3)]">Categoria</span>
              <select
                value={uploadCategory}
                onChange={(e) => {
                  if (e.target.value === 'NEW_CATEGORY') {
                    setIsCreatingCategory(true);
                  } else {
                    setUploadCategory(e.target.value);
                  }
                }}
                disabled={isUploading}
                className="h-9 w-full rounded border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-2 text-sm text-[var(--admin-text-1)] outline-none focus:ring-1 focus:ring-[var(--admin-accent)] disabled:opacity-50"
              >
                <option value="" disabled>Selecione uma categoria...</option>
                {uploadCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
                <option value="NEW_CATEGORY">+ Criar nova categoria...</option>
              </select>
            </label>
          )}

          {selectedFile && (
            <div className="space-y-3 rounded border border-[var(--admin-border-sub)] bg-[var(--admin-surface-2)] p-2.5">
              {previewUrl && (
                <div className="aspect-video w-full rounded overflow-hidden bg-[var(--admin-bg)] border border-[var(--admin-border)]">
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="text-xs space-y-1">
                <p className="font-semibold truncate text-[var(--admin-text-2)]" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-[var(--admin-text-4)]">
                  Tamanho: <span className="font-semibold text-[var(--admin-text-3)]">{formatBytes(selectedFile.size)}</span>
                </p>
              </div>

              <div className="space-y-2 border-t border-[var(--admin-border-sub)] pt-2">
                <label className="block">
                  <span className="mb-0.5 block text-[10px] font-semibold text-[var(--admin-text-3)]">Título da Imagem</span>
                  <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    placeholder="Ex: Crianças na horta"
                    disabled={uploadStatus === 'optimizing' || uploadStatus === 'uploading'}
                    className="h-8 w-full rounded border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-2 text-xs text-[var(--admin-text-1)] outline-none focus:ring-1 focus:ring-[var(--admin-accent)] disabled:opacity-50"
                  />
                </label>
                <label className="block">
                  <span className="mb-0.5 block text-[10px] font-semibold text-[var(--admin-text-3)]">Texto Alternativo (Alt)</span>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Descrição para leitores de tela..."
                    disabled={uploadStatus === 'optimizing' || uploadStatus === 'uploading'}
                    className="h-8 w-full rounded border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-2 text-xs text-[var(--admin-text-1)] outline-none focus:ring-1 focus:ring-[var(--admin-accent)] disabled:opacity-50"
                  />
                </label>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!uploadCategory || uploadStatus === 'optimizing' || uploadStatus === 'uploading'}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 rounded border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2 text-xs font-semibold text-[var(--admin-text-2)] hover:bg-[var(--admin-border-sub)] transition-all disabled:opacity-50"
            >
              {selectedFile ? 'Mudar Imagem' : 'Selecionar Arquivo'}
            </button>
            {selectedFile && (
              <button
                type="button"
                disabled={uploadStatus === 'optimizing' || uploadStatus === 'uploading'}
                onClick={() => {
                  setSelectedFile(null);
                  setImageTitle('');
                  setImageAlt('');
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }
                  setUploadStatus('idle');
                }}
                className="rounded bg-rose-50 border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-all disabled:opacity-50"
              >
                Remover
              </button>
            )}
          </div>

          {selectedFile && (
            <button
              type="button"
              disabled={uploadStatus === 'optimizing' || uploadStatus === 'uploading'}
              onClick={handleOptimizeAndSave}
              className="w-full rounded bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 shadow-sm transition-all"
            >
              {uploadStatus === 'optimizing' && 'Otimizando...'}
              {uploadStatus === 'uploading' && 'Enviando...'}
              {uploadStatus === 'idle' && 'Otimizar e Salvar Imagem'}
            </button>
          )}

          {uploadStatus === 'optimizing' && (
            <p className="text-center text-xs text-[var(--admin-text-3)] font-semibold animate-pulse">
              ⚙️ Otimizando imagem...
            </p>
          )}

          {uploadStatus === 'uploading' && (
            <div className="space-y-1 pt-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--admin-border)]">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-[var(--admin-text-3)] font-semibold">Enviando: {uploadProgress}%</p>
            </div>
          )}

          {uploadStatus === 'success' && optimizationResult && (
            <div className="rounded border border-green-200 bg-green-50 p-2.5 text-xs text-green-800 space-y-1">
              <p className="font-bold">✓ Upload efetuado com sucesso!</p>
              <p className="text-[10px]">
                Otimizada de <span className="font-bold">{optimizationResult.originalSize}</span> para{' '}
                <span className="font-bold">{optimizationResult.compressedSize}</span>.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-md border border-[var(--admin-border-sub)] bg-[var(--admin-bg)] p-3 text-xs text-[var(--admin-text-3)] space-y-1">
          <p className="font-semibold text-[var(--admin-text-2)]">Métricas</p>
          <p>{mediaAssets.length} imagens no total.</p>
        </div>
      </div>

      {/* Main Area */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-[var(--admin-text-4)] pointer-events-none" />
          <input
            type="text"
            value={mediaSearch}
            onChange={(e) => onMediaSearchChange(e.target.value)}
            className="h-11 w-full rounded-md border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] pl-10 pr-4 text-sm text-[var(--admin-text-1)] outline-none focus:ring-2 focus:ring-[var(--admin-accent)] shadow-sm"
            placeholder="Buscar por nome, título ou tag..."
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[var(--admin-accent)] text-white shadow-sm'
                    : 'bg-[var(--admin-surface-2)] text-[var(--admin-text-2)] hover:bg-[var(--admin-border-sub)]'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-sm flex flex-col">
              <div className="aspect-video w-full bg-[var(--admin-bg)] relative group overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.alt || asset.title || asset.name}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {asset.category ?? 'geral'}
                </span>
              </div>
              <div className="p-3 flex flex-col flex-1 gap-3 justify-between">
                <div className="space-y-1">
                  <p className="line-clamp-1 text-sm font-bold text-[var(--admin-text-1)]" title={asset.title || asset.name}>
                    {asset.title || asset.name}
                  </p>
                  <p className="text-[10px] text-[var(--admin-text-4)] truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  {asset.alt ? (
                    <p className="line-clamp-2 text-xs text-[var(--admin-text-3)]">
                      <span className="font-semibold">Alt:</span> {asset.alt}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(asset)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded bg-[var(--admin-surface-2)] text-xs font-bold text-[var(--admin-text-2)] hover:bg-[var(--admin-border-sub)] transition-colors border border-[var(--admin-border)]"
                  >
                    {copiedAssetId === asset.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copiar Link
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(asset)}
                    className="flex items-center justify-center h-9 w-9 rounded bg-[var(--admin-surface-2)] border border-[var(--admin-border)] text-[var(--admin-text-2)] hover:bg-[var(--admin-border-sub)] transition-colors"
                    title="Editar metadados"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmAsset(asset)}
                    className="flex items-center justify-center h-9 w-9 rounded bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Excluir imagem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAssets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-12 text-center text-sm text-[var(--admin-text-3)] font-semibold">
            Nenhuma imagem encontrada com os filtros atuais.
          </div>
        ) : null}
      </div>

      {/* Confirmation Modal */}
      {deleteConfirmAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-[var(--admin-surface)] shadow-2xl border border-[var(--admin-border)] p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-rose-600">Excluir imagem permanentemente?</h3>
              <p className="text-sm text-[var(--admin-text-3)] mt-1.5">
                Você tem certeza que deseja excluir a imagem <span className="font-semibold text-[var(--admin-text-2)]">"{deleteConfirmAsset.title || deleteConfirmAsset.name}"</span>?
              </p>
              <div className="mt-3 rounded border border-amber-100 bg-amber-50/50 p-3 text-xs text-amber-800">
                ⚠️ <span className="font-bold">Aviso:</span> Se esta imagem estiver sendo usada em alguma seção do site (Hero, Carrossel, Projetos, etc.), a exibição nela ficará quebrada. Essa operação não pode ser desfeita.
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmAsset(null)}
                className="h-9 px-4 rounded-md border border-[var(--admin-border-sub)] bg-[var(--admin-surface)] text-sm font-semibold text-[var(--admin-text-2)] hover:bg-[var(--admin-surface-2)] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="h-9 px-4 rounded-md bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editing Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-[var(--admin-surface)] shadow-2xl border border-[var(--admin-border)] p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--admin-text-1)]">Editar Detalhes da Imagem</h3>
              <p className="text-xs text-[var(--admin-text-4)] mt-1.5 truncate">
                {editingAsset.name}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[var(--admin-text-3)]">Título</span>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-9 w-full rounded border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-2 text-sm text-[var(--admin-text-1)] outline-none focus:ring-1 focus:ring-[var(--admin-accent)]"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[var(--admin-text-3)]">Categoria</span>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="h-9 w-full rounded border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-2 text-sm text-[var(--admin-text-1)] outline-none focus:ring-1 focus:ring-[var(--admin-accent)]"
                >
                  {uploadCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[var(--admin-text-3)]">Texto Alternativo (Alt)</span>
                <textarea
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  className="w-full rounded border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] p-2 text-sm text-[var(--admin-text-1)] outline-none focus:ring-1 focus:ring-[var(--admin-accent)] h-20 resize-none"
                  placeholder="Descreva a imagem para acessibilidade..."
                />
              </label>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={() => setEditingAsset(null)}
                className="h-9 px-4 rounded-md border border-[var(--admin-border-sub)] bg-[var(--admin-surface)] text-sm font-semibold text-[var(--admin-text-2)] hover:bg-[var(--admin-surface-2)] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={handleSaveEdit}
                className="h-9 px-4 rounded-md bg-[var(--admin-accent)] text-sm font-semibold text-white hover:opacity-90 shadow-sm transition-colors disabled:opacity-50"
              >
                {isSavingEdit ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
