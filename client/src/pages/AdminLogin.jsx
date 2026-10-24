import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { token } = await api.login(email.trim(), password);
      localStorage.setItem('nearaid:token', token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page page--narrow">
      <h1>Admin login</h1>
      <form className="suggest" onSubmit={submit}>
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
        <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        <button className="btn btn--primary" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
        {error && <p className="status status--error" role="alert">{error}</p>}
      </form>
      <p className="footer"><Link to="/">Back to NearAid</Link></p>
    </main>
  );
}
