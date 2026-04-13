const API_BASE_URL = process.env.REACT_APP_API_URL?.trim() || 'http://localhost:5000';

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(apiUrl(path), options);
  const data = await response.json().catch(() => null);
  return { response, data };
}