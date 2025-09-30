/**
 * @fileoverview Набор инструментов для взаимодействия с Last.fm API.
 * Предоставляет методы для получения топ-артистов, треков, тегов и поиска контента.
 */

// Ключ и базовый URL для Last.fm API
export const LASTFM_API_KEY = '82b8a8897c70cb2b4045f18c7b64d1d6';
export const LASTFM_API_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/';

// Тип для параметров запроса
type RequestParams = Record<string, string | number | undefined>;

/**
 * Отправляет запрос к Last.fm и возвращает данные в формате JSON.
 * @template ResponseType — ожидаемый тип ответа.
 * @param {string} apiMethod — название метода API.
 * @param {RequestParams} customParams — дополнительные параметры запроса.
 * @returns {Promise<ResponseType>} — результат запроса.
 * @throws {Error} — если запрос завершился неуспешно.
 */
async function requestLastFmApi<ResponseType>(
  apiMethod: string,
  customParams: RequestParams = {}
): Promise<ResponseType> {
  const apiUrl = new URL(LASTFM_API_ENDPOINT);
  apiUrl.searchParams.set('method', apiMethod);
  apiUrl.searchParams.set('api_key', LASTFM_API_KEY);
  apiUrl.searchParams.set('format', 'json');

  // Добавляем только корректные параметры
  for (const [paramKey, paramValue] of Object.entries(customParams)) {
    if (paramValue != null) {
      apiUrl.searchParams.set(paramKey, String(paramValue));
    }
  }

  const response = await fetch(apiUrl.toString());
  if (!response.ok) {
    throw new Error(`Ошибка Last.fm API: ${response.status}`);
  }

  return response.json();
}

/**
 * Проверяет, что все переданные аргументы — непустые строки.
 */
function areAllNonEmptyStrings(...values: unknown[]): boolean {
  return values.every(value => typeof value === 'string' && value.trim().length > 0);
}

/**
 * Извлекает URL изображения заданного размера из объекта.
 * Если нужного размера нет — берёт первое доступное.
 */
function getImageUrlFromItem(
  itemWithImages: { image?: Image[] },
  preferredSize: string = 'medium'
): string | undefined {
  const images = itemWithImages.image;
  if (!images || images.length === 0) return undefined;

  const matched = images.find(img => img.size === preferredSize);
  return matched?.['#text'] || images[0]['#text'];
}

// === Типы данных ===

/**
 * Описание изображения с размером и URL.
 */
export interface Image {
  size: string;
  '#text': string;
}

/**
 * Метка (тег), например жанр музыки.
 */
export interface Tag {
  name: string;
  url: string;
}

/**
 * Информация об исполнителе.
 */
export interface Artist {
  name: string;
  mbid: string;
  url: string;
  listeners?: string;
  image: Image[];
}

/**
 * Информация об альбоме.
 */
export interface Album {
  name: string;
  mbid?: string;
  url: string;
  artist: string;
  image: Image[];
}

/**
 * Информация о композиции.
 */
export interface Track {
  name: string;
  mbid?: string;
  url: string;
  artist: any;
  image: Image[];
}

/**
 * Детали трека: длительность, ссылка на артиста и обложку.
 */
export interface TrackInfo {
  duration: string;
  artistUrl: string;
  imageUrl: string;
}

// === Получение топ-контента ===

/**
 * Запрашивает список самых популярных исполнителей.
 */
export async function fetchTopArtists(count: number = 12): Promise<Artist[]> {
  const result = await requestLastFmApi<{ artists: { artist: Artist[] } }>(
    'chart.gettopartists',
    { limit: count }
  );
  return result.artists.artist || [];
}

/**
 * Запрашивает список самых популярных треков.
 */
export async function fetchTopTracks(count: number = 18): Promise<Track[]> {
  const result = await requestLastFmApi<{ tracks: { track: Track[] } }>(
    'chart.gettoptracks',
    { limit: count }
  );
  return result.tracks.track || [];
}

// === Работа с тегами ===

/**
 * Получает топ-теги для указанного артиста.
 */
export async function fetchArtistGenres(artistName: string, maxTags: number = 3): Promise<Tag[]> {
  if (!areAllNonEmptyStrings(artistName)) return [];

  const result = await requestLastFmApi<{ toptags: { tag: Tag[] } }>(
    'artist.gettoptags',
    { artist: artistName }
  );
  return result.toptags.tag.filter(tag => Boolean(tag.url)).slice(0, maxTags);
}

/**
 * Получает теги для конкретного трека.
 */
export async function fetchTrackGenres(
  artistName: string,
  trackTitle: string,
  maxTags: number = 3
): Promise<Tag[]> {
  if (!areAllNonEmptyStrings(artistName, trackTitle)) return [];

  const result = await requestLastFmApi<{ toptags: { tag: Tag[] } }>(
    'track.gettoptags',
    { artist: artistName, track: trackTitle }
  );
  return result.toptags.tag.filter(tag => Boolean(tag.url)).slice(0, maxTags);
}

// === Поиск контента ===

/**
 * Выполняет поиск исполнителей по ключевому слову.
 */
export async function findArtistsByName(searchTerm: string, maxResults: number = 8): Promise<Artist[]> {
  if (!searchTerm.trim()) return [];

  const result = await requestLastFmApi<{ results: { artistmatches: { artist: Artist[] } } }>(
    'artist.search',
    { artist: searchTerm, limit: maxResults }
  );
  return result.results.artistmatches.artist || [];
}

/**
 * Выполняет поиск альбомов по названию.
 */
export async function findAlbumsByName(searchTerm: string, maxResults: number = 8): Promise<Album[]> {
  if (!searchTerm.trim()) return [];

  const result = await requestLastFmApi<{ results: { albummatches: { album: Album[] } } }>(
    'album.search',
    { album: searchTerm, limit: maxResults }
  );
  return result.results.albummatches.album || [];
}

/**
 * Выполняет поиск треков по названию.
 */
export async function findTracksByName(searchTerm: string, maxResults: number = 10): Promise<Track[]> {
  if (!searchTerm.trim()) return [];

  const result = await requestLastFmApi<{ results: { trackmatches: { track: Track[] } } }>(
    'track.search',
    { track: searchTerm, limit: maxResults }
  );
  return result.results.trackmatches.track || [];
}

// === Подробная информация о треке ===

/**
 * Получает расширенные данные о треке: длительность, ссылку на артиста и обложку.
 */
export async function retrieveTrackMetadata(
  artistName: string,
  trackTitle: string,
  defaultImage: string = '/images/image.png'
): Promise<TrackInfo> {
  if (!areAllNonEmptyStrings(artistName, trackTitle)) {
    return { duration: '', artistUrl: '#', imageUrl: defaultImage };
  }

  try {
    const response = await requestLastFmApi<{
      track: {
        duration: string;
        artist: { url: string };
        album: { image: Image[] };
      };
    }>('track.getInfo', { artist: artistName, track: trackTitle });

    const trackData = response.track;

    // Преобразуем миллисекунды в MM:SS
    const rawDuration = parseInt(trackData.duration, 10);
    const formattedDuration = isNaN(rawDuration)
      ? ''
      : `${Math.floor(rawDuration / 60000)}:${String(Math.floor((rawDuration / 1000) % 60)).padStart(2, '0')}`;

    const artistLink = trackData.artist?.url || '#';
    const coverUrl = getImageUrlFromItem(trackData.album, 'medium') || defaultImage;

    return {
      duration: formattedDuration,
      artistUrl: artistLink,
      imageUrl: coverUrl
    };
  } catch {
    return { duration: '', artistUrl: '#', imageUrl: defaultImage };
  }
}