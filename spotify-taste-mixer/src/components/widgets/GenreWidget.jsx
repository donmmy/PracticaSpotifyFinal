'use client';

import { useState } from 'react';

const AVAILABLE_GENRES = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime',
  'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat',
  'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical',
  'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal',
  'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
  'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro',
  'french', 'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore',
  'groove', 'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle',
  'heavy-metal', 'hip-hop', 'house', 'idm', 'indian', 'indie', 'indie-pop',
  'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz',
  'k-pop', 'kids', 'latin', 'latino', 'malay', 'mandopop', 'metal',
  'metal-misc', 'metalcore', 'minimal-techno', 'movies', 'mpb', 'new-age',
  'new-release', 'opera', 'pagode', 'party', 'philippines-opm', 'piano',
  'pop', 'pop-film', 'post-dubstep', 'power-pop', 'progressive-house',
  'psych-rock', 'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae',
  'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly', 'romance',
  'sad', 'salsa', 'samba', 'sertanejo', 'show-tunes', 'singer-songwriter',
  'ska', 'sleep', 'songwriter', 'soul', 'soundtracks', 'spanish', 'study',
  'summer', 'swedish', 'synth-pop', 'tango', 'techno', 'trance', 'trip-hop',
  'turkish', 'work-out', 'world-music'
];

export default function GenreWidget({ selectedGenres, onToggleGenre, totalSeedsCount }) {
  const [filter, setFilter] = useState('');

  const filteredGenres = filter.trim()
    ? AVAILABLE_GENRES.filter((g) => g.includes(filter.toLowerCase().trim()))
    : AVAILABLE_GENRES;

  return (
    <div className="glass p-6 rounded-2xl flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <h2 className="text-lg font-bold text-white">Géneros</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
          {selectedGenres.length} seleccionados
        </span>
      </div>

      {/* Search Filter */}
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filtrar géneros..."
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
      />

      {/* Selected Genres (always visible at top) */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-zinc-800/50">
          {selectedGenres.map((genre) => (
            <button
              key={`selected-${genre}`}
              type="button"
              onClick={() => onToggleGenre(genre)}
              className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-200 cursor-pointer capitalize bg-[#1db954]/15 border-[#1db954] text-[#1db954] flex items-center gap-1"
            >
              {genre}
              <span className="text-[10px] font-bold">&times;</span>
            </button>
          ))}
        </div>
      )}

      {/* Genre Grid */}
      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
        {filteredGenres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          const isDisabled = !isSelected && totalSeedsCount >= 5;
          return (
            <button
              key={genre}
              type="button"
              onClick={() => onToggleGenre(genre)}
              disabled={isDisabled}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-200 cursor-pointer capitalize ${
                isSelected
                  ? 'bg-[#1db954]/15 border-[#1db954] text-[#1db954]'
                  : isDisabled
                    ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-600 cursor-not-allowed'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              {genre}
            </button>
          );
        })}
        {filteredGenres.length === 0 && (
          <p className="text-xs text-zinc-500 py-2">No se encontraron géneros con &quot;{filter}&quot;</p>
        )}
      </div>

      {totalSeedsCount >= 5 && selectedGenres.length === 0 && (
        <p className="text-xs text-amber-500/80 mt-1">
          Máximo de 5 semillas alcanzado. Quita alguna para seleccionar géneros.
        </p>
      )}
    </div>
  );
}
