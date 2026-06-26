'use client';

import { useState } from 'react';
import TrackCard from './TrackCard';

export default function PlaylistDisplay({
  tracks,
  favorites,
  onToggleFavorite,
  onDeleteTrack,
  onReorderTracks,
  onRegenerate,
  onAppend,
  onSaveToSpotify,
  saving,
  loading
}) {
  const [playlistName, setPlaylistName] = useState('Mi Mezcla de Spotify');
  const [playlistDescription, setPlaylistDescription] = useState('Creada con Spotify Taste Mixer');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...tracks];
    const [removed] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, removed);
    onReorderTracks(reordered);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const handleSave = async () => {
    try {
      const playlist = await onSaveToSpotify(playlistName, playlistDescription);
      setSaveSuccess(playlist);
      setTimeout(() => {
        setShowSaveModal(false);
        setSaveSuccess(null);
      }, 3000);
    } catch (err) {
      // Error is handled by parent
    }
  };

  if (tracks.length === 0) {
    return (
      <div className="glass p-10 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px] space-y-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-400">Tu mezcla aparecerá aquí</h3>
          <p className="text-sm text-zinc-600 mt-1">
            Selecciona semillas y ajusta los filtros, luego haz clic en &quot;Generar Mezcla&quot;.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Tu Mezcla</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{tracks.length} canciones</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAppend}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 font-medium transition-all cursor-pointer disabled:opacity-50"
          >
            + Añadir más
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 font-medium transition-all cursor-pointer disabled:opacity-50"
          >
            ↻ Regenerar
          </button>
          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="text-xs px-4 py-1.5 rounded-lg bg-[#1db954] hover:bg-[#1ed760] text-black font-bold transition-all cursor-pointer shadow-lg shadow-[#1db954]/10"
          >
            Guardar en Spotify
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto max-h-[600px] p-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`transition-all ${dragIndex === index ? 'opacity-50' : ''}`}
          >
            <TrackCard
              track={track}
              index={index}
              onDelete={onDeleteTrack}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.some((f) => f.id === track.id)}
            />
          </div>
        ))}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass rounded-2xl p-6 w-full max-w-md mx-4 space-y-4 border border-zinc-700">
            {saveSuccess ? (
              <div className="text-center space-y-3">
                <div className="text-4xl">🎉</div>
                <h3 className="text-xl font-bold text-white">¡Playlist guardada!</h3>
                <p className="text-sm text-zinc-400">
                  &quot;{saveSuccess.name}&quot; se ha creado en tu cuenta de Spotify.
                </p>
                {saveSuccess.external_urls?.spotify && (
                  <a
                    href={saveSuccess.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm font-semibold text-[#1db954] hover:underline"
                  >
                    Abrir en Spotify →
                  </a>
                )}
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white">Guardar Playlist</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Nombre</label>
                    <input
                      type="text"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#1db954] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Descripción</label>
                    <input
                      type="text"
                      value={playlistDescription}
                      onChange={(e) => setPlaylistDescription(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#1db954] transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !playlistName.trim()}
                    className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-[#1db954] hover:bg-[#1ed760] text-black font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
