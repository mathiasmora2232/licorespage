# 🚀 QUICK REFERENCE - Referencia Rápida

## ⚡ Comandos Esenciales

### Docker
```bash
# Iniciar servicios
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f backend

# Parar
docker-compose stop

# Parar y eliminar todo
docker-compose down -v

# Rebuild
docker-compose build --no-cache
```

### Frontend
```bash
cd frontend

# Instalar deps
npm install

# Compilar y bundlear
npm run build

# Watch mode (desarrollo)
npm run watch

# Development completo
npm run dev

# Lint TypeScript
npm run lint
```

### Backend
```bash
cd backend/productos/productos

# Build
mvn clean install

# Build sin tests
mvn clean install -DskipTests

# Ejecutar localmente
mvn spring-boot:run

# Solo compilar
mvn compile

# Ver test coverage
mvn clean test -Dgroups=coverage
```

### Database
```bash
# Conectar a PostgreSQL
docker exec -it licores_db psql -U postgres -d licores

# Comandos SQL útiles (dentro de psql)
\dt                          # Ver tablas
\d app_user                  # Ver estructura
\d+ producto                 # Ver estructura con detalles
SELECT * FROM app_user;      # Ver usuarios
SELECT * FROM producto;      # Ver productos
\q                          # Salir
```

---

## 🔌 API Quick Reference

### Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Get Productos (sin auth)
```bash
curl http://localhost:8081/api/productos | jq
```

### Get Producto Detail
```bash
curl http://localhost:8081/api/productos/1 | jq
```

### Filter by Category
```bash
curl http://localhost:8081/api/productos/categoria/Cervezas | jq
```

### Create Producto (con auth, ADMIN)
```bash
TOKEN="tu_token_aqui"
curl -X POST http://localhost:8081/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Cerveza Premium",
    "descripcion": "IPA artesanal",
    "precio": 6.99,
    "categoria": "Cervezas",
    "stock": 100,
    "imagen": "https://example.com/img.jpg"
  }' | jq
```

### Update Producto (con auth, ADMIN)
```bash
TOKEN="tu_token_aqui"
curl -X PUT http://localhost:8081/api/productos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Cerveza Premium Updated",
    "precio": 7.99
  }' | jq
```

### Delete Producto (con auth, ADMIN)
```bash
TOKEN="tu_token_aqui"
curl -X DELETE http://localhost:8081/api/productos/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Get Current User
```bash
TOKEN="tu_token_aqui"
curl http://localhost:8081/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📝 Frontend Code Snippets

### Import Classes
```typescript
import { apiClient } from './api/client';
import { authManager, isUserAdmin } from './api/auth';
import { productoService } from './api/productos';
import { NotificationService, FormValidator } from './utils/helpers';
```

### Login Example
```typescript
try {
  const auth = await authManager.login(email, password);
  console.log('Token:', auth.token);
  window.location.href = '/cuenta.html';
} catch(err) {
  NotificationService.error(err.message);
}
```

### Get All Productos
```typescript
const productos = await productoService.getAllProductos();
console.log(productos);
```

### Create Producto
```typescript
const nuevo = await productoService.createProducto({
  nombre: "Nueva Cerveza",
  precio: 5.99,
  categoria: "Cervezas",
  stock: 50
});
```

### Validate Form
```typescript
if (!FormValidator.isEmail(email)) {
  NotificationService.error('Email inválido');
  return;
}

if (!FormValidator.isStrongPassword(password)) {
  NotificationService.error('Password débil');
  return;
}
```

### Format Price
```typescript
import { formatPrice, formatDate } from './utils/helpers';

console.log(formatPrice(29.99));  // "29,99 €"
console.log(formatDate('2024-02-14'));  // "14 de febrero de 2024"
```

### Debounce vs Throttle
```typescript
const debouncedSearch = debounce((query: string) => {
  productoService.getAllProductos(); // se ejecuta 500ms después del último keystroke
}, 500);

const throttledScroll = throttle(() => {
  console.log('Scrolled'); // se ejecuta máx cada 200ms
}, 200);
```

---

## 🔑 Configuración

