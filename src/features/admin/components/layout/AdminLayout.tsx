import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layers, Sun, Moon } from 'lucide-react';
import type { User } from 'firebase/auth';
import { getCurrentUser, onAuthChange, reloadCurrentUser } from '../../../../services/authService';
import { ADMIN_ROUTES } from '../../config/adminRoutes';
import type { AdminRouteId } from '../../config/adminRoutes';
import { AdminUserMenu } from './AdminUserMenu';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

type AdminLayoutProps = {
  activeRouteId: AdminRouteId;
  onSelectRoute: (id: AdminRouteId) => void;
  routeDirtyCount: (id: AdminRouteId) => number;
  children: React.ReactNode;
  onLogout: () => void;
};

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--admin-surface-2)] text-[var(--admin-text-3)] hover:text-[var(--admin-text-1)] text-sm font-medium transition-all mb-1"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 flex-shrink-0" />
      ) : (
        <Moon className="w-4 h-4 flex-shrink-0" />
      )}
      <span>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</span>
    </button>
  );
}

function NavContent({
  activeRouteId,
  onSelectRoute,
  routeDirtyCount,
  user,
  isUserLoading,
  onLogout,
  onNavClick,
}: Omit<AdminLayoutProps, 'children'> & {
  user: User | null;
  isUserLoading: boolean;
  onNavClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[var(--admin-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--admin-text-1)] tracking-tight">Coque Connecta</h1>
            <p className="text-[10px] text-[var(--admin-text-4)] font-medium tracking-widest">Admin CMS</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {ADMIN_ROUTES.map((route) => {
          const Icon = route.icon;
          const isActive = activeRouteId === route.id;
          const dirty = routeDirtyCount(route.id);
          return (
            <button
              key={route.id}
              type="button"
              onClick={() => {
                onSelectRoute(route.id);
                onNavClick?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-[var(--admin-active-bg)] text-[var(--admin-active-text)] shadow-sm'
                  : 'text-[var(--admin-text-3)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text-1)]'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[var(--admin-accent)]' : 'text-[var(--admin-text-4)]'}`} />
              <span className="flex-1">{route.label}</span>
              {dirty > 0 && (
                <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                  isActive ? 'bg-[var(--admin-active-bg)] text-[var(--admin-active-text)]' : 'bg-orange-100 text-orange-700'
                }`}>
                  {dirty}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[var(--admin-border)]">
        <ThemeToggle />
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--admin-surface-2)] text-[var(--admin-text-3)] hover:text-[var(--admin-text-1)] text-sm font-medium transition-all mb-2"
        >
          <span className="text-base leading-none">🌐</span>
          Ver site público
        </Link>
        <AdminUserMenu user={user} isLoading={isUserLoading} onLogout={onLogout} />
      </div>
    </div>
  );
}

function AdminLayoutInner({
  activeRouteId,
  onSelectRoute,
  routeDirtyCount,
  children,
  onLogout,
}: AdminLayoutProps) {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setIsUserLoading(false);
        return;
      }

      await reloadCurrentUser(nextUser);

      setUser(getCurrentUser() ?? nextUser);
      setIsUserLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-[var(--admin-bg)] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed"
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[var(--admin-sidebar-bg)] border-r border-[var(--admin-border)] z-30">
        <NavContent
          activeRouteId={activeRouteId}
          onSelectRoute={onSelectRoute}
          routeDirtyCount={routeDirtyCount}
          user={user}
          isUserLoading={isUserLoading}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-[var(--admin-sidebar-bg)] z-50 shadow-xl border-r border-[var(--admin-border)]">
            <NavContent
              activeRouteId={activeRouteId}
              onSelectRoute={onSelectRoute}
              routeDirtyCount={routeDirtyCount}
              user={user}
              isUserLoading={isUserLoading}
              onLogout={onLogout}
              onNavClick={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile sticky header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[var(--admin-sidebar-bg)]/90 backdrop-blur-md border-b border-[var(--admin-border)]">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-1 rounded-xl hover:bg-[var(--admin-surface-2)] active:bg-[var(--admin-surface-2)] touch-manipulation"
            >
              <Menu className="w-6 h-6 text-[var(--admin-text-2)]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-[var(--admin-text-1)]">Admin CMS</span>
            </div>
            <div className="w-8" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminLayout(props: AdminLayoutProps) {
  return (
    <ThemeProvider>
      <AdminLayoutInner {...props} />
    </ThemeProvider>
  );
}
