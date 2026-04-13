package com.applestore.repository;

import com.applestore.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByIdUsuarioOrderByTimestampDesc(Long idUsuario);
    List<AuditLog> findByEntidadAndIdEntidadOrderByTimestampDesc(String entidad, Long idEntidad);
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime from, LocalDateTime to);
    List<AuditLog> findByAccionOrderByTimestampDesc(String accion);
}
