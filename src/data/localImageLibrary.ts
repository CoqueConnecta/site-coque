export type LocalImageAsset = {
  id: string;
  url: string;
  name: string;
  title?: string;
  alt?: string;
  category: 'gallery' | 'brand' | 'background' | 'about' | 'placeholder';
};

export const localImageCategories = [
  { id: 'all', label: 'Todas' },
  { id: 'about', label: 'Quem Somos' },
  { id: 'gallery', label: 'Galeria' },
  { id: 'brand', label: 'Marca' },
  { id: 'background', label: 'Fundos' },
  { id: 'placeholder', label: 'Placeholder' },
] as const;

// Catálogo local esvaziado após migração para Firebase Storage (jun/2025).
// Todas as imagens agora vivem em RTDB media/library e Firebase Storage images/.
export const localImageLibrary: LocalImageAsset[] = [];
