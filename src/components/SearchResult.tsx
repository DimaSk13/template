import React, { useEffect, useState } from 'react';
import {
  findArtistsByName,
  findAlbumsByName,
  findTracksByName,
  retrieveTrackMetadata,
  Artist,
  Album,
  Track,
  TrackInfo
} from '../API/lastfm';
import { useNavigate, useSearchParams } from 'react-router-dom';

type EnrichedTrack = Track & TrackInfo;

const MusicSearchPage = () => {
  const router = useNavigate();
  const [urlParams] = useSearchParams();
  const searchTerm = urlParams.get('q')?.trim() || '';

  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [albumResults, setAlbumResults] = useState<Album[]>([]);
  const [trackResults, setTrackResults] = useState<EnrichedTrack[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const initiateSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const rawQuery = form.get('q') as string;
    const cleanQuery = rawQuery.trim();

    if (cleanQuery) {
      router(`/search?q=${encodeURIComponent(cleanQuery)}`);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setArtistResults([]);
      setAlbumResults([]);
      setTrackResults([]);
      return;
    }

    setIsFetching(true);

    const fetchAllResults = async () => {
      try {
        const [foundArtists, foundAlbums, foundTracks] = await Promise.all([
          findArtistsByName(searchTerm),
          findAlbumsByName(searchTerm),
          findTracksByName(searchTerm)
        ]);

        setArtistResults(foundArtists);
        setAlbumResults(foundAlbums);

        const detailedTracks = await Promise.all(
          foundTracks.map(async (track) => {
            const artistName = typeof track.artist === 'string' ? track.artist : track.artist.name;
            const fallbackImage = '/images/image.png';
            const imageSrc = track.image?.[1]?.['#text'] || fallbackImage;

            const metadata = await retrieveTrackMetadata(artistName, track.name, imageSrc);
            return { ...track, ...metadata };
          })
        );

        setTrackResults(detailedTracks);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAllResults();
  }, [searchTerm]);

  return (
    <section className="search-results">
      <div className="search-results-header-tabs">
        <header className="search-results-header">
          <h1 className={`search-results-title ${searchTerm ? 'is-visible' : ''}`}>
            Search results for “{searchTerm}”
          </h1>
        </header>

        <nav className="search-results-tabs">
          <ul className="search-results-tabs-list">
            <li className="search-results-tab search-results-tab--active">
              <span className="search-results-tab-link">Top Results</span>
            </li>
            <li className="search-results-tab">
              <span className="search-results-tab-link">Artists</span>
            </li>
            <li className="search-results-tab">
              <span className="search-results-tab-link">Albums</span>
            </li>
            <li className="search-results-tab">
              <span className="search-results-tab-link">Tracks</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="search-results-form">
        <form onSubmit={initiateSearch} className="search-results-form-inner">
          <input
            type="text"
            name="q"
            defaultValue={searchTerm}
            placeholder="Search for music..."
            aria-label="Search music"
            className="search-results-input"
          />
          <button
            type="reset"
            className="search-results-btn search-results-btn--clear"
            aria-label="Clear search field"
          >
            ×
          </button>
          <button
            type="submit"
            className="search-results-btn search-results-btn--submit"
            aria-label="Perform search"
          />
        </form>
      </div>

      <div className={`search-results-body ${searchTerm ? 'is-visible' : ''}`}>
        {!isFetching && (
          <>
            <RenderArtistsList artists={artistResults} />
            <RenderAlbumsList albums={albumResults} />
            <RenderTracksList tracks={trackResults} />
          </>
        )}
      </div>
    </section>
  );
};

// === Компоненты отображения результатов ===

const RenderArtistsList = ({ artists }: { artists: Artist[] }) => (
  <section className="artists">
    <h2 className="artists-title">Artists</h2>
    {artists.length > 0 ? (
      <div className="artists-grid">
        {artists.map((entry, index) => (
          <a
            key={`${entry.name}-${index}`}
            href={entry.url}
            className="artists-item"
            style={{ backgroundImage: `url(${entry.image?.[2]?.['#text']})` }}
          >
            <div className="artists-info">
              <h3 className="artists-name">{entry.name}</h3>
              <p className="artists-listeners">
                {Number(entry.listeners).toLocaleString()} listeners
              </p>
            </div>
          </a>
        ))}
      </div>
    ) : (
      <p className="artists-empty">No artists found.</p>
    )}
    <p className="artists-more">More artists →</p>
  </section>
);

const RenderAlbumsList = ({ albums }: { albums: Album[] }) => (
  <section className="albums">
    <h2 className="albums-title">Albums</h2>
    {albums.length > 0 ? (
      <div className="albums-grid">
        {albums.map((entry, index) => (
          <a
            key={`${entry.name}-${index}`}
            href={entry.url}
            className="albums-item"
            style={{ backgroundImage: `url(${entry.image?.[2]?.['#text']})` }}
          >
            <div className="albums-info">
              <h3 className="albums-name">{entry.name}</h3>
              <p className="albums-artist">{entry.artist}</p>
            </div>
          </a>
        ))}
      </div>
    ) : (
      <p className="albums-empty">No albums found.</p>
    )}
    <p className="albums-more">More albums →</p>
  </section>
);

const RenderTracksList = ({ tracks }: { tracks: EnrichedTrack[] }) => (
  <section className="tracks">
    <h2 className="tracks-title">Tracks</h2>
    {tracks.length > 0 ? (
      <ul className="tracks-list">
        {tracks.map((entry, index) => (
          <li key={`${entry.name}-${index}`} className="tracks-item">
            <button className="tracks-play-btn" aria-label="Play track" />
            <img className="tracks-image" src={entry.imageUrl} alt={entry.name} />
            <a href={entry.url} className="tracks-name">
              {entry.name}
            </a>
            <a href={entry.artistUrl} className="tracks-artist">
              {typeof entry.artist === 'string' ? entry.artist : entry.artist.name}
            </a>
            <div className="tracks-duration">{entry.duration}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="tracks-empty">No tracks found.</p>
    )}
    <p className="tracks-more">More tracks →</p>
  </section>
);

export default MusicSearchPage;