package com.applestore.dto;

import com.applestore.entity.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AppDTOs {

    // ===== Producto =====
    @Data
    public static class ProductoDTO {
        private Long idProducto;
        private String nombre;
        private String categoria;
        private String modelo;
        private Producto.Estado estado;
        private Integer invDisponible;
        private Integer invSeparado;
        private BigDecimal precio;
        private String imagenUrl;
        private String descripcion;
    }

    @Data
    public static class ProductoRequest {
        @NotNull private String nombre;
        private String categoria;
        private String modelo;
        private Producto.Estado estado;
        private Integer invDisponible;
        private Integer invSeparado;
        @NotNull private BigDecimal precio;
        private String imagenUrl;
        private String descripcion;
    }

    // ===== Pedido =====
    @Data
    public static class PedidoRequest {
        @NotNull private Pedido.TipoPedido tipoPedido;
        @NotNull private List<DetallePedidoRequest> detalles;
        private LocalDate fechaEstimadaEntrega;
    }

    @Data
    public static class DetallePedidoRequest {
        @NotNull private Long idProducto;
        @NotNull @Min(1) private Integer cantidad;
    }

    @Data
    public static class PedidoDTO {
        private Long idPedido;
        private Long idUsuario;
        private String nombreCliente;
        private Pedido.TipoPedido tipoPedido;
        private Pedido.Estado estado;
        private LocalDateTime fechaCreacion;
        private LocalDate fechaEstimadaEntrega;
        private List<DetalleDTO> detalles;
        private BigDecimal total;
    }

    @Data
    public static class DetalleDTO {
        private Long idDetalle;
        private Long idProducto;
        private String nombreProducto;
        private Integer cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;
    }

    // ===== Equipo Cliente =====
    @Data
    public static class EquipoRequest {
        @NotNull private Long idProducto;
        private String numeroSerie;
        private EquipoCliente.Origen origen;
        private LocalDate fechaCompra;
    }

    @Data
    public static class EquipoDTO {
        private Long idEquipo;
        private Long idUsuario;
        private String nombreCliente;
        private Long idProducto;
        private String nombreProducto;
        private String numeroSerie;
        private EquipoCliente.Origen origen;
        private LocalDate fechaCompra;
    }

    // ===== Solicitud Servicio =====
    @Data
    public static class SolicitudRequest {
        @NotNull private Long idEquipo;
        @NotNull private String descripcionFalla;
        private LocalDate fechaEstimadaEntrega;
        private BigDecimal precioEstimado;
    }

    @Data
    public static class SolicitudDTO {
        private Long idServicio;
        private Long idEquipo;
        private String modeloEquipo;
        private String nombreCliente;
        private SolicitudServicio.Estado estado;
        private LocalDateTime fechaIngreso;
        private LocalDate fechaEstimadaEntrega;
        private String descripcionFalla;
        private BigDecimal precioEstimado;
    }

    // ===== Asignacion Tecnico =====
    @Data
    public static class AsignacionRequest {
        @NotNull private Long idServicio;
        @NotNull private Long idTecnico;
    }

    @Data
    public static class AsignacionDTO {
        private Long idAsignacion;
        private Long idServicio;
        private Long idTecnico;
        private String nombreTecnico;
        private LocalDateTime fechaAsignacion;
        private LocalDateTime fechaFinalizacion;
    }

    // ===== Usuario =====
    @Data
    public static class UsuarioDTO {
        private Long idUsuario;
        private String nombre;
        private String apellido;
        private String correo;
        private String telefono;
        private String direccion;
        private String rol;
        private LocalDateTime fechaRegistro;
    }

    // ===== Reports =====
    @Data
    public static class ReporteConsolidado {
        private Long totalPedidos;
        private Long pedidosPendientes;
        private Long pedidosEntregados;
        private Long totalSolicitudes;
        private Long solicitudesActivas;
        private Long totalProductos;
        private Long productosConStock;
        private BigDecimal ventasTotales;
    }
}