### Variables de Entorno
```properties
# backend/productos/productos/.env o application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/licores
spring.datasource.username=postgres
spring.datasource.password=Tu_contraseña
jwt.secret=your-super-secret-key
jwt.expiration=86400000
```

### Docker Compose Override
```yaml
# docker-compose.override.yml (para desarrollo local)
version: '3.8'
services:
  backend:
    ports:
      - "8080:8081"  # Puerto diferente
    environment:
      JAVA_OPTS: "-Xmx1g"  # Más memoria
```

---

## 🐛 Debugging

### Ver SQL Queries (backend)
```properties
# application.properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### Verificar JWT Token
```javascript
// En browser console
const token = localStorage.getItem('authToken');
// Decode (en jwt.io o en code):
const parts = token.split('.');
console.log(JSON.parse(atob(parts[1])));  // Payload
```

### Check PostgreSQL Connection
```bash
# From host
nc -zv localhost 5432

# From container
docker exec licores_db pg_isready
```

---

## 📊 Directory Structure Quick Map

```
licorespage/
├── README.md                    # 📖 Doc principal
├── QUICKSTART.md               # ⚡ Quick setup
├── CHANGELOG.md                # 📝 Historial
├── IMPROVEMENTS_SUMMARY.md     # ✨ Mejoras
├── ARCHITECTURE.md             # 🏗️ Arquitectura
├── docker-compose.yml          # 🐳 Docker
├── .gitignore                  # Git config
│
├── backend/productos/productos/
│   ├── pom.xml                 # Maven config
│   ├── Dockerfile              # Build backend
│   ├── .env.example            # Env ref
│   └── src/main/java/com/ventas/productos/
│       ├── ProductosApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   └── DataInitializer.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── ProductoController.java
│       │   └── HealthController.java
│       ├── service/
│       │   ├── AuthService.java
│       │   └── ProductoService.java
│       ├── model/
│       │   ├── User.java
│       │   └── Producto.java
│       ├── dto/
│       │   ├── LoginRequest.java
│       │   ├── AuthResponse.java
│       │   ├── ProductoResponse.java
│       │   ├── UserResponse.java
│       │   └── ApiResponse.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   └── ProductoRepository.java
│       ├── exception/
│       │   ├── GlobalExceptionHandler.java
│       │   ├── EntityNotFoundException.java
│       │   ├── UnauthorizedException.java
│       │   └── InvalidInputException.java
│       └── resources/
│           └── application.properties
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── API_DOCUMENTATION.md
    ├── ts/
    │   ├── api/
    │   │   ├── client.ts
    │   │   ├── auth.ts
    │   │   └── productos.ts
    │   ├── utils/
    │   │   └── helpers.ts
    │   ├── login.ts
    │   ├── productos.ts
    │   ├── auth.ts
    │   └── admin/products.ts
    ├── css/
    ├── js/
    ├── dist/         # Generated
    └── *.html
```

---

## ✅ Checklist de Desarrollo

### Antes de Commitear
- [ ] Tests pasando
- [ ] Formateo de código
- [ ] Sin warnings en build
- [ ] Actualizar CHANGELOG.md

### Antes de Deploy
- [ ] Tests completos corren OK
- [ ] Build sin errores
- [ ] Env variables configuradas
- [ ] BD migrada
- [ ] Logs revisados

### En Producción  
- [ ] SSL/TLS habilitado
- [ ] Backup de BD scheduled
- [ ] Monitoring activo
- [ ] Alertas configuradas

---

## 🆘 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Port 8081 en uso | `docker-compose down` o cambiar puerto |
| BD no inicia | `docker-compose logs postgres` |
| JWT inválido | Token expiró, hacer login nuevamente |
| CORS error | Verificar `SecurityConfig.java` |
| TypeError en TS | Usar `npm run lint` para detectar |
| Build falla | `mvn clean install -DskipTests` |
| No hay datos | Verificar `DataInitializer.java` |
| Password incorrecto | BCrypt en BD, no plain text |

---

## 📞 Recursos

- **JWT.io**: Decodificar tokens
- **Postman**: Probar APIs
- **StackOverflow**: Debugging
- **Spring Docs**: spring.io
- **TypeScript Docs**: typescriptlang.org

---

**Última actualización**: 14 Feb 2026
