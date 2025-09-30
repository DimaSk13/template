import { useEffect, useState } from 'react';
import { fetchTopTracks, Track } from '../API/lastfm';

export default function PopularTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    fetchTopTracks().then(setTracks).catch(console.error);
  }, []);

  return (
    <section className="top-tracks-section">
      <h2 className="tracks-title">Popular tracks</h2>
      <div className="tracks-divider" />

      <div className="tracks-columns-container">
        {tracks.length > 0 ? (
          tracks.map((track) => <TrackCard key={track.name} track={track} />)
        ) : (
          <p className="popular-tracks-empty">No popular tracks found.</p>
        )}
      </div>
    </section>
  );
}

function TrackCard({ track }: { track: Track }) {
  return (
    <div className="track-list-item">
      <a href={track.url} className="popular-tracks-media">
        <img
          className="track-cover"
          src={track.image?.[2]?.['#text'] ?? '/images/image.png'}
          alt={track.name}
          loading="lazy"
        />
      </a>

      <div className="track-details">
        <a href={track.url} className="track-name-link">
          {track.name}
        </a>
        <a href={track.artist.url} className="track-artist-link">
          {track.artist.name}
        </a>
      </div>
    </div>
  );
}