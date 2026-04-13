package com.applestore.controller;

import com.applestore.audit.AuditService;
import com.applestore.dto.AppDTOs;
import com.applestore.entity.*;
import com.applestore.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditService auditService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EMPLEADO')")
    public ResponseEntity<List<AppDTOs.PedidoDTO>> getAll() {
        return ResponseEntity.ok(pedidoRepository.findAll()
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<AppDTOs.PedidoDTO>> getMisPedidos(Authentication auth) {
        Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();
        return ResponseEntity.ok(pedidoRepository.findByUsuarioIdUsuarioOrderByFechaCreacionDesc(usuario.getIdUsuario())
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppDTOs.PedidoDTO> getById(@PathVariable Long id, Authentication auth) {
        return pedidoRepository.findById(id).map(pedido -> {
            Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();
            boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("ADMINISTRADOR") || a.getAuthority().contains("EMPLEADO"));
            if (!isAdmin && !pedido.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
                return ResponseEntity.status(403).<AppDTOs.PedidoDTO>build();
            }
            return ResponseEntity.ok(toDTO(pedido));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody AppDTOs.PedidoRequest request, Authentication auth) {
        Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();

        Pedido pedido = Pedido.builder()
            .usuario(usuario)
            .tipoPedido(request.getTipoPedido())
            .fechaEstimadaEntrega(request.getFechaEstimadaEntrega())
            .build();

        List<DetallePedidoProducto> detalles = new ArrayList<>();
        for (AppDTOs.DetallePedidoRequest det : request.getDetalles()) {
            Producto producto = productoRepository.findById(det.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + det.getIdProducto()));

            if (producto.getInvDisponible() < det.getCantidad()) {
                return ResponseEntity.badRequest().body("Stock insuficiente para: " + producto.getNombre());
            }

            producto.setInvDisponible(producto.getInvDisponible() - det.getCantidad());
            productoRepository.save(producto);

            DetallePedidoProducto detalle = DetallePedidoProducto.builder()
                .pedido(pedido)
                .producto(producto)
                .cantidad(det.getCantidad())
                .precioUnitario(producto.getPrecio())
                .build();
            detalles.add(detalle);
        }

        pedido.setDetalles(detalles);
        pedidoRepository.save(pedido);

        auditService.log("CREAR", "Pedido", pedido.getIdPedido(),
            "Pedido creado por: " + usuario.getCorreo(), usuario.getIdUsuario());

        return ResponseEntity.ok(toDTO(pedido));
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EMPLEADO')")
    public ResponseEntity<AppDTOs.PedidoDTO> updateEstado(@PathVariable Long id,
                                                           @RequestParam Pedido.Estado estado) {
        return pedidoRepository.findById(id).map(pedido -> {
            Pedido.Estado estadoAnterior = pedido.getEstado();
            pedido.setEstado(estado);
            pedidoRepository.save(pedido);
            auditService.log("ACTUALIZAR_ESTADO", "Pedido", id,
                "Estado cambiado: " + estadoAnterior + " -> " + estado);
            return ResponseEntity.ok(toDTO(pedido));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id, Authentication auth) {
        return pedidoRepository.findById(id).map(pedido -> {
            Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();
            boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("ADMINISTRADOR"));
            if (!isAdmin && !pedido.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
                return ResponseEntity.status(403).<Void>build();
            }
            if (pedido.getEstado() == Pedido.Estado.ENTREGADO) {
                return ResponseEntity.badRequest().<Void>build();
            }
            // Restore inventory
            pedido.getDetalles().forEach(d -> {
                Producto p = d.getProducto();
                p.setInvDisponible(p.getInvDisponible() + d.getCantidad());
                productoRepository.save(p);
            });
            pedido.setEstado(Pedido.Estado.CANCELADO);
            pedidoRepository.save(pedido);
            auditService.log("CANCELAR", "Pedido", id, "Pedido cancelado", usuario.getIdUsuario());
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private AppDTOs.PedidoDTO toDTO(Pedido p) {
        AppDTOs.PedidoDTO dto = new AppDTOs.PedidoDTO();
        dto.setIdPedido(p.getIdPedido());
        dto.setIdUsuario(p.getUsuario().getIdUsuario());
        dto.setNombreCliente(p.getUsuario().getNombre() + " " + p.getUsuario().getApellido());
        dto.setTipoPedido(p.getTipoPedido());
        dto.setEstado(p.getEstado());
        dto.setFechaCreacion(p.getFechaCreacion());
        dto.setFechaEstimadaEntrega(p.getFechaEstimadaEntrega());

        if (p.getDetalles() != null) {
            List<AppDTOs.DetalleDTO> detalles = p.getDetalles().stream().map(d -> {
                AppDTOs.DetalleDTO det = new AppDTOs.DetalleDTO();
                det.setIdDetalle(d.getIdDetalle());
                det.setIdProducto(d.getProducto().getIdProducto());
                det.setNombreProducto(d.getProducto().getNombre());
                det.setCantidad(d.getCantidad());
                det.setPrecioUnitario(d.getPrecioUnitario());
                det.setSubtotal(d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())));
                return det;
            }).collect(Collectors.toList());
            dto.setDetalles(detalles);
            dto.setTotal(detalles.stream()
                .map(AppDTOs.DetalleDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        return dto;
    }
}
