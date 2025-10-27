// Funciones de autenticación reutilizables
export type LoginResult = { token: string; user?: { name?: string; roles?: string[] } };

export async function apiLogin(email: string, password: string): Promise<LoginResult> {
  // Base URL configurable desde la página (window.__API_BASE__) o por defecto la misma origen
  const base = (typeof window !== 'undefined' && (window as any).__API_BASE__) ? (window as any).__API_BASE__ : '';
  // Intento real: POST a /api/auth/login
  try {
    const res = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      // Si no hay backend, dejar que el llamador haga fallback
      throw new Error('HTTP ' + res.status);
    }

    const json = await res.json();
    return json as LoginResult;
  } catch (err) {
    // Fallback local si backend no existe o error de red
    // Para pruebas locales: admin@demo / admin
    if (email === 'admin@demo' && password === 'admin') {
      return { token: 'mock-admin-token', user: { name: 'Administrador', roles: ['ADMIN'] } };
    }
    if (email === 'user@demo' && password === 'user') {
      return { token: 'mock-user-token', user: { name: 'Usuario demo', roles: ['USER'] } };
    }
    throw err;
  }
}

export function saveToken(token: string) {
  try { localStorage.setItem('authToken', token); } catch(e){}
}

export function getToken(): string | null {
  try { return localStorage.getItem('authToken'); } catch(e){ return null }
}

export function logout() {
  try { localStorage.removeItem('authToken'); } catch(e){}
}
