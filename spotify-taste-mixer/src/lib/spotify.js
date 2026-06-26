import { getAccessToken } from './auth';

export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  // 1. Obtener top tracks de artistas seleccionados
  for (const artist of artists) {
    const tracks = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await tracks.json();
    if (data.tracks) allTracks.push(...data.tracks);
  }

  // 2. Buscar por géneros
  for (const genre of genres) {
    const results = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=genre:${encodeURIComponent(genre)}&limit=20`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await results.json();
    if (data.tracks?.items) allTracks.push(...data.tracks.items);
  }

  // 3. Filtrar por década
  if (decades && decades.selectedDecades && decades.selectedDecades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.selectedDecades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // 4. Filtrar por popularidad
  if (popularity) {
    const min = popularity.min ?? 0;
    const max = popularity.max ?? 100;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Eliminar duplicados y limitar a 30 canciones
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  return uniqueTracks;
}

export async function searchArtists(query, limit = 5) {
  const token = getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error('Error buscando artistas');
  return res.json();
}

export async function searchTracks(query, limit = 5) {
  const token = getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error('Error buscando canciones');
  return res.json();
}

export async function getUserProfile() {
  const token = getAccessToken();
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener perfil');
  return res.json();
}

export async function getUserTopArtists(limit = 8) {
  const token = getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=medium_term`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error('Error al obtener top artistas');
  return res.json();
}

export async function getUserTopTracks(limit = 8) {
  const token = getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=medium_term`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error('Error al obtener top tracks');
  return res.json();
}

export async function createPlaylist(userId, name, description = '') {
  const token = getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, public: false }),
  });
  if (!res.ok) throw new Error('Error al crear playlist');
  return res.json();
}

export async function addTracksToPlaylist(playlistId, uris) {
  const token = getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris }),
  });
  if (!res.ok) throw new Error('Error al añadir canciones a la playlist');
  return res.json();
}
