import { authManager } from './api/auth';
import { NotificationService, FormValidator } from './utils/helpers';

class LoginPage {
  private form: HTMLFormElement | null;
  private emailInput: HTMLInputElement | null;
  private passwordInput: HTMLInputElement | null;
  private submitButton: HTMLButtonElement | null;
  private isLoading: boolean = false;

  constructor() {
    this.form = document.getElementById('loginForm') as HTMLFormElement;
    this.emailInput = document.getElementById('login-email') as HTMLInputElement;
    this.passwordInput = document.getElementById('login-password') as HTMLInputElement;
    this.submitButton = this.form?.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Check if already logged in
    if (authManager.isAuthenticated()) {
      this.redirectAfterLogin();
    }
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (this.isLoading) return;

    const email = this.emailInput?.value.trim() || '';
    const password = this.passwordInput?.value || '';

    // Validate inputs
    if (!this.validateForm(email, password)) {
      return;
    }

    this.setLoading(true);

    try {
      await authManager.login(email, password);
      NotificationService.success('Iniciando sesión...');

      setTimeout(() => {
        this.redirectAfterLogin();
      }, 500);
    } catch (err: any) {
      NotificationService.error(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
      this.setLoading(false);
    }
  }

  private validateForm(email: string, password: string): boolean {
    const errors: string[] = [];

    if (!email) {
      errors.push('El email es requerido');
    } else if (!FormValidator.isEmail(email)) {
      errors.push('El email no es válido');
    }

    if (!password) {
      errors.push('La contraseña es requerida');
    }

    if (errors.length > 0) {
      NotificationService.error(errors[0]);
      return false;
    }

    return true;
  }

  private setLoading(loading: boolean): void {
    this.isLoading = loading;
    if (this.submitButton) {
      this.submitButton.disabled = loading;
      this.submitButton.textContent = loading ? 'Iniciando sesión...' : 'Iniciar sesión';
    }
  }

  private redirectAfterLogin(): void {
    const state = authManager.getState();
    if (state.user?.roles?.includes('ADMIN')) {
      window.location.href = 'admin/index.html';
    } else {
      window.location.href = 'cuenta.html';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LoginPage();
  });
} else {
  new LoginPage();
}
