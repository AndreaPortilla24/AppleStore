package com.applestore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Solicitudes_servicios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Long idServicio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipo", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private EquipoCliente equipo;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaIngreso;

    @Column(name = "fecha_estimada_entrega")
    private LocalDate fechaEstimadaEntrega;

    @Column(name = "descripcion_falla", columnDefinition = "TEXT")
    private String descripcionFalla;

    @Column(name = "precio_estimado", precision = 10, scale = 2)
    private BigDecimal precioEstimado;

    @PrePersist
    public void prePersist() {
        if (fechaIngreso == null) fechaIngreso = LocalDateTime.now();
        if (estado == null) estado = Estado.RECIBIDO;
    }

    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<AsignacionTecnico> asignaciones;

    public enum Estado {
        RECIBIDO, DIAGNOSTICO, EN_REPARACION, LISTO, ENTREGADO, CANCELADO
    }
}
