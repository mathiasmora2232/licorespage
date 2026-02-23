# 🏗️ ARQUITECTURA DEL PROYECTO MEJORADO

## Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
│         HTML5 + TypeScript + CSS3                               │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  UI Layer                                            │       │
│  │  - login.html                                        │       │
│  │  - productos.html                                    │       │
│  │  - cuenta.html                                       │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  TS/APIs                                             │       │
│  │  - ApiClient (HTTP + Auth)                          │       │
│  │  - AuthManager (Estado)                             │       │
│  │  - ProductoService (CRUD)                           │       │
│  │  - Helpers (Validación, Formato)                    │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                             ↓↑ HTTP REST + JWT
                        (Port 8081)
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Spring Boot)                        │
│                    Java 17 + Spring 3.5.6                        │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Controller Layer          (@RestController)        │       │
│  │  ├─ AuthController                                  │       │
│  │  │  ├─ POST /auth/login (LoginRequest)             │       │
│  │  │  ├─ GET /auth/me (Protected)                    │       │
│  │  │  └─ POST /auth/register (User)                  │       │
│  │  │                                                   │       │
│  │  └─ ProductoController                             │       │
│  │     ├─ GET /productos                              │       │
│  │     ├─ GET /productos/{id}                         │       │
│  │     ├─ POST /productos (ADMIN)                     │       │
│  │     ├─ PUT /productos/{id} (ADMIN)                 │       │
│  │     └─ DELETE /productos/{id} (ADMIN)              │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Service Layer             (@Service, @Transactional)│      │
│  │  ├─ AuthService                                     │       │
│  │  │  ├─ authenticate(email, password)               │       │
│  │  │  ├─ createTokenForUser(user) → JWT              │       │
│  │  │  └─ getUserForToken(token) → User               │       │
│  │  │                                                   │       │
│  │  └─ ProductoService                                │       │
│  │     ├─ getAllProductos()                           │       │
│  │     ├─ getProductoById(id)                         │       │
│  │     ├─ createProducto(dto)                         │       │
│  │     ├─ updateProducto(id, dto)                     │       │
│  │     └─ deleteProducto(id)                          │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  DTO Layer (Data Transfer Objects)                 │       │
│  │  ├─ LoginRequest                                    │       │
│  │  ├─ AuthResponse                                    │       │
│  │  ├─ ProductoResponse                                │       │
│  │  ├─ UserResponse                                    │       │
│  │  └─ ApiResponse<T>                                  │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Model Layer (@Entity, @Validated)                 │       │
│  │  ├─ User                                            │       │
│  │  │  ├─ @Email @NotBlank @Size                      │       │
│  │  │  └─ BCrypt Password                             │       │
│  │  │                                                   │       │
│  │  └─ Producto                                       │       │
│  │     ├─ @NotBlank @DecimalMin                       │       │
│  │     ├─ Stock @Min(0)                               │       │
│  │     └─ Auto timestamps                             │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Repository Layer (JPA/Hibernate)                  │       │
│  │  ├─ UserRepository                                  │       │
│  │  │  └─ findByEmail(email)                          │       │
│  │  │                                                   │       │
│  │  └─ ProductoRepository                             │       │
│  │     ├─ findByCategoria(categoria)                  │       │
│  │     ├─ buscarPorNombre(nombre)                     │       │
│  │     └─ findProductosEnStock()                      │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Cross-Cutting Concerns                            │       │
│  │  ├─ SecurityConfig (@Configuration)                │       │
│  │  │  ├─ JWT Token validation                        │       │
│  │  │  ├─ CORS Policy                                 │       │
│  │  │  └─ Password Encoder (BCrypt)                   │       │
│  │  │                                                   │       │
│  │  ├─ GlobalExceptionHandler (@RestControllerAdvice)│       │
│  │  │  ├─ EntityNotFoundException                      │       │
│  │  │  ├─ UnauthorizedException                        │       │
│  │  │  ├─ InvalidInputException                        │       │
│  │  │  └─ ValidationException                          │       │
│  │  │                                                   │       │
│  │  └─ Logging (SLF4J + Logback)                       │       │
│  │     └─ DEBUG logs en desarrollo                    │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                             ↓↑ JDBC Connection Pool
                        (Hikari - 10 conexiones)
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (PostgreSQL)                    │
│                      Docker Container                            │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  app_user (TABLE)                                   │       │
│  │  ├─ id (PK, SERIAL)                                │       │
│  │  ├─ email (UNIQUE, NOT NULL, VARCHAR)              │       │
│  │  ├─ password (NOT NULL, VARCHAR - BCrypt)          │       │
│  │  ├─ name (VARCHAR)                                  │       │
│  │  ├─ roles (TEXT - CSV)                             │       │
│  │  ├─ created_at (TIMESTAMP, DEFAULT NOW())          │       │
│  │  └─ updated_at (TIMESTAMP, DEFAULT NOW())          │       │
│  │                                                      │       │
│  │  producto (TABLE)                                   │       │
│  │  ├─ id (PK, SERIAL)                                │       │
│  │  ├─ nombre (NOT NULL, VARCHAR, INDEX)              │       │
│  │  ├─ descripcion (TEXT)                             │       │
│  │  ├─ precio (DECIMAL NOT NULL CHECK > 0)            │       │
│  │  ├─ imagen_url (VARCHAR)                           │       │
│  │  ├─ categoria (NOT NULL, VARCHAR, INDEX)           │       │
│  │  ├─ stock (INT DEFAULT 0)                          │       │
│  │  ├─ created_at (TIMESTAMP, DEFAULT NOW())          │       │
│  │  └─ updated_at (TIMESTAMP, DEFAULT NOW())          │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Flujo de Autenticación (JWT)

