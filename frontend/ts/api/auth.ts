/**
 * Authentication utilities
 */
import { apiClient, AuthResponse } from './client';

export interface User {
  id: number;
  email: string;
  name: string;
  roles: string;
  createdAt?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}

class AuthManager {
  private state: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    error: null,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = apiClient.getToken();
    if (token) {
      this.state.token = token;
      this.state.isAuthenticated = true;
      this.loadCurrentUser();
    }
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      const user = await apiClient.getCurrentUser<User>();
      this.state.user = user;
      this.notifyListeners();
    } catch (err) {
      console.error('Error loading current user:', err);
      this.logout();
    }
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      this.state.error = null;
      const response = await apiClient.login(email, password);

      this.state.token = response.token;
      this.state.isAuthenticated = true;

      // Load user data
      await this.loadCurrentUser();

      return response;
    } catch (err: any) {
      this.state.error = err.message || 'Login failed';
      this.state.isAuthenticated = false;
      throw err;
    }
  }

  public logout(): void {
    apiClient.logout();
    this.state = {
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
    };
    this.notifyListeners();
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  public isAdmin(): boolean {
    return this.state.user?.roles?.includes('ADMIN') || false;
  }

  public isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getState()));
  }
}

export const authManager = new AuthManager();

// Utility functions
export function isUserAdmin(): boolean {
  return authManager.isAdmin();
}

export function isUserAuthenticated(): boolean {
  return authManager.isAuthenticated();
}

export function getCurrentUser(): AuthState['user'] {
  return authManager.getState().user;
}

export function getAuthToken(): string | null {
  return authManager.getState().token;
}
