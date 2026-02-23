/**
 * Common utilities for frontend
 */

export class NotificationService {
  private static showNotification(message: string, type: 'success' | 'error' | 'info', duration: number = 3000): void {
    const container = document.getElementById('notifications-container') || this.createContainer();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      padding: 15px 20px;
      margin: 10px 0;
      border-radius: 4px;
      color: white;
      background-color: ${this.getBackgroundColor(type)};
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
    `;

    container.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  private static createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'notifications-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
  }

  private static getBackgroundColor(type: 'success' | 'error' | 'info'): string {
    return {
      success: '#4CAF50',
      error: '#f44336',
      info: '#2196F3',
    }[type];
  }

  public static success(message: string, duration?: number): void {
    this.showNotification(message, 'success', duration);
  }

  public static error(message: string, duration?: number): void {
    this.showNotification(message, 'error', duration);
  }

  public static info(message: string, duration?: number): void {
    this.showNotification(message, 'info', duration);
  }
}

export class FormValidator {
  public static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static isStrongPassword(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }

  public static isEmpty(value: string): boolean {
    return !value || value.trim() === '';
  }

  public static getFieldErrors(fields: Record<string, string>): string[] {
    return Object.values(fields).filter((error) => !this.isEmpty(error));
  }
}

export class StorageService {
  public static setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }

  public static getItem<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return null;
    }
  }

  public static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Error removing from localStorage:', err);
    }
  }

  public static clear(): void {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}
