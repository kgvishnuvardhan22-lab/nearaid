import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import CategoryChips from '../components/CategoryChips.jsx';
import FacilityCard from '../components/FacilityCard.jsx';
import SuggestForm from '../components/SuggestForm.jsx';
import StatusMessage from '../components/StatusMessage.jsx';

const CACHE_KEY = 'nearaid:lastResults';

export default function Home() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState(null); // { lat, lng, source: 'gps' | 'manual' }
  const [manual, setManual] = useState({ lat: '', lng: '' });
  const [showManual, setShowManual] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cached, setCached] = useState(null); // cached results shown when the network fails
  const [showSuggest, setShowSuggest] = useState(false);

  const search = useCallback(async (loc, cat) => {
    setLoading(true);
    setError(null);
    setCached(null);
    try {
      const data = await api.nearby({ lat: loc.lat, lng: loc.lng, type: cat, radius: 10 });
      setResults(data.results);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ location: loc, category: cat, results: data.results, at: Date.now() }));
    } catch (err) {
      // Offline / server down: fall back to the last cached results if we have them.
      const saved = localStorage.getItem(CACHE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCached(parsed);
        setResults(parsed.results);
      }
      setError(`Could not reach the server (${err.message}).${saved ? ' Showing your last saved results.' : ''}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Geolocation, with a manual-entry fallback when permission is denied/unavailable.
  function findMe() {
    setError(null);
    if (!('geolocation' in navigator)) {
      setShowManual(true);
      setError('This browser has no geolocation - enter your coordinates manually below.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, source: 'gps' };
        setLocation(loc);
        search(loc, category);
      },
      () => {
        setLoading(false);
        setShowManual(true);
        setError('Location permission was denied. Enter your coordinates manually, or allow location access and try again.');
      },
      { timeout: 10000 }
    );
  }

  function useManualLocation(e) {
    e.preventDefault();
    const lat = Number(manual.lat);
    const lng = Number(manual.lng);
    if (Number.isNaN(lat) || lat < -90 || lat > 90 || Number.isNaN(lng) || lng < -180 || lng > 180) {
      setError('Enter a valid latitude (-90..90) and longitude (-180..180). Tip: in Google Maps, right-click a spot to copy them.');
      return;
    }
    const loc = { lat, lng, source: 'manual' };
    setLocation(loc);
    search(loc, category);
  }

  function changeCategory(cat) {
    setCategory(cat);
    if (location) search(location, cat);
  }

  // Demo/deep-link support: /?lat=13.05&lng=80.24 searches immediately.
  useEffect(() => {
    const lat = Number(params.get('lat'));
    const lng = Number(params.get('lng'));
    if (!Number.isNaN(lat) && !Number.isNaN(lng) && params.get('lat') && params.get('lng')) {
      const loc = { lat, lng, source: 'manual' };
      setLocation(loc);
      search(loc, 'all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page">
      <header className="hero">
        <h1>NearAid</h1>
        <p className="hero__sub">Find emergency help near you - hospitals, blood banks, pharmacies, ambulances.</p>
        <p className="hero__demo">Demo build: all listings are clearly labelled SAMPLE data.</p>
        <button className="btn btn--big" onClick={findMe} disabled={loading}>
          {loading ? 'Searching...' : '📍 Find help near me'}
        </button>
        <button className="link" onClick={() => setShowManual((s) => !s)}>
          {showManual ? 'Hide manual location' : 'Enter location manually'}
        </button>
        {showManual && (
          <form className="manual" onSubmit={useManualLocation}>
            <input required placeholder="Latitude e.g. 13.0827" value={manual.lat} onChange={(e) => setManual({ ...manual, lat: e.target.value })} inputMode="decimal" />
            <input required placeholder="Longitude e.g. 80.2707" value={manual.lng} onChange={(e) => setManual({ ...manual, lng: e.target.value })} inputMode="decimal" />
            <button className="btn btn--primary">Use this location</button>
          </form>
        )}
      </header>

      <CategoryChips value={category} onChange={changeCategory} />

      <section className="results">
        {loading && <StatusMessage kind="info">Finding facilities near you...</StatusMessage>}
        {error && <StatusMessage kind="error">{error}</StatusMessage>}
        {cached && <StatusMessage kind="info">Offline - showing results saved {new Date(cached.at).toLocaleString()}.</StatusMessage>}
        {!loading && !error && results && results.length === 0 && (
          <StatusMessage kind="empty">No facilities found within 10 km for this category. Try a different category.</StatusMessage>
        )}
        {!loading && results && results.map((f) => <FacilityCard key={f.id} facility={f} />)}
        {!loading && !results && !error && (
          <StatusMessage kind="info">Tap "Find help near me" to see facilities around you.</StatusMessage>
        )}
      </section>

      <section className="suggest-wrap">
        <button className="link" onClick={() => setShowSuggest((s) => !s)}>
          {showSuggest ? 'Hide suggestion form' : 'Suggest a facility'}
        </button>
        {showSuggest && <SuggestForm location={location} />}
      </section>

      <footer className="footer">
        <Link to="/admin/login">Admin login</Link>
      </footer>
    </main>
  );
}
