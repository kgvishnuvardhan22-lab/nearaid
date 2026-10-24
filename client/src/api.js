// Thin API client. Base URL comes from VITE_API_URL (empty in dev = Vite proxy).
const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body.error || `Request failed (${res.status})`), { status: res.status });
  return body;
}

function authHeaders() {
  const token = localStorage.getItem('nearaid:token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  health: () => request('/api/health'),
  nearby: ({ lat, lng, type, radius }) => {
    const params = new URLSearchParams({ lat, lng, radius: radius ?? 5 });
    if (type && type !== 'all') params.set('type', type);
    return request(`/api/facilities/nearby?${params}`);
  },
  suggest: (payload) => request('/api/facilities', { method: 'POST', body: JSON.stringify(payload) }),
  login: (email, password) => request('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  pending: () => request('/api/admin/pending', { headers: authHeaders() }),
  verified: () => request('/api/admin/facilities', { headers: authHeaders() }),
  approve: (id) => request(`/api/admin/facilities/${id}/approve`, { method: 'POST', headers: authHeaders() }),
  reject: (id) => request(`/api/admin/facilities/${id}/reject`, { method: 'POST', headers: authHeaders() }),
  update: (id, payload) => request(`/api/admin/facilities/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) }),
};
