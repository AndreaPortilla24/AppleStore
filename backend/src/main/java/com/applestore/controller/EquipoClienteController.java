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
@RequestMapping("/api/equipos")
@RequiredArgsConstructor
public class EquipoClienteController {

    private final EquipoClienteRepository equipoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final AuditService auditService;

    @GetMapping("/mis-equipos")
    public ResponseEntity<List<AppDTOs.EquipoDTO>> getMisEquipos(Authentication auth) {
        Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();
        return ResponseEntity.ok(equipoRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EMPLEADO')")
    public ResponseEntity<List<AppDTOs.EquipoDTO>> getAll() {
        return ResponseEntity.ok(equipoRepository.findAll()
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<AppDTOs.EquipoDTO> register(@Valid @RequestBody AppDTOs.EquipoRequest request,
                                                        Authentication auth) {
        Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();
        Producto producto = productoRepository.findById(request.getIdProducto()).orElseThrow();

        EquipoCliente equipo = EquipoCliente.builder()
            .usuario(usuario)
            .producto(producto)
            .numeroSerie(request.getNumeroSerie())
            .origen(request.getOrigen())
            .fechaCompra(request.getFechaCompra())
            .build();
        equipoRepository.save(equipo);
        auditService.log("CREAR", "EquipoCliente", equipo.getIdEquipo(),
            "Equipo registrado: " + producto.getNombre(), usuario.getIdUsuario());
        return ResponseEntity.ok(toDTO(equipo));
    }

    private AppDTOs.EquipoDTO toDTO(EquipoCliente e) {
        AppDTOs.EquipoDTO dto = new AppDTOs.EquipoDTO();
        dto.setIdEquipo(e.getIdEquipo());
        dto.setIdUsuario(e.getUsuario().getIdUsuario());
        dto.setNombreCliente(e.getUsuario().getNombre() + " " + e.getUsuario().getApellido());
        dto.setIdProducto(e.getProducto().getIdProducto());
        dto.setNombreProducto(e.getProducto().getNombre());
        dto.setNumeroSerie(e.getNumeroSerie());
        dto.setOrigen(e.getOrigen());
        dto.setFechaCompra(e.getFechaCompra());
        return dto;
    }
}
