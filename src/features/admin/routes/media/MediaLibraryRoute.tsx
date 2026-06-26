import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Trash2, Check, UploadCloud, Search } from 'lucide-react';
import type { MediaAsset } from '../../types';

type MediaLibraryRouteProps = {
  mediaAssets: MediaAsset[];
  mediaSearch: string;
  onMediaSearchChange: (value: string) => void;
  categories: readonly { id: string; label: string }[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  filteredAssets: MediaAsset[];
  isUploading: boolean;
  uploadProgress: number;
  onUpload: (file: File, category: string) => void;
  onDelete: (id: string, url: string) => Promise<void>;
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
}: MediaLibraryRouteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategory, setUploadCategory] = useState('gallery');
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);
  const [deleteConfirmAsset, setDeleteConfirmAsset] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const uploadCategories = categories.filter((c) => c.id !== 'all');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, uploadCategory);
      e.target.value = '';
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
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-[var(--admin-text-3)]">Categoria</span>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              disabled={isUploading}
              className="h-9 w-full rounded border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] px-2 text-sm text-[var(--admin-text-1)] outline-none focus:ring-1 focus:ring-[var(--admin-accent)] disabled:opacity-50"
            >
              {uploadCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 shadow-sm transition-all"
          >
            {isUploading ? 'Enviando...' : 'Selecionar Arquivo'}
          </button>

          {isUploading && (
            <div className="space-y-1 pt-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--admin-border)]">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-[var(--admin-text-3)] font-semibold">{uploadProgress}%</p>
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
    </div>
  );
}
