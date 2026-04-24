import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layers } from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../../../../firebase';
import { ADMIN_ROUTES } from '../../config/adminRoutes';
import type { AdminRouteId } from '../../config/adminRoutes';
import { AdminUserMenu } from './AdminUserMenu';

type AdminLayoutProps = {
  activeRouteId: AdminRouteId;
  onSelectRoute: (id: AdminRouteId) => void;
  routeDirtyCount: (id: AdminRouteId) => number;
  children: React.ReactNode;
  onLogout: () => void;
};

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
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Coque Connecta</h1>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Admin CMS</p>
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
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
              <span className="flex-1">{route.label}</span>
              {dirty > 0 && (
                <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                  isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {dirty}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 text-sm font-medium transition-all mb-2"
        >
          <span className="text-base leading-none">🌐</span>
          Ver site público
        </Link>
        <AdminUserMenu user={user} isLoading={isUserLoading} onLogout={onLogout} />
      </div>
    </div>
  );
}

export function AdminLayout({
  activeRouteId,
  onSelectRoute,
  routeDirtyCount,
  children,
  onLogout,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setIsUserLoading(false);
        return;
      }

      try {
        // Refresh cached profile data (displayName/photoURL) after OAuth updates.
        await nextUser.reload();
      } catch {
        // Ignore reload errors and keep the current session info.
      }

      setUser(auth.currentUser ?? nextUser);
      setIsUserLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 z-30">
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
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl">
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
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-1 rounded-xl hover:bg-gray-100 active:bg-gray-200 touch-manipulation"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">Admin CMS</span>
            </div>
            {/* placeholder right side — save button injected via children */}
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
