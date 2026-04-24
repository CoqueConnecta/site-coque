import { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { ChevronUp, LogOut, User as UserIcon } from 'lucide-react';

type AdminUserMenuProps = {
  user: User | null;
  isLoading: boolean;
  onLogout: () => void;
};

function getDisplayName(user: User | null) {
  if (!user) {
    return 'Usuario';
  }

  const name = user.displayName?.trim();
  if (name) {
    return name;
  }

  const emailPrefix = user.email?.split('@')[0]?.trim();
  if (emailPrefix) {
    return emailPrefix;
  }

  return 'Usuario';
}

function getEmailLabel(user: User | null) {
  return user?.email?.trim() || 'Usuario autenticado';
}

function getPhotoUrl(user: User | null) {
  if (!user) {
    return '';
  }

  if (user.photoURL) {
    return user.photoURL;
  }

  const providerPhoto = user.providerData.find((provider) => provider?.photoURL)?.photoURL;
  return providerPhoto ?? '';
}

function getInitials(label: string) {
  const parts = label
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return 'U';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function AdminUserMenu({ user, isLoading, onLogout }: AdminUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImageFailed(false);
  }, [user?.photoURL]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('keydown', onEscape);

    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  const displayName = useMemo(() => getDisplayName(user), [user]);
  const emailLabel = useMemo(() => getEmailLabel(user), [user]);
  const photoUrl = useMemo(() => getPhotoUrl(user), [user]);
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const hasPhoto = Boolean(photoUrl) && !imageFailed;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-2.5 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-left transition hover:border-gray-200 hover:bg-gray-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Menu do usuario"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-600">
            {hasPhoto ? (
              <img
                src={photoUrl}
                alt={displayName}
                className="h-full w-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                {initials}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="truncate text-xs text-gray-500">{emailLabel}</p>
          </div>

          <ChevronUp className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg shadow-gray-200/70"
        >
          <button
            type="button"
            disabled
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-400"
          >
            <UserIcon className="h-4 w-4" />
            Minha conta (em breve)
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      ) : null}
    </div>
  );
}
