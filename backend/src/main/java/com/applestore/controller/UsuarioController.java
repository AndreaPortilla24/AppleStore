package com.applestore.controller;

import com.applestore.audit.AuditService;
import com.applestore.dto.AppDTOs;
import com.applestore.entity.Usuario;
import com.applestore.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<List<AppDTOs.UsuarioDTO>> getAll() {
        return ResponseEntity.ok(usuarioRepository.findAll()
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/tecnicos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EMPLEADO')")
    public ResponseEntity<List<AppDTOs.UsuarioDTO>> getTecnicos() {
        return ResponseEntity.ok(usuarioRepository.findByRol(Usuario.Rol.EMPLEADO)
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @PutMapping("/{id}/rol")
    public ResponseEntity<AppDTOs.UsuarioDTO> cambiarRol(@PathVariable Long id,
                                                          @RequestParam Usuario.Rol rol) {
        return usuarioRepository.findById(id).map(u -> {
            Usuario.Rol anterior = u.getRol();
            u.setRol(rol);
            usuarioRepository.save(u);
            auditService.log("CAMBIAR_ROL", "Usuario", id,
                "Rol cambiado: " + anterior + " -> " + rol, id);
            return ResponseEntity.ok(toDTO(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return usuarioRepository.findById(id).map(u -> {
            usuarioRepository.delete(u);
            auditService.log("ELIMINAR", "Usuario", id, "Usuario eliminado: " + u.getCorreo());
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private AppDTOs.UsuarioDTO toDTO(Usuario u) {
        AppDTOs.UsuarioDTO dto = new AppDTOs.UsuarioDTO();
        dto.setIdUsuario(u.getIdUsuario());
        dto.setNombre(u.getNombre());
        dto.setApellido(u.getApellido());
        dto.setCorreo(u.getCorreo());
        dto.setTelefono(u.getTelefono());
        dto.setDireccion(u.getDireccion());
        dto.setRol(u.getRol().name());
        dto.setFechaRegistro(u.getFechaRegistro());
        return dto;
    }
}
