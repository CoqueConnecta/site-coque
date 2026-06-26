export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputFormat?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export interface OptimizationResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  originalFormatted: string;
  compressedFormatted: string;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function optimizeImage(
  file: File,
  options: OptimizeOptions = {}
): Promise<OptimizationResult> {
  // SVG Bypass: do not draw on canvas or convert, preserve vector graphics as-is
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    return Promise.resolve({
      file,
      originalSize: file.size,
      compressedSize: file.size,
      originalFormatted: formatBytes(file.size),
      compressedFormatted: formatBytes(file.size),
    });
  }

  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
  } = options;

  // Determine output format dynamically if not specified. Keep PNG as PNG, convert others to WebP.
  const outputFormat = options.outputFormat || (file.type === 'image/png' ? 'image/png' : 'image/webp');

  return new Promise((resolve, reject) => {
    // If not an image, reject immediately
    if (!file.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions keeping aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Não foi possível obter o contexto 2D do Canvas.'));
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Falha ao gerar o blob da imagem.'));
            }

            // Create a new file from blob
            // Preserve the original name but change extension if we convert format
            let newName = file.name;
            if (outputFormat === 'image/webp') {
              newName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            } else if (outputFormat === 'image/jpeg') {
              newName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            } else if (outputFormat === 'image/png') {
              newName = file.name.replace(/\.[^/.]+$/, '') + '.png';
            }

            const optimizedFile = new File([blob], newName, {
              type: outputFormat,
              lastModified: Date.now(),
            });

            resolve({
              file: optimizedFile,
              originalSize: file.size,
              compressedSize: optimizedFile.size,
              originalFormatted: formatBytes(file.size),
              compressedFormatted: formatBytes(optimizedFile.size),
            });
          },
          outputFormat,
          quality
        );
      };
      img.onerror = () => reject(new Error('Erro ao carregar a imagem.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}
