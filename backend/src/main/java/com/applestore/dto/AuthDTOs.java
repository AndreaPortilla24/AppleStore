package com.applestore.dto;

import com.applestore.entity.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// ===== Auth DTOs =====

public class AuthDTOs {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String correo;
        @NotBlank
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String correo;
        private String nombre;
        private String apellido;
        private String rol;
        private Long idUsuario;

        public LoginResponse(String token, Usuario usuario) {
            this.token = token;
            this.correo = usuario.getCorreo();
            this.nombre = usuario.getNombre();
            this.apellido = usuario.getApellido();
            this.rol = usuario.getRol().name();
            this.idUsuario = usuario.getIdUsuario();
        }
    }

    @Data
    public static class RegisterRequest {
        @NotBlank private String nombre;
        @NotBlank private String apellido;
        @NotBlank @Email private String correo;
        @NotBlank @Size(min = 6) private String password;
        private String telefono;
        private String direccion;
    }
}
