package com.applestore.repository;

import com.applestore.entity.SolicitudServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {
    List<SolicitudServicio> findByEquipoIdEquipo(Long idEquipo);
    List<SolicitudServicio> findByEstado(SolicitudServicio.Estado estado);
    List<SolicitudServicio> findByEquipoUsuarioIdUsuario(Long idUsuario);
}
