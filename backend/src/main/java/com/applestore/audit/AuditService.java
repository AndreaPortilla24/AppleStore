package com.applestore.audit;

import com.applestore.entity.AuditLog;
import com.applestore.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void log(String accion, String entidad, Long idEntidad, String detalle) {
        String correo = "SYSTEM";
        String rol = "SYSTEM";
        Long idUsuario = null;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            correo = auth.getName();
            rol = auth.getAuthorities().stream().findFirst()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .orElse("UNKNOWN");
        }

        String ip = getClientIp();

        AuditLog log = AuditLog.builder()
                .idUsuario(idUsuario)
                .nombreUsuario(correo)
                .rolUsuario(rol)
                .accion(accion)
                .entidad(entidad)
                .idEntidad(idEntidad)
                .detalle(detalle)
                .ipAddress(ip)
                .build();

        auditLogRepository.save(log);
    }

    public void log(String accion, String entidad, Long idEntidad, String detalle, Long idUsuario) {
        String correo = "SYSTEM";
        String rol = "SYSTEM";

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            correo = auth.getName();
            rol = auth.getAuthorities().stream().findFirst()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .orElse("UNKNOWN");
        }

        AuditLog log = AuditLog.builder()
                .idUsuario(idUsuario)
                .nombreUsuario(correo)
                .rolUsuario(rol)
                .accion(accion)
                .entidad(entidad)
                .idEntidad(idEntidad)
                .detalle(detalle)
                .ipAddress(getClientIp())
                .build();

        auditLogRepository.save(log);
    }

    public List<AuditLog> findAll() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> findByUsuario(Long idUsuario) {
        return auditLogRepository.findByIdUsuarioOrderByTimestampDesc(idUsuario);
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String xfHeader = request.getHeader("X-Forwarded-For");
                if (xfHeader != null) return xfHeader.split(",")[0];
                return request.getRemoteAddr();
            }
        } catch (Exception ignored) {}
        return "UNKNOWN";
    }
}
