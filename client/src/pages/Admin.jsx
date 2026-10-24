import { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api.js';

const TYPE_LABEL = { hospital: 'Hospital', blood_bank: 'Blood Bank', pharmacy: 'Pharmacy', ambulance: 'Ambulance' };

// Inline editor for one facility row.
function EditRow({ facility, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: facility.name, type: facility.type, address: facility.address,
    phone: facility.phone || '', lat: facility.lat, lng: facility.lng,
  });
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  return (
    <tr>
      <td colSpan={4}>
        <div className="edit-grid">
          <input value={form.name} onChange={set('name')} placeholder="Name" />
          <select value={form.type} onChange={set('type')}>
            {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input value={form.address} onChange={set('address')} placeholder="Address" />
          <input value={form.phone} onChange={set('phone')} placeholder="Phone (optional)" />
          <input value={form.lat} onChange={set('lat')} placeholder="Latitude" />
          <input value={form.lng} onChange={set('lng')} placeholder="Longitude" />
          <button className="btn btn--primary" onClick={() => onSave({ ...form, lat: Number(form.lat), lng: Number(form.lng) })}>Save</button>
          <button className="btn" onClick={onCancel}>Cancel</button>
        </div>
      </td>
    </tr>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('pending');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = tab === 'pending' ? await api.pending() : await api.verified();
      setRows(data.results);
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('nearaid:token');
        navigate('/admin/login');
      } else {
        setError(err.message);
      }
    }
  }, [tab, navigate]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { api.health().then((h) => setMode(h.mode)).catch(() => {}); }, []);

  async function act(fn, id) {
    setError(null);
    try {
      await fn(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveEdit(payload) {
    setError(null);
    try {
      await api.update(editingId, payload);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem('nearaid:token');
    navigate('/admin/login');
  }

  return (
    <main className="page">
      <header className="admin-head">
        <h1>Admin panel</h1>
        <div>
          {mode === 'fallback' && <span className="tag tag--sample">demo mode - changes refused</span>}
          <button className="link" onClick={logout}>Log out</button>
        </div>
      </header>

      <div className="chips">
        <button className={`chip ${tab === 'pending' ? 'chip--active' : ''}`} onClick={() => setTab('pending')}>Pending review</button>
        <button className={`chip ${tab === 'verified' ? 'chip--active' : ''}`} onClick={() => setTab('verified')}>Verified facilities</button>
      </div>

      {error && <p className="status status--error" role="alert">{error}</p>}

      <table className="table">
        <thead>
          <tr><th>Name</th><th>Type</th><th>Address</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((f) =>
            editingId === f.id ? (
              <EditRow key={f.id} facility={f} onSave={saveEdit} onCancel={() => setEditingId(null)} />
            ) : (
              <tr key={f.id}>
                <td data-label="Name">{f.name}{f.verified && <span className="tag tag--verified"> ✓</span>}</td>
                <td data-label="Type">{TYPE_LABEL[f.type] || f.type}</td>
                <td data-label="Address">{f.address}</td>
                <td className="table__actions" data-label="Actions">
                  {tab === 'pending' && <button className="btn btn--small btn--primary" onClick={() => act(api.approve, f.id)}>Approve</button>}
                  <button className="btn btn--small" onClick={() => setEditingId(f.id)}>Edit</button>
                  {tab === 'pending'
                    ? <button className="btn btn--small btn--danger" onClick={() => act(api.reject, f.id)}>Reject</button>
                    : <button className="btn btn--small btn--danger" onClick={() => act(api.reject, f.id)}>Remove</button>}
                </td>
              </tr>
            )
          )}
          {rows.length === 0 && !error && (
            <tr><td colSpan={4} className="table__empty" data-label="">{tab === 'pending' ? 'Nothing waiting for review.' : 'No verified facilities yet.'}</td></tr>
          )}
        </tbody>
      </table>

      <p className="footer"><Link to="/">Back to NearAid</Link></p>
    </main>
  );
}
