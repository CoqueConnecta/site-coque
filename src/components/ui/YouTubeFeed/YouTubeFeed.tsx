import { useState } from 'react';
import { Modal } from '../Modal';
import { Typography } from '../../ui/Typography';
import { Play } from 'lucide-react'; 

const mockVideos =[
  {
    id: 'rwniUxBd5OI', // ID do vídeo do YouTube (depois de ?v=)
    thumbnail: 'https://img.youtube.com/vi/rwniUxBd5OI/maxresdefault.jpg',
    title: 'Exemplo de vídeo 1'
  },
  {
    id: 'F5g_i93m-lU',
    thumbnail: 'https://img.youtube.com/vi/F5g_i93m-lU/maxresdefault.jpg',
    title: 'Exemplo de vídeo 2'
  }
];

export const YouTubeFeed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const openVideo = (videoId: string) => {
    setCurrentVideoId(videoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Pequeno delay para remover o ID e evitar que a tela preta pisque antes de sumir
    setTimeout(() => setCurrentVideoId(null), 300);
  };

  return (
    <>
      <Typography variant="h2" className="mb-8">Vídeos</Typography>

      {/* Grid de Thumbnails */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {mockVideos.map((video) => (
            <div 
              key={video.id} 
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-gray-200 aspect-video"
              onClick={() => openVideo(video.id)}
            >
              {/* Imagem de Capa do Youtube */}
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay com botão de Play (Fica visível no hover) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                <div className="rounded-full bg-red-600 p-4 text-white shadow-lg transition-transform group-hover:scale-110">
                  <Play fill="currentColor" size={24} />
                </div>
              </div>
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
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
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