import { useState } from 'react';
import { Modal } from '../Modal';
import { Typography } from '../../ui/Typography';
import { Play } from 'lucide-react';
import { useDelayedState } from '../../../hooks/useDelayedState';
import { cn } from '../../../lib/cn';
import type { ResolvedYoutubeVideo } from '../../../types/cms';

const mockVideos: ResolvedYoutubeVideo[] = [
  { id: 'rwniUxBd5OI', title: 'Exemplo de vídeo 1' },
  { id: 'F5g_i93m-lU', title: 'Exemplo de vídeo 2' },
];

interface YouTubeFeedProps {
  videos?: ResolvedYoutubeVideo[];
  showTitle?: boolean;
}

export const YouTubeFeed = ({ videos, showTitle = true }: YouTubeFeedProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoIdNow, setCurrentVideoIdDelayed] = useDelayedState<string | null>(null);
  const visibleVideos = videos && videos.length > 0 ? videos : mockVideos;

  const openVideo = (videoId: string) => {
    setCurrentVideoIdNow(videoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Pequeno delay para remover o ID e evitar que a tela preta pisque antes de sumir
    setCurrentVideoIdDelayed(null, 300);
  };

  return (
    <>
      {showTitle && <Typography variant="h2" className="mb-8">Vídeos</Typography>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleVideos.map((video, index) => (
          <div
            key={video.id}
            className={cn(
              'group cursor-pointer',
              // Centraliza o último item quando a contagem é ímpar no layout 2-col (sm)
              visibleVideos.length % 2 !== 0 &&
                index === visibleVideos.length - 1 &&
                'sm:col-span-2 sm:max-w-[calc(50%-12px)] sm:mx-auto lg:col-span-1 lg:max-w-full'
            )}
            onClick={() => openVideo(video.id)}
          >
            <div className="relative overflow-hidden rounded-[var(--radius-sm)] bg-gray-200 aspect-video">
              <img
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                <div className="rounded-[var(--radius-pill)] bg-[color:var(--color-surface-orange)] p-4 text-[color:var(--color-tag-bg)] shadow-lg transition-transform group-hover:scale-110">
                  <Play fill="currentColor" size={24} />
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-[color:var(--color-text-primary)] line-clamp-2">
              {video.title}
            </p>
          </div>
        ))}
      </div>

      {/* O Nosso Modal Reutilizável */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        className="max-w-5xl"
      >
        {/* Usamos 'aspect-video' do Tailwind para manter a proporção 16:9 perfeita em qualquer tamanho de tela */}
        <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-sm)] bg-black shadow-2xl">
          {currentVideoId && (
            <iframe
              className="h-full w-full border-0"
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </Modal>
    </>
  );
};