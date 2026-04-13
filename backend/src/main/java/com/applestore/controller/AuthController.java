package com.applestore.controller;

import com.applestore.audit.AuditService;
import com.applestore.dto.AuthDTOs;
import com.applestore.entity.Usuario;
import com.applestore.repository.UsuarioRepository;
import com.applestore.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDTOs.LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getCorreo());
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo()).orElseThrow();
        String token = jwtUtil.generateToken(userDetails, usuario.getRol().name());

        auditService.log("LOGIN", "Usuario", usuario.getIdUsuario(),
            "Login exitoso: " + usuario.getCorreo(), usuario.getIdUsuario());

        return ResponseEntity.ok(new AuthDTOs.LoginResponse(token, usuario));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDTOs.RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            return ResponseEntity.badRequest().body("El correo ya está registrado");
        }

        Usuario usuario = Usuario.builder()
            .nombre(request.getNombre())
            .apellido(request.getApellido())
            .correo(request.getCorreo())
            .password(passwordEncoder.encode(request.getPassword()))
            .telefono(request.getTelefono())
            .direccion(request.getDireccion())
            .rol(Usuario.Rol.CLIENTE)
            .build();

        usuarioRepository.save(usuario);
        auditService.log("REGISTRO", "Usuario", usuario.getIdUsuario(),
            "Nuevo cliente registrado: " + usuario.getCorreo(), usuario.getIdUsuario());

        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}
