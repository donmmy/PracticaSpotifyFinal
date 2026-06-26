'use client';

import { useState, useEffect, useRef } from 'react';
import { searchArtists } from '@/lib/spotify';

export default function ArtistWidget({
  selectedArtists,
  onSelectArtist,
  onRemoveArtist,
  userTopArtists,
  totalSeedsCount
}) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced artist search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchArtists(query.trim(), 5);
        if (data.artists && data.artists.items) {
          setSearchResults(data.artists.items);
        }
      } catch (err) {
        console.error('Error searching artists:', err);
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

  const handleSelect = (artist) => {
    if (selectedArtists.some((a) => a.id === artist.id)) {
      onRemoveArtist(artist.id);
    } else {
      if (totalSeedsCount >= 5) {
        alert('Límite de 5 semillas en total alcanzado (artistas + géneros).');
        return;
      }
      onSelectArtist({
        id: artist.id,
        name: artist.name,
        image: artist.images?.[2]?.url || artist.images?.[0]?.url || ''
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-lg font-bold text-white">Artistas Semilla</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
          {selectedArtists.length} seleccionados
        </span>
      </div>

      {/* Selected Artists List */}
      {selectedArtists.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedArtists.map((artist) => (
            <div
              key={artist.id}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-white group"
            >
              {artist.image ? (
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold">
                  {artist.name.charAt(0)}
                </div>
              )}
              <span className="font-medium max-w-[120px] truncate">{artist.name}</span>
              <button
                onClick={() => onRemoveArtist(artist.id)}
                className="text-zinc-500 hover:text-red-400 ml-0.5 font-bold transition-colors cursor-pointer"
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
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar artista en Spotify..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
          />
          {loading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1db954]"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && searchResults.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
            {searchResults.map((artist) => {
              const isSelected = selectedArtists.some((a) => a.id === artist.id);
              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => handleSelect(artist)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800 text-left border-b border-zinc-800/40 last:border-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {artist.images?.[2]?.url || artist.images?.[0]?.url ? (
                      <img
                        src={artist.images[2]?.url || artist.images[0]?.url}
                        alt={artist.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                        {artist.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-white">{artist.name}</span>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold text-[#1db954]">Seleccionado</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* User's Top Artists Quick Select */}
      {userTopArtists && userTopArtists.length > 0 && (
        <div className="flex flex-col space-y-2 pt-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Sugeridos de tus favoritos:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {userTopArtists.slice(0, 5).map((artist) => {
              const isSelected = selectedArtists.some((a) => a.id === artist.id);
              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => handleSelect(artist)}
                  disabled={isSelected && selectedArtists.length >= 5}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1db954]/10 border-[#1db954] text-[#1db954]'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  {artist.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
