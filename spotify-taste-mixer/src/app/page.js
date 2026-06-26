'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSpotifyAuthUrl, isAuthenticated } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogin = () => {
    const authUrl = getSpotifyAuthUrl();
    window.location.href = authUrl;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#040405]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954]"></div>
        <p className="mt-4 text-zinc-400 font-medium animate-pulse">Comprobando sesión...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Mesh */}
      <div className="bg-mesh" />

      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1db954]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1db954]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="z-10 w-full max-w-4xl flex flex-col items-center text-center space-y-12 py-16">
        
        {/* Branding & Headline */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#1db954] mb-2 animate-pulse-soft">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.982-.336.076-.67-.135-.747-.472-.077-.336.136-.67.472-.747 3.856-.88 7.15-.509 9.822 1.13.295.18.387.563.207.86zm1.226-2.722c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.67-1.114 8.243-.574 11.346 1.33.367.227.487.708.26 1.084zm.106-2.833C14.392 8.76 8.587 8.567 5.222 9.588c-.516.156-1.054-.137-1.21-.653-.156-.516.137-1.054.653-1.21 3.864-1.173 10.28-.952 14.34 1.458.464.275.615.875.34 1.339-.275.464-.875.615-1.34.34z"/>
            </svg>
            Spotify Taste Mixer v1.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-[1.1] pb-2">
            Mezcla tu música a <span className="text-[#1db954] hover:text-[#1ed760] transition-colors duration-300">tu manera</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-xl mx-auto">
            Combina tus artistas favoritos, géneros, décadas y estados de ánimo para crear la playlist perfecta y guardarla directamente en tu cuenta.
          </p>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl pt-4">
          <div className="glass glass-hover p-6 rounded-2xl text-left flex flex-col space-y-3">
            <div className="p-3 w-fit rounded-lg bg-zinc-900 border border-zinc-800 text-[#1db954]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Semillas de Artistas</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Elige entre tus artistas más escuchados o busca otros nuevos para guiar las recomendaciones.
            </p>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl text-left flex flex-col space-y-3">
            <div className="p-3 w-fit rounded-lg bg-zinc-900 border border-zinc-800 text-[#1db954]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Filtro de Mood y Décadas</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Ajusta la energía, felicidad y acústica, o filtra canciones de épocas específicas como los 80s o 95-05.
            </p>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl text-left flex flex-col space-y-3">
            <div className="p-3 w-fit rounded-lg bg-zinc-900 border border-zinc-800 text-[#1db954]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Curación Interactiva</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Reordena canciones con arrastrar y soltar, añade canciones, borra las que no te gusten y guarda todo en Spotify.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-8">
          <button
            onClick={handleLogin}
            className="group relative inline-flex items-center justify-center gap-3 bg-[#1db954] hover:bg-[#1ed760] text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(29,185,84,0.3)] hover:shadow-[0_0_40px_rgba(29,185,84,0.6)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            Conectar con Spotify
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <p className="text-xs text-zinc-500 mt-4">
            Requiere una cuenta de Spotify. No guardamos tus contraseñas ni tus datos personales.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-xs text-zinc-600 w-full">
        Desarrollado con Next.js y Spotify Web API &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
