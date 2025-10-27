import { apiLogin, saveToken } from './auth';

const form = document.getElementById('loginForm') as HTMLFormElement | null;
const resultEl = document.getElementById('loginResult') as HTMLElement | null;

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (document.getElementById('login-email') as HTMLInputElement).value.trim();
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    if (!email || !password) {
      if (resultEl) resultEl.textContent = 'Completa email y contraseña.';
      return;
    }

    try {
      if (resultEl) resultEl.textContent = 'Iniciando sesión...';
      const res = await apiLogin(email, password);
      saveToken(res.token);
      if (resultEl) resultEl.textContent = 'Inicio exitoso. Redirigiendo...';

      // Si el usuario tiene rol ADMIN redirigimos al panel, si no a cuenta
      const isAdmin = res.user?.roles?.includes('ADMIN');
      setTimeout(() => {
        window.location.href = isAdmin ? 'admin/index.html' : 'cuenta.html';
      }, 500);
    } catch (err) {
      console.error(err);
      if (resultEl) resultEl.textContent = 'Correo o contraseña incorrectos (o backend no disponible).';
    }
  });
}
