import HotRightNow from '../components/HotRightNow';
import PopularTracks from '../components/PopularTracks';
import '../style.css';

export default function Home() {
  return (
    <>
      <div className="page-header-section">
        <h1 className="page-title">Music</h1>
      </div>
      <HotRightNow />
      <PopularTracks />
    </>
  );
}