import { useEffect, useState } from 'react';
import { fetchTopArtists, fetchArtistGenres, Artist, Tag } from '../API/lastfm';

const TrendingArtistsSection = () => {
  const [currentArtists, setCurrentArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const topArtists = await fetchTopArtists();
        setCurrentArtists(topArtists);
      } catch (error) {
        console.error('Failed to load trending artists:', error);
      }
    };

    loadArtists();
  }, []);

  return (
    <section className="trending-artists-section">
      <h2 className="trending-title">Hot right now</h2>
      <div className="trending-divider" />

      <div className="trending-grid">
        {currentArtists.length > 0 ? (
          currentArtists.map((performer) => (
            <RenderArtistCard key={performer.name} performer={performer} />
          ))
        ) : (
          <p className="hot-right-now-empty">No trending artists found.</p>
        )}
      </div>
    </section>
  );
};

const RenderArtistCard = ({ performer }: { performer: Artist }) => {
  return (
    <div className="trending-card">
      <a href={performer.url} className="artist-media-link">
        <img
          className="artist-thumbnail"
          src={performer.image?.[2]?.['#text'] ?? '/images/image.png'}
          alt={performer.name}
          loading="eager"
          width={120}
          height={120}
        />
        <p className="artist-name-label">{performer.name}</p>
      </a>

      <DisplayArtistGenres artistName={performer.name} />
    </div>
  );
};

const DisplayArtistGenres = ({ artistName }: { artistName: string }) => {
  const [genreTags, setGenreTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await fetchArtistGenres(artistName);
        setGenreTags(genres);
      } catch {

      }
    };

    fetchGenres();
  }, [artistName]);

  if (genreTags.length === 0) return null;

  return (
    <p className="artist-tags-container">
      {genreTags.map((genre) => (
        <a key={genre.name} href={genre.url} className="artist-tag-link">
          {genre.name}
        </a>
      ))}
    </p>
  );
};

export default TrendingArtistsSection;