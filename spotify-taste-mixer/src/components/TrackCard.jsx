'use client';

export default function TrackCard({ track, index, onDelete, onToggleFavorite, isFavorite }) {
  const albumImage = track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '';
  const artistNames = track.artists?.map(a => a.name).join(', ') || '';
  const duration = track.duration_ms
    ? `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}`
    : '';

  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-200 border border-transparent hover:border-zinc-800">
      {/* Index */}
      <span className="text-xs font-mono text-zinc-600 w-5 text-right flex-shrink-0">
        {index + 1}
      </span>

      {/* Album Art */}
      {albumImage ? (
        <img
          src={albumImage}
          alt={track.name}
          className="w-10 h-10 rounded-md object-cover flex-shrink-0 shadow-md"
        />
      ) : (
        <div className="w-10 h-10 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-500 flex-shrink-0">
          🎵
        </div>
      )}

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{track.name}</p>
        <p className="text-xs text-zinc-400 truncate">{artistNames}</p>
      </div>

      {/* Duration */}
      <span className="text-xs text-zinc-500 font-mono hidden sm:block flex-shrink-0">
        {duration}
      </span>

      {/* Popularity */}
      <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
        <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1db954] to-[#1ed760]"
            style={{ width: `${track.popularity || 0}%` }}
          />
        </div>
        <span className="text-[10px] text-zinc-500 w-6">{track.popularity}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {/* Favorite */}
        <button
          type="button"
          onClick={() => onToggleFavorite(track)}
          className="p-1.5 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <svg
            className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-zinc-500'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(track.id)}
          className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
          title="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
