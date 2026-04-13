package com.applestore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "Productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long idProducto;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 100)
    private String categoria;

    @Column(length = 100)
    private String modelo;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Column(name = "inv_disponible")
    private Integer invDisponible;

    @Column(name = "inv_separado")
    private Integer invSeparado;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(length = 500)
    private String descripcion;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<DetallePedidoProducto> detalles;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<EquipoCliente> equipos;

    public enum Estado {
        ACTIVO, INACTIVO, DESCONTINUADO
    }
}
