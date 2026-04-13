package com.applestore.controller;

import com.applestore.audit.AuditService;
import com.applestore.dto.AppDTOs;
import com.applestore.entity.*;
import com.applestore.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/asignaciones")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMINISTRADOR','EMPLEADO')")
public class AsignacionTecnicoController {

    private final AsignacionTecnicoRepository asignacionRepository;
    private final SolicitudServicioRepository solicitudRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<List<AppDTOs.AsignacionDTO>> getAll() {
        return ResponseEntity.ok(asignacionRepository.findAll()
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<AppDTOs.AsignacionDTO> asignar(@Valid @RequestBody AppDTOs.AsignacionRequest request) {
        SolicitudServicio servicio = solicitudRepository.findById(request.getIdServicio()).orElseThrow();
        Usuario tecnico = usuarioRepository.findById(request.getIdTecnico()).orElseThrow();

        AsignacionTecnico asignacion = AsignacionTecnico.builder()
            .servicio(servicio)
            .tecnico(tecnico)
            .build();
        asignacionRepository.save(asignacion);

        servicio.setEstado(SolicitudServicio.Estado.EN_REPARACION);
        solicitudRepository.save(servicio);

        auditService.log("ASIGNAR", "AsignacionTecnico", asignacion.getIdAsignacion(),
            "Técnico " + tecnico.getNombre() + " asignado a servicio " + servicio.getIdServicio());
        return ResponseEntity.ok(toDTO(asignacion));
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<AppDTOs.AsignacionDTO> finalizar(@PathVariable Long id) {
        return asignacionRepository.findById(id).map(a -> {
            a.setFechaFinalizacion(java.time.LocalDateTime.now());
            asignacionRepository.save(a);
            auditService.log("FINALIZAR", "AsignacionTecnico", id, "Asignación finalizada");
            return ResponseEntity.ok(toDTO(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    private AppDTOs.AsignacionDTO toDTO(AsignacionTecnico a) {
        AppDTOs.AsignacionDTO dto = new AppDTOs.AsignacionDTO();
        dto.setIdAsignacion(a.getIdAsignacion());
        dto.setIdServicio(a.getServicio().getIdServicio());
        dto.setIdTecnico(a.getTecnico().getIdUsuario());
        dto.setNombreTecnico(a.getTecnico().getNombre() + " " + a.getTecnico().getApellido());
        dto.setFechaAsignacion(a.getFechaAsignacion());
        dto.setFechaFinalizacion(a.getFechaFinalizacion());
        return dto;
    }
}
