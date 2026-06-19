import { createPortal } from 'react-dom';
import { cn } from '../../../lib/cn';
import { CloseIcon } from '../../icons';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useEscapeKey } from '../../../hooks/useEscapeKey';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // Para controlar a largura máxima do modal
}

export const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  useScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  // Portal direto para document.body: um ancestor animado por FadeIn (translate-y-*)
  // cria um novo containing block para position:fixed, quebrando o overlay em tela cheia.
  return createPortal(
    // Overlay (Fundo escuro). O z-[100] garante que fique acima de tudo.
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose} // Clicar no fundo fecha o modal
    >
      {/* Botão de Fechar (X) no topo direito */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-[110] rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-6 sm:top-6"
        aria-label="Fechar"
      >
        <CloseIcon className="h-8 w-8" />
      </button>

      {/* Container do Conteúdo */}
      <div
        className={cn('relative w-full', className)}
        onClick={(e) => e.stopPropagation()} // Impede que o clique no vídeo feche o modal
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
