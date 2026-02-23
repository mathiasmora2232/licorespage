# Frontend API Documentation

## 📚 Available APIs

### 1. **ApiClient** - HTTP Client Principal

```typescript
import { apiClient } from './api/client';

// GET request
const response = await apiClient.get<Producto[]>('/api/productos');

// POST request
const response = await apiClient.post<AuthResponse>('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// PUT request
const response = await apiClient.put<Producto>(`/api/productos/${id}`, {
  nombre: 'New name',
  precio: 29.99
});

// DELETE request
await apiClient.delete(`/api/productos/${id}`);
```

### 2. **Auth Manager** - Autenticación

```typescript
import { authManager, isUserAdmin, isUserAuthenticated } from './api/auth';

// Login
const authResponse = await authManager.login('email@example.com', 'password123');

// Check auth status
if (isUserAuthenticated()) {
  console.log('User is logged in');
}

// Check admin role
if (isUserAdmin()) {
  console.log('User is admin');
}

// Get current state
const state = authManager.getState();
console.log(state.user); // User object

// Subscribe to auth changes
const unsubscribe = authManager.subscribe((state) => {
  console.log('Auth state changed:', state);
});

// Logout
authManager.logout();
```

### 3. **Producto Service** - Gestión de Productos

```typescript
import { productoService } from './api/productos';

// Get all products
const productos = await productoService.getAllProductos();

// Get product by ID
const producto = await productoService.getProductoById(1);

// Filter by category
const cervezas = await productoService.getProductosByCategoria('Cervezas');

// Create product (admin only)
const newProducto = await productoService.createProducto({
  nombre: 'Nueva Cerveza',
  precio: 4.99,
  categoria: 'Cervezas',
  stock: 100
});

// Update product (admin only)
const updated = await productoService.updateProducto(1, {
  precio: 5.99
});

// Delete product (admin only)
await productoService.deleteProducto(1);
```

### 4. **Utilities** - Funciones de Utilidad

```typescript
import {
  NotificationService,
  FormValidator,
  StorageService,
  formatPrice,
  formatDate,
  debounce,
  throttle
} from './utils/helpers';

// Notifications
NotificationService.success('Operación completada');
NotificationService.error('Error al procesar');
NotificationService.info('Información importante');

// Form validation
FormValidator.isEmail('user@example.com'); // true
FormValidator.isStrongPassword('Abc123456'); // true
FormValidator.isEmpty(''); // true

// Local Storage
StorageService.setItem('cart', cartItems);
const cart = StorageService.getItem('cart');
StorageService.removeItem('cart');
StorageService.clear();

// Formatting
formatPrice(29.99); // "29,99 €"
formatDate('2024-02-14'); // "14 de febrero de 2024"

// Performance utilities
const debouncedSearch = debounce((query: string) => {
  // Search API call
}, 500);

const throttledScroll = throttle(() => {
  // Scroll handler
}, 200);
```

## 🔐 Error Handling

```typescript
import { ApiClient, ApiError } from './api/client';

try {
  const response = await apiClient.get('/api/productos');
} catch (err) {
  if (err instanceof ApiError) {
    console.error(`HTTP ${err.status}: ${err.message}`);
    console.error('Response data:', err.data);
  }
}
```

## 📝 Complete Example - Login Page

```typescript
import { authManager } from './api/auth';
import { NotificationService, FormValidator } from './utils/helpers';

class LoginPage {
  private form: HTMLFormElement | null;
  private emailInput: HTMLInputElement | null;
  private passwordInput: HTMLInputElement | null;

  constructor() {
    this.form = document.getElementById('loginForm') as HTMLFormElement;
    this.emailInput = document.getElementById('email') as HTMLInputElement;
    this.passwordInput = document.getElementById('password') as HTMLInputElement;

    this.form?.addEventListener('submit', (e) => this.handleSubmit(e));

    // Check if already logged in
    if (authManager.isAuthenticated()) {
      window.location.href = '/cuenta.html';
    }
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const email = this.emailInput?.value || '';
    const password = this.passwordInput?.value || '';

    if (!FormValidator.isEmail(email)) {
      NotificationService.error('Email inválido');
      return;
    }

    try {
      await authManager.login(email, password);
      NotificationService.success('Inicio de sesión exitoso');
      window.location.href = '/cuenta.html';
    } catch (err: any) {
      NotificationService.error(err.message || 'Error al iniciar sesión');
    }
  }
}

new LoginPage();
```

## 📁 Project Structure

```
frontend/
├── ts/
│   ├── api/
│   │   ├── client.ts       # Main HTTP client
│   │   ├── auth.ts         # Auth manager
│   │   └── productos.ts    # Products service
│   ├── utils/
│   │   └── helpers.ts      # Utilities and validators
│   ├── login.ts            # Login page logic
│   ├── productos.ts        # Products page logic
│   └── admin/
│       └── products.ts     # Admin products page
├── css/
│   ├── nav.css
│   ├── pages.css
│   └── ...
├── js/
│   └── ... (legacy scripts)
├── dist/                   # Compiled output
├── package.json
├── tsconfig.json
└── index.html
```

## 🚀 Building and Running

```bash
# Install dependencies
npm install

# Development - Watch for changes
npm run dev

# Build for production
npm run build

# Type checking
npm run lint
```

---

**Note**: All API responses follow the `ApiResponse<T>` interface with:
- `success` - boolean indicating success
- `message` - Human-readable message
- `data` - Actual response data
- `timestamp` - Server timestamp
- `path` - Request path
