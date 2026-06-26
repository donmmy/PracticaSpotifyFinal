'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import {
  getUserProfile,
  getUserTopArtists,
  getUserTopTracks,
  generatePlaylist,
  createPlaylist,
  addTracksToPlaylist
} from '@/lib/spotify';

import Header from '@/components/Header';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';
import PlaylistDisplay from '@/components/PlaylistDisplay';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [userTopArtists, setUserTopArtists] = useState([]);
  const [userTopTracks, setUserTopTracks] = useState([]);
  
  // Preference States
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [decadeConfig, setDecadeConfig] = useState({
    selectedDecades: [],
    yearRange: { min: 1970, max: 2026 },
    mode: 'decade'
  });
  const [mood, setMood] = useState({
    energy: 60,
    valence: 50,
    danceability: 65,
    acousticness: 30
  });
  const [popularityConfig, setPopularityConfig] = useState({
    min: 20,
    max: 100
  });
  const [useFavorites, setUseFavorites] = useState(false);

  // Output States
  const [tracks, setTracks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Authenticate and load initial data
  useEffect(() => {
    setMounted(true);
    
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const loadInitialData = async () => {
      try {
        const [profile, topArtists, topTracks] = await Promise.all([
          getUserProfile(),
          getUserTopArtists(8),
          getUserTopTracks(8)
        ]);
        setUser(profile);
        if (topArtists?.items) {
          setUserTopArtists(topArtists.items);
        }
        if (topTracks?.items) {
          setUserTopTracks(topTracks.items);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Error de sesión. Por favor, inicia sesión nuevamente.');
      }
    };

    loadInitialData();

    // Load favorites from local storage
    const savedFavs = localStorage.getItem('favorite_tracks');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (_) {}
    }
  }, [router]);

  // Sync favorites back to localStorage
  const updateFavoritesList = (newList) => {
    setFavorites(newList);
    localStorage.setItem('favorite_tracks', JSON.stringify(newList));
  };

  // Toggle favorite status
  const handleToggleFavorite = (track) => {
    const exists = favorites.some((f) => f.id === track.id);
    let updated;
    if (exists) {
      updated = favorites.filter((f) => f.id !== track.id);
    } else {
      updated = [...favorites, track];
    }
    updateFavoritesList(updated);
  };

  // Seed Limit checks (max 5 across artists, tracks, and genres)
  const totalSeedsCount = selectedArtists.length + selectedTracks.length + selectedGenres.length;

  const handleSelectArtist = (artist) => {
    if (totalSeedsCount >= 5) return;
    setSelectedArtists([...selectedArtists, artist]);
  };

  const handleRemoveArtist = (artistId) => {
    setSelectedArtists(selectedArtists.filter((a) => a.id !== artistId));
  };

  const handleSelectTrack = (track) => {
    if (totalSeedsCount >= 5) return;
    setSelectedTracks([...selectedTracks, track]);
  };

  const handleRemoveTrack = (trackId) => {
    setSelectedTracks(selectedTracks.filter((t) => t.id !== trackId));
  };

  const handleToggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      if (totalSeedsCount >= 5) return;
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Generation Handler
  const handleGenerateMix = async () => {
    setLoading(true);
    setError(null);
    try {
      const preferences = {
        artists: selectedArtists,
        tracks: selectedTracks,
        genres: selectedGenres,
        decades: decadeConfig,
        popularity: popularityConfig,
        mood: mood,
        useFavorites: useFavorites,
        favorites: favorites
      };

      const result = await generatePlaylist(preferences, 30);
      setTracks(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al generar recomendaciones. Prueba cambiando las semillas.');
    } finally {
      setLoading(false);
    }
  };

  // Append Recommendations
  const handleAppendMix = async () => {
    setLoading(true);
    setError(null);
    try {
      const preferences = {
        artists: selectedArtists,
        tracks: selectedTracks,
        genres: selectedGenres,
        decades: decadeConfig,
        popularity: popularityConfig,
        mood: mood,
        useFavorites: useFavorites,
        favorites: favorites
      };

      // Retrieve more tracks
      const result = await generatePlaylist(preferences, 20);
      
      // Filter out tracks already in current list
      const currentIds = new Set(tracks.map(t => t.id));
      const newTracks = result.filter(t => !currentIds.has(t.id));

      if (newTracks.length === 0) {
        setError('No se encontraron canciones nuevas adicionales. Intenta cambiando el estado de ánimo.');
      } else {
        setTracks([...tracks, ...newTracks]);
      }
    } catch (err) {
      console.error(err);
      setError('Error al ampliar la playlist.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Track from list
  const handleDeleteTrack = (trackId) => {
    setTracks(tracks.filter((t) => t.id !== trackId));
  };

  // Save/Export Playlist
  const handleSaveToSpotify = async (playlistName, description) => {
    if (!user || tracks.length === 0) return;
    
    setSaving(true);
    setError(null);
    try {
      const playlist = await createPlaylist(user.id, playlistName, description);
      const trackUris = tracks.map((t) => t.uri);
      await addTracksToPlaylist(playlist.id, trackUris);
      return playlist;
    } catch (err) {
      console.error('Save to Spotify failed:', err);
      setError('Error al guardar la playlist en Spotify. Asegúrate de tener permisos.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#040405] text-zinc-100 flex flex-col relative pb-12">
      {/* Mesh Background */}
      <div className="bg-mesh" />

      {/* Header */}
      <Header user={user} />

      {/* Main Grid Panel */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 z-10">
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-zinc-500 hover:text-white font-bold cursor-pointer">
              &times;
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Preferences Column (Left Panel - 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Widget Group Intro */}
            <div className="glass p-5 rounded-2xl flex flex-col space-y-3">
              <div>
                <h1 className="text-xl font-bold text-white">Configuración del Mezclador</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Elige las semillas y el perfil de sonido que deseas para tus recomendaciones.
                </p>
              </div>

              {/* Seed status badge */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-xs font-semibold text-zinc-400">
                  Semillas seleccionadas:
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  totalSeedsCount === 0 
                    ? 'bg-zinc-800 text-zinc-500' 
                    : totalSeedsCount === 5 
                      ? 'bg-amber-500/15 text-amber-500' 
                      : 'bg-[#1db954]/15 text-[#1db954]'
                }`}>
                  {totalSeedsCount}/5
                </span>
              </div>

              {/* Core mix generator trigger button */}
              <button
                type="button"
                onClick={handleGenerateMix}
                disabled={loading}
                className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-[#1db954]/15 hover:shadow-[#1db954]/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Buscando canciones...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generar Mezcla
                  </>
                )}
              </button>
            </div>

            {/* Mixer Parameter Widgets */}
            <ArtistWidget
              selectedArtists={selectedArtists}
              onSelectArtist={handleSelectArtist}
              onRemoveArtist={handleRemoveArtist}
              userTopArtists={userTopArtists}
              totalSeedsCount={totalSeedsCount}
            />

            <TrackWidget
              selectedTracks={selectedTracks}
              onSelectTrack={handleSelectTrack}
              onRemoveTrack={handleRemoveTrack}
              userTopTracks={userTopTracks}
              totalSeedsCount={totalSeedsCount}
            />

            <GenreWidget
              selectedGenres={selectedGenres}
              onToggleGenre={handleToggleGenre}
              totalSeedsCount={totalSeedsCount}
            />

            <DecadeWidget
              decadeConfig={decadeConfig}
              onChangeDecadeConfig={setDecadeConfig}
            />

            <MoodWidget
              mood={mood}
              onChangeMood={setMood}
            />

            <PopularityWidget
              popularityConfig={popularityConfig}
              onChangePopularityConfig={setPopularityConfig}
              useFavorites={useFavorites}
              onToggleUseFavorites={() => setUseFavorites(!useFavorites)}
              favoritesCount={favorites.length}
            />

          </div>

          {/* Results Column (Right Panel - 7 Cols) */}
          <div className="lg:col-span-7 h-full">
            <PlaylistDisplay
              tracks={tracks}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onDeleteTrack={handleDeleteTrack}
              onReorderTracks={setTracks}
              onRegenerate={handleGenerateMix}
              onAppend={handleAppendMix}
              onSaveToSpotify={handleSaveToSpotify}
              saving={saving}
              loading={loading}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
