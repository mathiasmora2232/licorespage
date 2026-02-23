/**
 * API Client - Manejo centralizado de llamadas HTTP
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
  path?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  roles: string;
  userId: number;
  expiresIn: number;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    this.loadToken();
  }

  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  public setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  public isAuthenticated(): boolean {
    return this.token !== null && this.token.length > 0;
  }

  private getHeaders(includeAuth: boolean = true, contentType: string = 'application/json'): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': contentType,
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError({
        message: errorData.message || `HTTP ${response.status}`,
        status: response.status,
        data: errorData,
      });
    }

    try {
      const data = await response.json();
      return data as ApiResponse<T>;
    } catch {
      throw new ApiError({
        message: 'Error parsing response',
        status: response.status,
      });
    }
  }

  public async get<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(true),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  public async post<T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  public async put<T = any>(
    endpoint: string,
    body: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(body),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  public async delete<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(true),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/api/auth/login', { email, password });
    if (response.data) {
      this.setToken(response.data.token);
      return response.data;
    }
    throw new TypeError('No auth data received');
  }

  public async getCurrentUser<T = any>(): Promise<T> {
    const response = await this.get<T>('/api/auth/me');
    return response.data!;
  }

  public logout(): void {
    this.clearToken();
  }
}

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor({ message, status, data }: { message: string; status: number; data?: any }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Singleton instance
export const apiClient = new ApiClient();
