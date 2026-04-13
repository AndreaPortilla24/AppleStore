# 🍎 AppleStore — Proyecto Académico

E-commerce inspirado en Apple Store con Spring Boot + React + MySQL.

---

## 🏗️ Arquitectura

```
applestore/
├── backend/          ← Spring Boot 3.2 (Java 17)
│   └── src/main/java/com/applestore/
│       ├── entity/         ← JPA Entities (7 tablas)
│       ├── repository/     ← Spring Data JPA
│       ├── controller/     ← REST Controllers
│       ├── security/       ← JWT Auth
│       ├── audit/          ← Servicio de auditoría
│       ├── dto/            ← Request/Response DTOs
│       ├── exception/      ← GlobalExceptionHandler
│       └── config/         ← SecurityConfig + DataInitializer
│
└── frontend/         ← React 18
    └── src/
        ├── api/            ← Axios services
        ├── context/        ← AuthContext + CartContext
        ├── components/     ← Reutilizables (Modal, Badges, etc.)
        ├── pages/
        │   ├── client/     ← Store, Checkout, Pedidos, Equipos, Servicios
        │   ├── admin/      ← Dashboard, Productos, Pedidos, Usuarios, Reportes, Auditoría
        │   └── employee/   ← Dashboard, Servicios, Asignaciones, Equipos, Pedidos
        └── App.js          ← Router con rutas protegidas
```

---

## 🗄️ Modelo Relacional

| Tabla | Descripción |
|-------|-------------|
| `Usuarios` | Clientes, empleados y administradores |
| `Productos` | Catálogo de productos Apple |
| `Pedidos` | Órdenes de compra o separado |
| `Detalles_pedido_producto` | Items de cada pedido |
| `Equipos_cliente` | Dispositivos registrados por clientes |
| `Solicitudes_servicios` | Solicitudes de reparación técnica |
| `Asignaciones_tecnico` | Asignación de técnicos a servicios |
| `Audit_log` | Registro de auditoría de procesos |

---

## ⚙️ Configuración

### 1. Requisitos previos

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

### 2. Base de datos

```sql
CREATE DATABASE applestore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend — application.properties

Editar `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/applestore_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD_AQUI
```

### 4. Ejecutar Backend

```bash
cd backend
mvn spring-boot:run
```

El servidor arranca en `http://localhost:8080`  
Hibernate crea las tablas automáticamente (`ddl-auto=update`)  
Los datos demo se insertan al primer inicio.

### 5. Ejecutar Frontend

```bash
cd frontend
npm install
npm start
```

La app abre en `http://localhost:3000`

---

## 👥 Usuarios Demo

| Rol | Correo | Contraseña |
|-----|--------|------------|
| 🔴 Administrador | admin@applestore.com | admin123 |
| 🔵 Empleado | tecnico@applestore.com | empleado123 |
| ⚪ Cliente | cliente@applestore.com | cliente123 |

---

## 🔐 Autenticación JWT

```
POST /api/auth/login     → { correo, password } → { token, rol, nombre, ... }
POST /api/auth/register  → { nombre, apellido, correo, password, ... }
```

El token se envía en todas las peticiones autenticadas:
```
Authorization: Bearer <token>
```

---

## 📡 Endpoints REST

### Públicos
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Registro de cliente |
| GET | `/api/productos` | Listar productos activos |
| GET | `/api/productos/{id}` | Detalle de producto |
| GET | `/api/productos/categorias` | Listar categorías |

