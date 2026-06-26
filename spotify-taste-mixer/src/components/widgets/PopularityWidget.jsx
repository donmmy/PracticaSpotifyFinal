'use client';

const POPULARITY_CATEGORIES = [
  { label: 'Underground', emoji: '💎', range: [0, 30], description: 'Joyas ocultas' },
  { label: 'Nicho', emoji: '🎯', range: [30, 50], description: 'Conocido en su género' },
  { label: 'Popular', emoji: '🔥', range: [50, 80], description: 'Ampliamente conocido' },
  { label: 'Mainstream', emoji: '🌟', range: [80, 100], description: 'Hits del momento' },
];

export default function PopularityWidget({
  popularityConfig,
  onChangePopularityConfig,
  useFavorites,
  onToggleUseFavorites,
  favoritesCount
}) {
  const handleChange = (key, value) => {
    onChangePopularityConfig({ ...popularityConfig, [key]: parseInt(value) });
  };

  const applyCategory = (range) => {
    onChangePopularityConfig({ min: range[0], max: range[1] });
  };

  // Determine which category is active
  const activeCategory = POPULARITY_CATEGORIES.find(
    (c) => c.range[0] === popularityConfig.min && c.range[1] === popularityConfig.max
  );

  return (
    <div className="glass p-6 rounded-2xl flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h2 className="text-lg font-bold text-white">Popularidad</h2>
        </div>
      </div>

      {/* Quick Category Buttons */}
      <div className="flex flex-wrap gap-2">
        {POPULARITY_CATEGORIES.map((cat) => {
          const isActive = activeCategory?.label === cat.label;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => applyCategory(cat.range)}
              className={`text-xs px-3 py-2 rounded-lg border font-semibold transition-all duration-200 cursor-pointer flex flex-col items-center gap-0.5 min-w-[70px] ${
                isActive
                  ? 'bg-[#1db954]/15 border-[#1db954] text-[#1db954]'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span>{cat.label}</span>
              <span className="text-[9px] text-zinc-500 font-normal">{cat.range[0]}-{cat.range[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Range Sliders */}
      <div className="space-y-4">
        {/* Min Popularity */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Mínima</span>
            <span className="text-xs font-bold text-[#1db954] bg-[#1db954]/10 px-2 py-0.5 rounded-full">
              {popularityConfig.min}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={popularityConfig.min}
            onChange={(e) => handleChange('min', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Max Popularity */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Máxima</span>
            <span className="text-xs font-bold text-[#1db954] bg-[#1db954]/10 px-2 py-0.5 rounded-full">
              {popularityConfig.max}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={popularityConfig.max}
            onChange={(e) => handleChange('max', e.target.value)}
            className="w-full"
          />
        </div>

        <p className="text-xs text-zinc-500">
          Rango de popularidad: {popularityConfig.min} — {popularityConfig.max}
        </p>
      </div>

      {/* Use Favorites Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Incluir favoritos</span>
          <span className="text-xs text-zinc-500">{favoritesCount} guardados</span>
        </div>
        <button
          type="button"
          onClick={onToggleUseFavorites}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
            useFavorites ? 'bg-[#1db954]' : 'bg-zinc-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              useFavorites ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
