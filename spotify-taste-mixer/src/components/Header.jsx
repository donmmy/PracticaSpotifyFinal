'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function Header({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="w-full border-b border-zinc-800/60 bg-[#040405]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg className="w-6 h-6 text-[#1db954] fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.982-.336.076-.67-.135-.747-.472-.077-.336.136-.67.472-.747 3.856-.88 7.15-.509 9.822 1.13.295.18.387.563.207.86zm1.226-2.722c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.67-1.114 8.243-.574 11.346 1.33.367.227.487.708.26 1.084zm.106-2.833C14.392 8.76 8.587 8.567 5.222 9.588c-.516.156-1.054-.137-1.21-.653-.156-.516.137-1.054.653-1.21 3.864-1.173 10.28-.952 14.34 1.458.464.275.615.875.34 1.339-.275.464-.875.615-1.34.34z"/>
          </svg>
          <span className="text-sm font-bold text-white tracking-tight">Taste Mixer</span>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2.5">
              {user.images?.[0]?.url ? (
                <img
                  src={user.images[0].url}
                  alt={user.display_name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                  {user.display_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <span className="text-sm font-medium text-zinc-300 hidden sm:inline">
                {user.display_name}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-zinc-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-red-500/30 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
