import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

type MediaAsset = {
  id: string;
  url: string;
  name: string;
  title?: string;
  alt?: string;
  category?: string;
};

type ImageCategory = {
  id: string;
  label: string;
};

type ImageLibraryModalProps = {
  isOpen: boolean;
  pickerLabel?: string;
  onClose: () => void;
  shouldApplyMetadata: boolean;
  onToggleShouldApplyMetadata: (value: boolean) => void;
  mediaAssetsCount: number;
  mediaSearch: string;
  onMediaSearchChange: (value: string) => void;
  categories: ImageCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  filteredAssets: MediaAsset[];
  onSelectAsset: (asset: MediaAsset) => void;
  isUploading: boolean;
  uploadProgress: number;
  onUpload: (file: File, category: string) => void;
  onCategoryCreate: (label: string) => Promise<string>;
};

export function ImageLibraryModal({
  isOpen,
  pickerLabel,
  onClose,
  shouldApplyMetadata,
  onToggleShouldApplyMetadata,
  mediaAssetsCount,
  mediaSearch,
  onMediaSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  filteredAssets,
  onSelectAsset,
  isUploading,
  uploadProgress,
  onUpload,
  onCategoryCreate,
}: ImageLibraryModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategory, setUploadCategory] = useState('gallery');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');

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

  if (!isOpen) return null;

  const uploadCategories = categories.filter((c) => c.id !== 'all');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, uploadCategory);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Biblioteca de Imagens</h3>
            <p className="text-sm text-gray-500">
              Selecione uma imagem para o campo {pickerLabel ?? 'selecionado'}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Fechar
          </button>
        </div>

        <div className="grid max-h-[78vh] grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-sm font-bold uppercase tracking-wide text-gray-600">Enviar nova imagem</h4>

            <div className="space-y-3 rounded border border-gray-200 bg-white p-3">
              {isCreatingCategory ? (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <span className="block text-xs font-medium text-gray-600">Nova Categoria</span>
                  <input
                    type="text"
                    value={newCategoryLabel}
                    onChange={(e) => setNewCategoryLabel(e.target.value)}
                    placeholder="Ex: Eventos"
                    className="h-9 w-full rounded border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveNewCategory}
                      className="flex-1 h-9 rounded bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingCategory(false);
                        setNewCategoryLabel('');
                        setUploadCategory('gallery');
                      }}
                      className="flex-1 h-9 rounded bg-gray-100 border border-gray-200 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-gray-600">Categoria</span>
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
                    className="h-9 w-full rounded border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {uploadCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                    <option value="NEW_CATEGORY">+ Criar nova categoria...</option>
                  </select>
                </label>
              )}

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
                className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploading ? 'Enviando...' : 'Selecionar arquivo'}
              </button>

              {isUploading && (
                <div className="space-y-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-xs text-gray-500">{uploadProgress}%</p>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 rounded border border-gray-200 bg-white p-3">
              <input
                type="checkbox"
                checked={shouldApplyMetadata}
                onChange={(e) => onToggleShouldApplyMetadata(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Ao selecionar imagem, preencher automaticamente título/alt quando o objeto do CMS tiver esses campos.
              </span>
            </label>

            <div className="rounded border border-gray-200 bg-white p-3 text-sm text-gray-700">
              <p className="font-medium text-gray-800">Itens disponíveis</p>
              <p>{mediaAssetsCount} imagens na biblioteca.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={mediaSearch}
                onChange={(e) => onMediaSearchChange(e.target.value)}
                className="h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar por nome, título ou alt"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
                  <div className="aspect-video w-full bg-gray-100">
                    <img src={asset.url} alt={asset.alt || asset.title || asset.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="line-clamp-1 text-sm font-semibold text-gray-800">{asset.title || asset.name}</p>
                    {asset.alt ? <p className="line-clamp-2 text-xs text-gray-600">Alt: {asset.alt}</p> : null}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-500">{asset.name}</p>
                      <span className="rounded bg-gray-100 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                        {asset.category ?? 'geral'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectAsset(asset)}
                      className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Usar nesta seção
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredAssets.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">
                Nenhuma imagem encontrada com os filtros atuais.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
