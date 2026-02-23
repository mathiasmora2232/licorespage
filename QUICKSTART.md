# 🚀 Guía de Inicio Rápido - Licores Page

## ⚡ 5 Minutos para Ejecutar el Proyecto

### Requisito: Docker Instalado

Si no tienes Docker, descárgalo desde [docker.com](https://www.docker.com/products/docker-desktop)

### Paso 1: Colócate en el Directorio del Proyecto

```bash
cd /path/to/licorespage
```

### Paso 2: Inicia los Servicios

```bash
docker-compose up -d
```

Esto iniciará:
- ✅ PostgreSQL en puerto 5432
- ✅ Backend Spring Boot en puerto 8081

### Paso 3: Espera a que Todo Esté Listo (≈30 segundos)

```bash
# Ver logs en tiempo real (opcional)
docker-compose logs -f backend
```

### Paso 4: Prueba la API

Abre en tu navegador o usa `curl`:

```bash
# Obtener todos los productos
curl http://localhost:8081/api/productos

# Respuesta exitosa:
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [...]
}
```

---

## 🔐 Pruebas de Autenticación

### 1. Inicia Sesión

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Respuesta:
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "email": "admin@example.com",
    "name": "Administrador",
    "roles": "ADMIN",
    "userId": 1,
    "expiresIn": 86400000
  }
}
```

### 2. Usa el Token para Crear un Producto (Admin Only)

```bash
curl -X POST http://localhost:8081/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nombre": "Cerveza Artesanal",
    "descripcion": "Cerveza premium IPA",
    "precio": 5.99,
    "categoria": "Cervezas",
    "stock": 100,
    "imagen": "https://example.com/cerveza.jpg"
  }'
```

---

## 📁 Estructura de Carpetas

```
licorespage/
├── backend/
│   └── productos/productos/      # Spring Boot Application
├── frontend/                      # HTML + TypeScript
├── docker-compose.yml            # Orquestación de servicios
└── README.md                      # Documentación completa
```

---

## 🛑 Detener los Servicios

```bash
# Detener pero mantener datos
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar TODO (incluido BD)
docker-compose down -v
```

---

## 📝 Logs

```bash
# Ver logs del backend
docker-compose logs backend

# Ver logs en tiempo real
docker-compose logs -f backend

# Ver logs de PostgreSQL
docker-compose logs -f postgres
```

---

## 🔧 Solución de Problemas

### Error: "Port already in use"
```bash
# Opción 1: Cambiar puerto en docker-compose.yml
# Cambiar puerto de 8081:8081 a 8080:8081

# Opción 2: Eliminar contenedor existente
docker-compose down
docker system prune
docker-compose up -d
```

### Error: "Connection refused" a PostgreSQL
```bash
# Verificar estado de los contenedores
docker-compose ps

# Reiniciar servicios
docker-compose restart

# Revisar logs
docker-compose logs postgres
```

### El backend no inicia
```bash
# Ver logs detallados
docker-compose logs backend

# Rebuildar la imagen
docker-compose build --no-cache
docker-compose up -d
```

---

## 🎯 Próximos Pasos

### 1️⃣ Explorar la API
- Visita [localhost:8081](http://localhost:8081) 
- Prueba endpoints con Postman o Thunder Client (extensiones de VS Code)

### 2️⃣ Ver Documentación Completa
- Lee `README.md` para arquitectura y features
- Consulta `CHANGELOG.md` para ver todas las mejoras
- Lee `frontend/API_DOCUMENTATION.md` para uso del frontend

### 3️⃣ Modificar Base de Datos
```bash
# Conectar a PostgreSQL
docker exec -it licores_db psql -U postgres -d licores

# Ver tablas
\dt

# Ver estructura de tabla
\d app_user
```

### 4️⃣ Hacer Cambios en el Backend
```bash
# El cambio se refleja automáticamente (hot reload)
# Edita *.java y guarda
# El contenedor recompila automáticamente

# Si no funciona, rebuilda manualmente
docker-compose rebuild
docker-compose up -d
```

### 5️⃣ Desarrollo del Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Compilar TypeScript y bundlear
npm run build

# Ver cambios en tiempo real
npm run watch
```

---

## 💡 Trucos Útiles

### Crear productos de prueba rápidamente

```bash
TOKEN="tu_token_aqui"

# Cerveza
curl -X POST http://localhost:8081/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre": "Heineken", "precio": 4.99, "categoria": "Cervezas", "stock": 50}'

# Vino
curl -X POST http://localhost:8081/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre": "Rioja Reserva", "precio": 12.99, "categoria": "Vinos", "stock": 30}'
```

### Ver toda la información del usuario autenticado

```bash
curl -X GET http://localhost:8081/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filtrar productos por categoría

```bash
curl http://localhost:8081/api/productos/categoria/Cervezas
```

---

## 📚 Recursos Adicionales

- **Backend Documentation**: Ver `backend/productos/productos/README.md`
- **Frontend API Client**: Ver `frontend/API_DOCUMENTATION.md`
- **Full Project README**: Ver `README.md`
- **All Changes**: Ver `CHANGELOG.md`

---

## ✅ Checklist de Setup Completado

- [ ] Docker instalado
- [ ] `docker-compose up -d` ejecutado exitosamente
- [ ] Backend accesible en http://localhost:8081
- [ ] PostgreSQL en puerto 5432
- [ ] Login probado
- [ ] Token JWT funcionando
- [ ] Operaciones CRUD de productos funcionando

---

## 🎓 Aprende Más

### Sobre JWT
Los tokens JWT son:
- **J**SON **W**eb **T**okens
- Sin estado (Stateless)
- Seguros y firmados
- Expiran automáticamente
- Perfectos para APIs REST

### Sobre Docker
- Contenerización de aplicaciones
- Aislamiento de servicios
- Reproducibilidad en cualquier máquina
- Escalabilidad fácil

### Sobre Spring Boot
- Framework moderno de Java
- RAD (Rapid Application Development)
- Convención sobre configuración
- Excelente para APIs REST

---

**¡Felicidades! 🎉 Tu plataforma de e-commerce está lista!**

Para continuar, lee el `README.md` completo para funcionalidades avanzadas.
