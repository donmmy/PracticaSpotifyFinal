'use client';

import { useState, useEffect, useRef } from 'react';
import { searchTracks } from '@/lib/spotify';

export default function TrackWidget({
  selectedTracks = [],
  onSelectTrack,
  onRemoveTrack,
  userTopTracks = [],
  totalSeedsCount
}) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchTracks(query.trim(), 5);
        if (data.tracks && data.tracks.items) {
          setSearchResults(data.tracks.items);
        }
      } catch (err) {
        console.error('Error searching tracks:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (track) => {
    const isSelected = selectedTracks.some((t) => t.id === track.id);
    if (isSelected) {
      onRemoveTrack(track.id);
    } else {
      if (totalSeedsCount >= 5) {
        alert('Límite de 5 semillas en total alcanzado (artistas + canciones + géneros).');
        return;
      }
      onSelectTrack({
        id: track.id,
        name: track.name,
        artists: track.artists?.map(a => a.name).join(', ') || '',
        image: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || ''
      });
    }
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="glass p-6 rounded-2xl flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
          <h2 className="text-lg font-bold text-white">Canciones Semilla</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
          {selectedTracks.length} seleccionadas
        </span>
      </div>

      {/* Selected Tracks List */}
      {selectedTracks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-white group animate-fade-in"
            >
              {track.image ? (
                <img src={track.image} alt={track.name} className="w-5 h-5 rounded-md object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center text-[10px]">🎵</div>
              )}
              <div className="flex flex-col text-left leading-none max-w-[150px]">
                <span className="font-semibold text-xs truncate">{track.name}</span>
                <span className="text-[10px] text-zinc-400 truncate">{track.artists}</span>
              </div>
              <button
                onClick={() => onRemoveTrack(track.id)}
                className="text-zinc-500 hover:text-red-400 ml-1 font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar canción en Spotify..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
          />
          {loading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1db954]"></div>
            </div>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && searchResults.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
            {searchResults.map((track) => {
              const isSelected = selectedTracks.some((t) => t.id === track.id);
              const trackCover = track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || '';
              const artistsNames = track.artists?.map(a => a.name).join(', ') || '';
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelect(track)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-800 text-left border-b border-zinc-800/40 last:border-0 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {trackCover ? (
                      <img src={trackCover} alt={track.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 flex-shrink-0">🎵</div>
                    )}
                    <div className="min-w-0 leading-tight">
                      <span className="block text-sm font-semibold text-white truncate">{track.name}</span>
                      <span className="block text-xs text-zinc-400 truncate">{artistsNames}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold text-[#1db954] flex-shrink-0 ml-2">Seleccionada</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* User's Top Tracks Quick Select */}
      {userTopTracks && userTopTracks.length > 0 && (
        <div className="flex flex-col space-y-2 pt-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Sugeridas de tus favoritas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {userTopTracks.slice(0, 5).map((track) => {
              const isSelected = selectedTracks.some((t) => t.id === track.id);
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelect(track)}
                  disabled={isSelected && selectedTracks.length >= 5}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1db954]/10 border-[#1db954] text-[#1db954]'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  {track.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
