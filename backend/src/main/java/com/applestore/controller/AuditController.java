package com.applestore.controller;

import com.applestore.audit.AuditService;
import com.applestore.dto.AppDTOs;
import com.applestore.entity.AuditLog;
import com.applestore.entity.Pedido;
import com.applestore.entity.SolicitudServicio;
import com.applestore.repository.PedidoRepository;
import com.applestore.repository.ProductoRepository;
import com.applestore.repository.SolicitudServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAll() {
        return ResponseEntity.ok(auditService.findAll());
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<AuditLog>> getByUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(auditService.findByUsuario(id));
    }
}


@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMINISTRADOR','EMPLEADO')")
class ReporteController {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final SolicitudServicioRepository solicitudRepository;

    @GetMapping("/consolidado")
    public ResponseEntity<AppDTOs.ReporteConsolidado> getConsolidado() {
        AppDTOs.ReporteConsolidado reporte = new AppDTOs.ReporteConsolidado();

        reporte.setTotalPedidos((long) pedidoRepository.findAll().size());
        reporte.setPedidosPendientes(pedidoRepository.countByEstado(Pedido.Estado.PENDIENTE));
        reporte.setPedidosEntregados(pedidoRepository.countByEstado(Pedido.Estado.ENTREGADO));
        reporte.setTotalSolicitudes((long) solicitudRepository.findAll().size());
        reporte.setSolicitudesActivas((long) solicitudRepository.findByEstado(SolicitudServicio.Estado.EN_REPARACION).size());
        reporte.setTotalProductos((long) productoRepository.findAll().size());
        reporte.setProductosConStock((long) productoRepository.findProductosDisponibles().size());

        BigDecimal ventas = pedidoRepository.findAll().stream()
            .filter(p -> p.getEstado() == Pedido.Estado.ENTREGADO)
            .flatMap(p -> p.getDetalles().stream())
            .map(d -> d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        reporte.setVentasTotales(ventas);

        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/pedidos")
    public ResponseEntity<List<AppDTOs.PedidoDTO>> getPedidosReporte() {
        return ResponseEntity.ok(List.of()); // delegate to PedidoController for full list
    }
}
