export async function apiLogin(email, password) {
    // Base URL configurable desde la página (window.__API_BASE__) o por defecto la misma origen
    const base = (typeof window !== 'undefined' && window.__API_BASE__) ? window.__API_BASE__ : '';
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
        return json;
    }
    catch (err) {
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
export function saveToken(token) {
    try {
        localStorage.setItem('authToken', token);
    }
    catch (e) { }
}
export function getToken() {
    try {
        return localStorage.getItem('authToken');
    }
    catch (e) {
        return null;
    }
}
export function logout() {
    try {
        localStorage.removeItem('authToken');
    }
    catch (e) { }
}
