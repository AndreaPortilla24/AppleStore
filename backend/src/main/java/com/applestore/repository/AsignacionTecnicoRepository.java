package com.applestore.repository;

import com.applestore.entity.AsignacionTecnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AsignacionTecnicoRepository extends JpaRepository<AsignacionTecnico, Long> {
    List<AsignacionTecnico> findByServicioIdServicio(Long idServicio);
    List<AsignacionTecnico> findByTecnicoIdUsuario(Long idUsuario);
}
