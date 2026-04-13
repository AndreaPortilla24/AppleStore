package com.applestore.repository;

import com.applestore.entity.EquipoCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EquipoClienteRepository extends JpaRepository<EquipoCliente, Long> {
    List<EquipoCliente> findByUsuarioIdUsuario(Long idUsuario);
}