```
1. USUARIO HACE LOGIN
   └─► POST /api/auth/login { email, password }

2. BACKEND VALIDA
   └─► AuthService.authenticate(email, password)
       ├─► Busca usuario por email
       ├─► Verifica password con BCrypt
       └─► Si válido, continúa...

3. GENERA JWT TOKEN
   └─► AuthService.createTokenForUser(user)
       ├─► Crea payload con: { userId, email, name, roles }
       ├─► Firma con SECRET_KEY usando HS256
       ├─► Agrega expiración (24h)
       └─► Retorna token

4. CLIENTE ALMACENA TOKEN
   └─► localStorage.setItem('authToken', token)

5. CLIENTE HACE PETIÇÃO PROTEGIDA
   └─► GET /api/auth/me
       ├─► Header: Authorization: Bearer <token>
       └─► Envía request

6. BACKEND VALIDA TOKEN
   └─► SecurityConfig intercepta request
       ├─► Extrae token del header
       ├─► Verifica firma con SECRET_KEY
       ├─► Si expiró, rechaza ❌
       ├─► Si inválido, rechaza ❌
       ├─► Si válido, continúa ✓
       └─► Obtiene userId del payload

7. BACKEND EJECUTA OPERACIÓN
   └─► AuthService.getUserForToken(token)
       ├─► Decodifica JWT
       ├─► Obtiene userId
       ├─► Busca User en BD
       └─► Retorna User

8. RESPUESTA AL CLIENTE
   ├─► Datos + JWT seguros ✓
   └─► Si token expira, cliente hace login nuevamente
```

---

## 📊 Flujo de Petición GET Productos

```
1. CLIENTE: GET /api/productos

2. SPRING SECURITY
   ├─► CORS: Verifica origen ✓
   ├─► No autenticado requerido (permitAll)
   └─► Continúa

3. DISPATCHER: Enruta a ProductoController

4. CONTROLLER: getAllProductos()
   └─► Llama ProductoService.getAllProductos()

5. SERVICE: getAllProductos()
   └─► Llama ProductoRepository.findAll()

6. REPOSITORY: findAll()
   ├─► Genera SQL: SELECT * FROM producto
   ├─► Ejecuta en PostgreSQL
   └─► Retorna List<Producto>

7. MAPPING: Producto → ProductoResponse
   └─► Mapea cada Producto a DTO

8. CONTROLLER WRAPS RESPONSE
   └─► ApiResponse<List<ProductoResponse>> {
         success: true,
         message: "Productos obtenidos exitosamente",
         data: [...],
         timestamp: "2024-02-14T10:30:00Z"
       }

9. JSON SERIALIZATION
   └─► Jackson convierte a JSON

10. CLIENTE RECIBE
    └─► Response HTTP 200 OK + JSON body
```

---

## 🔄 Flujo de Crear Producto (ADMIN)