### Cliente (autenticado)
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/pedidos/mis-pedidos` | Mis pedidos |
| POST | `/api/pedidos` | Crear pedido |
| DELETE | `/api/pedidos/{id}` | Cancelar pedido |
| GET | `/api/equipos/mis-equipos` | Mis equipos |
| POST | `/api/equipos` | Registrar equipo |
| GET | `/api/servicios/mis-solicitudes` | Mis solicitudes |
| POST | `/api/servicios` | Crear solicitud de servicio |
| DELETE | `/api/servicios/{id}` | Cancelar solicitud |

### Empleado + Admin
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/pedidos` | Todos los pedidos |
| PUT | `/api/pedidos/{id}/estado` | Cambiar estado pedido |
| GET | `/api/servicios` | Todos los servicios |
| PUT | `/api/servicios/{id}/estado` | Cambiar estado servicio |
| GET | `/api/asignaciones` | Ver asignaciones |
| POST | `/api/asignaciones` | Asignar técnico |
| PUT | `/api/asignaciones/{id}/finalizar` | Finalizar asignación |
| GET | `/api/equipos` | Todos los equipos |
| GET | `/api/usuarios/tecnicos` | Listar técnicos |
| GET | `/api/reportes/consolidado` | Informe consolidado |

### Solo Admin
| Método | URL | Descripción |
|--------|-----|-------------|
| POST/PUT/DELETE | `/api/productos` | CRUD de productos |
| GET | `/api/usuarios` | Gestionar usuarios |
| PUT | `/api/usuarios/{id}/rol` | Cambiar rol |
| DELETE | `/api/usuarios/{id}` | Eliminar usuario |
| GET | `/api/audit` | Ver logs de auditoría |

---

## 🎭 Diagrama de Casos de Uso

### Cliente
- Registrar / Editar / Cancelar pedido
- Registrar equipo
- Registrar / Cancelar solicitud de servicio

### Empleado
- Gestionar servicios técnicos (cambiar estado)
- Asignar / Finalizar técnico
- Ver equipos, pedidos
- Generar informes

### Administrador
- Todo lo del empleado +
- CRUD de productos
- Gestionar usuarios (cambiar rol, eliminar)
- Ver auditoría completa
- Generar informes consolidado / tabular / gráfico

---

## 📊 Auditoría

Cada acción importante queda registrada en `Audit_log`:

| Acción | Descripción |
|--------|-------------|
| LOGIN | Inicio de sesión |
| REGISTRO | Nuevo usuario |
| CREAR | Creación de recurso |
| ACTUALIZAR / ACTUALIZAR_ESTADO | Modificación |
| CANCELAR | Cancelación |
| ELIMINAR | Eliminación |
| ASIGNAR | Asignación de técnico |
| CAMBIAR_ROL | Cambio de rol de usuario |
| FINALIZAR | Finalización de asignación |

Campos registrados: usuario, rol, acción, entidad, ID, detalle, IP, timestamp.

---

## 🎨 Frontend — Pantallas

| Ruta | Descripción |
|------|-------------|
| `/store` | Tienda principal (catálogo) |
| `/store/checkout` | Finalizar pedido |
| `/store/pedidos` | Mis pedidos |
| `/store/equipos` | Mis equipos |
| `/store/servicios` | Servicio técnico |
| `/login` | Login |
| `/register` | Registro |
| `/admin/dashboard` | Panel admin — KPIs + gráficas |
| `/admin/productos` | CRUD de productos |
| `/admin/pedidos` | Gestión de pedidos |
| `/admin/servicios` | Gestión de servicios |
| `/admin/asignaciones` | Asignaciones de técnicos |
| `/admin/usuarios` | Gestión de usuarios |
| `/admin/reportes` | Informes consolidado/tabular/gráfico |
| `/admin/auditoria` | Logs de auditoría |
| `/empleado/dashboard` | Panel empleado |
| `/empleado/servicios` | Servicios técnicos |
| `/empleado/asignaciones` | Asignaciones |

---

## 🔧 Variables de entorno (opcionales)

**Backend** — `application.properties`:
```properties
app.jwt.secret=cambiar_esta_clave_en_produccion
app.jwt.expiration=86400000   # 24 horas en ms
app.cors.allowed-origins=http://localhost:3000
```

**Frontend** — `.env`:
```env
REACT_APP_API_URL=http://localhost:8080/api
```
