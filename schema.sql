-- =============================================================
-- AppleStore DB Schema (generado automáticamente por Hibernate)
-- Este script es solo de referencia. Hibernate crea las tablas.
-- =============================================================

CREATE DATABASE IF NOT EXISTS applestore_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE applestore_db;

-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
  id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  rol ENUM('CLIENTE','EMPLEADO','ADMINISTRADOR') NOT NULL DEFAULT 'CLIENTE',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla Productos
CREATE TABLE IF NOT EXISTS Productos (
  id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(100),
  modelo VARCHAR(100),
  estado ENUM('ACTIVO','INACTIVO','DESCONTINUADO') DEFAULT 'ACTIVO',
  inv_disponible INT DEFAULT 0,
  inv_separado INT DEFAULT 0,
  precio DECIMAL(10,2) NOT NULL,
  imagen_url VARCHAR(500),
  descripcion TEXT
) ENGINE=InnoDB;

-- Tabla Pedidos
CREATE TABLE IF NOT EXISTS Pedidos (
  id_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_usuario BIGINT NOT NULL,
  tipo_pedido ENUM('COMPRA','SEPARADO'),
  estado ENUM('PENDIENTE','CONFIRMADO','EN_PROCESO','ENVIADO','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_estimada_entrega DATE,
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
) ENGINE=InnoDB;

-- Tabla Detalles_pedido_producto
CREATE TABLE IF NOT EXISTS Detalles_pedido_producto (
  id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_pedido BIGINT NOT NULL,
  id_producto BIGINT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
) ENGINE=InnoDB;

-- Tabla Equipos_cliente
CREATE TABLE IF NOT EXISTS Equipos_cliente (
  id_equipo BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_usuario BIGINT NOT NULL,
  id_producto BIGINT NOT NULL,
  numero_serie VARCHAR(100),
  origen ENUM('TIENDA','TERCEROS'),
  fecha_compra DATE,
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
) ENGINE=InnoDB;

-- Tabla Solicitudes_servicios
CREATE TABLE IF NOT EXISTS Solicitudes_servicios (
  id_servicio BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_equipo BIGINT NOT NULL,
  estado ENUM('RECIBIDO','DIAGNOSTICO','EN_REPARACION','LISTO','ENTREGADO','CANCELADO') DEFAULT 'RECIBIDO',
  fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_estimada_entrega DATE,
  descripcion_falla TEXT,
  precio_estimado DECIMAL(10,2),
  FOREIGN KEY (id_equipo) REFERENCES Equipos_cliente(id_equipo)
) ENGINE=InnoDB;

-- Tabla Asignaciones_tecnico
CREATE TABLE IF NOT EXISTS Asignaciones_tecnico (
  id_asignacion BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_servicio BIGINT NOT NULL,
  id_usuario BIGINT NOT NULL,
  fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_finalizacion DATETIME,
  FOREIGN KEY (id_servicio) REFERENCES Solicitudes_servicios(id_servicio),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
) ENGINE=InnoDB;

-- Tabla Audit_log
CREATE TABLE IF NOT EXISTS Audit_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_usuario BIGINT,
  nombre_usuario VARCHAR(200),
  rol_usuario VARCHAR(50),
  accion VARCHAR(50) NOT NULL,
  entidad VARCHAR(100) NOT NULL,
  id_entidad BIGINT,
  detalle TEXT,
  ip_address VARCHAR(50),
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
