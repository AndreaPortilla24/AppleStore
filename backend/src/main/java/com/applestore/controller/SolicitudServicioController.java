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

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
public class SolicitudServicioController {

    private final SolicitudServicioRepository solicitudRepository;
    private final EquipoClienteRepository equipoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditService auditService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EMPLEADO')")
    public ResponseEntity<List<AppDTOs.SolicitudDTO>> getAll() {
        return ResponseEntity.ok(solicitudRepository.findAll()
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/mis-solicitudes")
    public ResponseEntity<List<AppDTOs.SolicitudDTO>> getMisSolicitudes(Authentication auth) {
        Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();
        return ResponseEntity.ok(solicitudRepository.findByEquipoUsuarioIdUsuario(usuario.getIdUsuario())
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody AppDTOs.SolicitudRequest request, Authentication auth) {
        EquipoCliente equipo = equipoRepository.findById(request.getIdEquipo())
            .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();
        // Validate ownership unless admin/employee
        boolean isStaff = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().contains("ADMINISTRADOR") || a.getAuthority().contains("EMPLEADO"));
        if (!isStaff && !equipo.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            return ResponseEntity.status(403).body("No autorizado");
        }

        SolicitudServicio solicitud = SolicitudServicio.builder()
            .equipo(equipo)
            .descripcionFalla(request.getDescripcionFalla())
            .fechaEstimadaEntrega(request.getFechaEstimadaEntrega())
            .precioEstimado(request.getPrecioEstimado())
            .build();

        solicitudRepository.save(solicitud);
        auditService.log("CREAR", "SolicitudServicio", solicitud.getIdServicio(),
            "Solicitud creada para equipo: " + equipo.getIdEquipo(), usuario.getIdUsuario());

        return ResponseEntity.ok(toDTO(solicitud));
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EMPLEADO')")
    public ResponseEntity<AppDTOs.SolicitudDTO> updateEstado(@PathVariable Long id,
                                                              @RequestParam SolicitudServicio.Estado estado) {
        return solicitudRepository.findById(id).map(s -> {
            SolicitudServicio.Estado anterior = s.getEstado();
            s.setEstado(estado);
            solicitudRepository.save(s);
            auditService.log("ACTUALIZAR_ESTADO", "SolicitudServicio", id,
                "Estado: " + anterior + " -> " + estado);
            return ResponseEntity.ok(toDTO(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id, Authentication auth) {
        return solicitudRepository.findById(id).map(s -> {
            Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();
            boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("ADMINISTRADOR") || a.getAuthority().contains("EMPLEADO"));
            if (!isAdmin && !s.getEquipo().getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
                return ResponseEntity.status(403).<Void>build();
            }
            s.setEstado(SolicitudServicio.Estado.CANCELADO);
            solicitudRepository.save(s);
            auditService.log("CANCELAR", "SolicitudServicio", id, "Solicitud cancelada", usuario.getIdUsuario());
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private AppDTOs.SolicitudDTO toDTO(SolicitudServicio s) {
        AppDTOs.SolicitudDTO dto = new AppDTOs.SolicitudDTO();
        dto.setIdServicio(s.getIdServicio());
        dto.setIdEquipo(s.getEquipo().getIdEquipo());
        dto.setModeloEquipo(s.getEquipo().getProducto().getNombre());
        dto.setNombreCliente(s.getEquipo().getUsuario().getNombre() + " " + s.getEquipo().getUsuario().getApellido());
        dto.setEstado(s.getEstado());
        dto.setFechaIngreso(s.getFechaIngreso());
        dto.setFechaEstimadaEntrega(s.getFechaEstimadaEntrega());
        dto.setDescripcionFalla(s.getDescripcionFalla());
        dto.setPrecioEstimado(s.getPrecioEstimado());
        return dto;
    }
}
