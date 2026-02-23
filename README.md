# 🍺 Licores Page - E-Commerce Platform

## 📋 Descripción del Proyecto

Plataforma moderna de e-commerce para la venta de bebidas alcohólicas, desarrollada con:
- **Backend**: Spring Boot 3.5.6 con Java 17, PostgreSQL, JWT Authentication
- **Frontend**: TypeScript, HTML5, CSS3

## 📈 Mejoras Realizadas

### Backend - Seguridad & Autenticación
✅ **JWT Token-based Authentication** - Reemplazó sistema de tokens en memoria
✅ **Validaciones de Entrada** - Todas las entidades tienen validaciones @Valid
✅ **Exception Handling Global** - Manejo centralizado de excepciones
✅ **CORS Mejorado** - Solo localhost permitido
✅ **Password Encryption** - BCrypt con variante 12
✅ **Stateless Sessions** - Mejor escalabilidad

### Backend - Arquitectura & Código
✅ **DTOs Implementados** - Separación clara entre modelo y API
✅ **Capa de Servicios** - Lógica de negocio centralizada
✅ **Lombok Integration** - Reducción de boilerplate 80%
✅ **Logging Estructurado** - SLF4J en todos los componentes
✅ **Transaccional** - Anotaciones @Transactional en servicios
✅ **Índices de BD** - Optimización de queries

### Backend - Base de Datos
✅ **Timestamps Automáticos** - createdAt, updatedAt en todas las entidades
✅ **Stock Management** - Control de inventario
✅ **Búsqueda Mejorada** - Queries personalizadas para categoría y búsqueda por nombre
✅ **Validaciones a Nivel BD** - Constraints en la base de datos

### Infraestructura
✅ **Docker Containerization** - Dockerfile multi-stage optimizado
✅ **Docker Compose** - Stack completo con PostgreSQL
✅ **Health Checks** - Verificación de salud de servicios
✅ **Volúmenes Persistentes** - Datos de BD persistentes

### Development & Build
✅ **Agregadas Dependencias JWT** - JJWT 0.12.3
✅ **Testing Framework** - JUnit 5
✅ **Maven Optimizado** - Configuración de compiler con Lombok

### Frontend
✅ **TypeScript Configuration** - Configuración mejorada
✅ **Build Pipeline** - esbuild para bundling

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos Previos
- Docker y Docker Compose instalados
- O alternativamente:
  - Java 17+
  - Maven 3.9+
  - PostgreSQL 15+
  - Node.js 18+ (para frontend)

### Opción 1: Con Docker Compose (RECOMENDADO)

```bash
# Navega al directorio raíz del proyecto
cd /path/to/licorespage

# Inicia los servicios
docker-compose up -d

# Backend está disponible en http://localhost:8081
# PostgreSQL disponible en localhost:5432
```

### Opción 2: Ejecución Local

#### Backend
```bash
cd backend/productos/productos

# Asegúrate que PostgreSQL esté corriendo en localhost:5432
# y la BD "licores" exista

mvn clean install
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend

npm install
npm run build
npm run watch  # Para desarrollo
```

## 📚 Endpoints API

### Autenticación
```
POST   /api/auth/login           - Login usuario
POST   /api/auth/register        - Registrar nuevo usuario
GET    /api/auth/me              - Info del usuario autenticado (requiere JWT)
```

### Productos
```
GET    /api/productos            - Listar todos los productos
GET    /api/productos/{id}       - Obtener producto por ID
GET    /api/productos/categoria/{categoria} - Filtrar por categoría
POST   /api/productos            - Crear producto (ADMIN)
PUT    /api/productos/{id}       - Actualizar producto (ADMIN)
DELETE /api/productos/{id}       - Eliminar producto (ADMIN)
```

## 🔐 Autenticación

1. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "admin@example.com",
     "password": "password123"
   }
   ```
   
2. Recibirás un JWT token
3. Incluye el token en headers: `Authorization: Bearer <token>`

## 📊 Estructura de Respuesta API

Todas las respuestas siguen este formato:
```json
{
  "success": true,
  "message": "Descripción de la operación",
  "data": { /* data object */ },
  "timestamp": "2024-02-14T10:30:00Z",
  "path": "/api/productos"
}
```

## 🗄️ Configuración de Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE licores;

-- Usuario por defecto
CREATE USER postgres WITH PASSWORD 'Lu246988';
GRANT ALL PRIVILEGES ON DATABASE licores TO postgres;
```

Las migraciones corren automáticamente con `spring.jpa.hibernate.ddl-auto=update`

## 🔧 Variables de Entorno

```properties
# JWT (cambiar en producción)
jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000 # 24 horas

# Datasource
spring.datasource.url=jdbc:postgresql://localhost:5432/licores
spring.datasource.username=postgres
spring.datasource.password=Tu_contraseña
```

## 📝 Modelos de Datos

### User
```java
id (Long) - ID único
email (String) - Email único
password (String) - Encriptada con BCrypt
name (String) - Nombre del usuario
roles (String) - CSV de roles: "USER,ADMIN"
createdAt (LocalDateTime)
updatedAt (LocalDateTime)
```

### Producto
```java
id (Long) - ID único
nombre (String) - Nombre del producto
descripcion (String) - Descripción
precio (Double) - Precio (validado > 0)
imagenUrl (String) - URL de imagen
categoria (String) - Categoría
stock (Integer) - Inventario disponible
createdAt (LocalDateTime)
updatedAt (LocalDateTime)
```

## 🧪 Testing

```bash
# Ejecutar tests
mvn test

# Con cobertura
mvn test -Dgroups=coverage
```

## 📦 Build para Producción

```bash
# Backend
mvn clean package

# Generar JAR
java -jar target/productos-0.0.1-SNAPSHOT.jar
```

## 🛠️ Mejoras Futuras Recomendadas

- [ ] Implementar Sistema de Órdenes/Carritos
- [ ] Integración con pasarela de pagos (Stripe/PayPal)
- [ ] Sistema de ratings y reseñas
- [ ] Notificaciones por email
- [ ] Caché Redis
- [ ] CDN para imágenes
- [ ] API Analytics
- [ ] Dashboard Admin mejorado
- [ ] Integración Elasticsearch
- [ ] CI/CD con GitHub Actions o GitLab CI

## 🐛 Troubleshooting

### Error: "Connection refused" en PostgreSQL
```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Reiniciar servicios
docker-compose restart
```

### Error: "Port already in use"
```bash
# Cambiar puerto en docker-compose.yml
# O eliminar contenedor existente
docker-compose down
docker-compose up -d
```

## 📄 Licencia

Proyecto de desarrollo interno - Todos los derechos reservados

## 👨‍💻 Equipo de Desarrollo

Mejoras realizadas con enfoque en:
- Seguridad moderna (JWT)
- Código limpio y mantenible
- Escalabilidad
- Conteneurización
- Best practices de Spring Boot

---

**Última actualización**: 14 de febrero de 2026
