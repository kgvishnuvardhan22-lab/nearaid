import { useState } from 'react';
import { api } from '../api.js';

// "Suggest a facility" form - posts to the pending queue for admin review.
export default function SuggestForm({ location }) {
  const [form, setForm] = useState({ name: '', type: 'hospital', address: '', phone: '' });
  const [status, setStatus] = useState(null); // { kind, text }
  const [busy, setBusy] = useState(false);

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await api.suggest({
        name: form.name.trim(),
        type: form.type,
        address: form.address.trim(),
        phone: form.phone.trim() || undefined,
        lat: location ? location.lat : 13.0827,
        lng: location ? location.lng : 80.2707,
      });
      setStatus({ kind: 'ok', text: res.message });
      setForm({ name: '', type: 'hospital', address: '', phone: '' });
    } catch (err) {
      setStatus({ kind: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="suggest" onSubmit={submit}>
      <h2>Suggest a facility</h2>
      <p className="suggest__hint">Know a place that should be listed? It appears after an admin reviews it.</p>
      <label>Name<input required minLength={3} value={form.name} onChange={set('name')} placeholder="e.g. City Care Hospital" /></label>
      <label>Type
        <select value={form.type} onChange={set('type')}>
          <option value="hospital">Hospital</option>
          <option value="blood_bank">Blood Bank</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="ambulance">Ambulance</option>
        </select>
      </label>
      <label>Address<input required minLength={5} value={form.address} onChange={set('address')} placeholder="Street, area, city" /></label>
      <label>Phone (optional)<input value={form.phone} onChange={set('phone')} placeholder="+91 ..." /></label>
      <button className="btn btn--primary" disabled={busy}>{busy ? 'Sending...' : 'Submit for review'}</button>
      {status && <p className={`status status--${status.kind}`}>{status.text}</p>}
    </form>
  );
}
