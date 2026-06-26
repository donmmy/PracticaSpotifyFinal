'use client';

const MOOD_PARAMS = [
  { key: 'energy', label: 'Energía', emoji: '⚡', description: 'Baja → Alta' },
  { key: 'valence', label: 'Felicidad', emoji: '😊', description: 'Triste → Alegre' },
  { key: 'danceability', label: 'Bailabilidad', emoji: '💃', description: 'Suave → Bailable' },
  { key: 'acousticness', label: 'Acústica', emoji: '🎸', description: 'Electrónico → Acústico' },
];

const MOOD_PRESETS = [
  { label: 'Happy', emoji: '😄', values: { energy: 75, valence: 85, danceability: 70, acousticness: 20 } },
  { label: 'Sad', emoji: '😢', values: { energy: 25, valence: 15, danceability: 30, acousticness: 60 } },
  { label: 'Energetic', emoji: '🔥', values: { energy: 95, valence: 65, danceability: 85, acousticness: 10 } },
  { label: 'Calm', emoji: '🧘', values: { energy: 20, valence: 50, danceability: 25, acousticness: 80 } },
];

export default function MoodWidget({ mood, onChangeMood }) {
  const handleChange = (key, value) => {
    onChangeMood({ ...mood, [key]: parseInt(value) });
  };

  const applyPreset = (preset) => {
    onChangeMood({ ...preset.values });
  };

  return (
    <div className="glass p-6 rounded-2xl flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-bold text-white">Estado de Ánimo</h2>
        </div>
      </div>

      {/* Mood Presets */}
      <div className="flex flex-wrap gap-2">
        {MOOD_PRESETS.map((preset) => {
          // Check if current mood matches this preset
          const isActive = Object.entries(preset.values).every(
            ([k, v]) => mood[k] === v
          );
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`text-xs px-3 py-2 rounded-lg border font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#1db954]/15 border-[#1db954] text-[#1db954]'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <span>{preset.emoji}</span>
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {MOOD_PARAMS.map(({ key, label, emoji, description }) => (
          <div key={key} className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{emoji}</span>
                <span className="text-sm font-semibold text-white">{label}</span>
              </div>
              <span className="text-xs font-bold text-[#1db954] bg-[#1db954]/10 px-2 py-0.5 rounded-full">
                {mood[key]}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mood[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full"
            />
            <span className="text-[10px] text-zinc-500">{description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
