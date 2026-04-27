export interface AuthResponse {
  token: string;
}

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  return JSON.parse(text);
}

export const authApi = {
  register: (email: string, password: string) =>
    post<AuthResponse>('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    post<AuthResponse>('/auth/login', { email, password }),
};