```
1. CLIENTE: POST /api/productos
   Header: Authorization: Bearer <jwt_token>
   Body: { nombre, precio, categoria, stock, ... }

2. SPRING SECURITY
   ├─► Extrae token del header ✓
   ├─► Valida firma JWT ✓
   ├─► Obtiene User del token ✓
   ├─► Verifica roles contiene "ADMIN" ✓
   └─► Si no es ADMIN → 403 Forbidden ❌

3. REQUEST BODY VALIDATION
   ├─► Deserializa JSON a Producto
   ├─► Aplica @Valid annotations
   ├─► Si error en validación → 400 Bad Request ❌
   └─► Si válido → continúa ✓

4. CONTROLLER: createProducto()
   └─► isAdmin() verifica JWT es válido ✓

5. SERVICE: createProducto(producto)
   ├─► Valida reglas de negocio
   │   ├─► precio > 0 ✓
   │   ├─► stock >= 0 ✓
   │   └─► nombre no vacío ✓
   └─► Continúa

6. REPOSITORY: save(producto)
   ├─► JPA crea SQL INSERT
   ├─► TRIGGER SetUpdatedAt ejecuta
   ├─► @PrePersist: setea created_at, updated_at
   ├─► INSERTAR en tabla producto
   └─► Retorna Producto con ID generado

7. RESPONSE MAPPING
   ├─► Producto → ProductoResponse (DTO)
   └─► Wrap en ApiResponse<ProductoResponse>

8. CLIENTE RECIBE
   └─► HTTP 201 Created + ubicación en header + JSON
```

---

## 📦 Stack Tecnológico

```
FRONTEND
├─ HTML5
├─ CSS3 (módular)
├─ TypeScript 5.1 (tipado fuerte)
├─ esbuild (bundling rápido)
└─ APIs
   ├─ Fetch API (HTTP requests)
   └─ LocalStorage API (persistencia)

BACKEND
├─ Java 17
├─ Spring Boot 3.5.6
│  ├─ spring-boot-starter-web (REST)
│  ├─ spring-boot-starter-security (Auth)
│  ├─ spring-boot-starter-data-jpa (ORM)
│  └─ spring-boot-starter-validation (Validación)
├─ JJWT 0.12.3 (JWT tokens)
├─ Lombok (boilerplate reduction)
└─ SLF4J + Logback (logging)

DATABASE
├─ PostgreSQL 16 (relacional, ACID)
├─ Hibernate (ORM)
└─ HikariCP (connection pooling)

INFRASTRUCTURE
├─ Docker (containerization)
│  ├─ Multi-stage builds
│  └─ Health checks
├─ Docker Compose (orchestration)
└─ Linux Alpine (images minimalistas)
```

---

## 🔒 Capas de Seguridad

```
┌─ CAPA 1: TRANSPORT
│  └─ HTTPS (en producción)
│     └─ Encripta datos en tránsito

├─ CAPA 2: AUTHENTICATION
│  ├─ JWT Token con firma HS256
│  ├─ Expiración de tokens
│  └─ Revocación posible

├─ CAPA 3: AUTHORIZATION
│  ├─ Roles: USER, ADMIN
│  ├─ RBAC (Role-Based Access Control)
│  └─ @PreAuthorize annotations

├─ CAPA 4: VALIDATION
│  ├─ Input validation (@Valid)
│  ├─ Type checking (TypeScript)
│  └─ Business rule validation

├─ CAPA 5: ENCRYPTION
│  ├─ Passwords: BCrypt variante 12
│  ├─ Sensitive data: en tránsito encriptada
│  └─ Never log sensitive data

└─ CAPA 6: AUDIT
   ├─ Logging centralizado
   ├─ Timestamps en BD
   └─ Trazabilidad de operaciones
```

---

## 📈 Escalabilidad

```
Escala Vertical (actual)
└─ Aumentar recursos de servidor

Próximas mejoras para escalar:
├─ Redis Cache (sesiones distribuidas)
├─ Load Balancer (nginx)
├─ Replicas de BD (master-slave)
├─ Microservicios (split services)
├─ Message Queue (RabbitMQ)
└─ CDN (CloudFront, Cloudflare)
```

---

## 🧪 Testabilidad

```
Layers testables:
├─ Service layer (lógica de negocio)
├─ Controller layer (endpoints)
├─ Repository layer (queries)
├─ Frontend Utils (helpers)
└─ Validators (reglas)

Example:
public void testCreateProducto() {
  // Arrange
  Producto p = new Producto("Cerveza", 5.99, "Cervezas", 50);
  
  // Act
  Producto saved = productoService.createProducto(p);
  
  // Assert
  assertNotNull(saved.getId());
  assertEquals(p.getNombre(), saved.getNombre());
}
```

---

Este archivo define la arquitectura y flujos del proyecto mejorado.
Para más detalles, consulta `README.md` o `API_DOCUMENTATION.md`.
