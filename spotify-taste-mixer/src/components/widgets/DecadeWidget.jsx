'use client';

const DECADES = [
  { label: '50s', value: '1950' },
  { label: '60s', value: '1960' },
  { label: '70s', value: '1970' },
  { label: '80s', value: '1980' },
  { label: '90s', value: '1990' },
  { label: '00s', value: '2000' },
  { label: '10s', value: '2010' },
  { label: '20s', value: '2020' },
];

export default function DecadeWidget({ decadeConfig, onChangeDecadeConfig }) {
  const { selectedDecades, yearRange, mode } = decadeConfig;

  const toggleDecade = (value) => {
    const updated = selectedDecades.includes(value)
      ? selectedDecades.filter((d) => d !== value)
      : [...selectedDecades, value];
    onChangeDecadeConfig({ ...decadeConfig, selectedDecades: updated });
  };

  const handleModeChange = (newMode) => {
    onChangeDecadeConfig({ ...decadeConfig, mode: newMode });
  };

  const handleYearRangeChange = (key, value) => {
    onChangeDecadeConfig({
      ...decadeConfig,
      yearRange: { ...yearRange, [key]: parseInt(value) }
    });
  };

  return (
    <div className="glass p-6 rounded-2xl flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-lg font-bold text-white">Décadas</h2>
        </div>
        {mode === 'decade' && selectedDecades.length > 0 && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
            {selectedDecades.length} seleccionadas
          </span>
        )}
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeChange('decade')}
          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
            mode === 'decade'
              ? 'bg-[#1db954]/15 border-[#1db954] text-[#1db954]'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          Por Década
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('range')}
          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
            mode === 'range'
              ? 'bg-[#1db954]/15 border-[#1db954] text-[#1db954]'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          Por Rango
        </button>
      </div>

      {mode === 'decade' ? (
        <div className="flex flex-wrap gap-1.5">
          {DECADES.map(({ label, value }) => {
            const isSelected = selectedDecades.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleDecade(value)}
                className={`text-xs px-4 py-2 rounded-lg border font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1db954]/15 border-[#1db954] text-[#1db954]'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 font-semibold mb-1 block">Desde</label>
              <input
                type="number"
                min="1950"
                max="2026"
                value={yearRange.min}
                onChange={(e) => handleYearRangeChange('min', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1db954] transition-all"
              />
            </div>
            <span className="text-zinc-600 font-bold mt-5">—</span>
            <div className="flex-1">
              <label className="text-xs text-zinc-500 font-semibold mb-1 block">Hasta</label>
              <input
                type="number"
                min="1950"
                max="2026"
                value={yearRange.max}
                onChange={(e) => handleYearRangeChange('max', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1db954] transition-all"
              />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Rango: {yearRange.min} — {yearRange.max}
          </p>
        </div>
      )}
    </div>
  );
}
