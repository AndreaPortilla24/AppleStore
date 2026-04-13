package com.applestore.repository;

import com.applestore.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioIdUsuarioOrderByFechaCreacionDesc(Long idUsuario);
    List<Pedido> findByEstado(Pedido.Estado estado);

    @Query("SELECT p FROM Pedido p JOIN FETCH p.usuario JOIN FETCH p.detalles d JOIN FETCH d.producto ORDER BY p.fechaCreacion DESC")
    List<Pedido> findAllWithDetails();

    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.estado = :estado")
    Long countByEstado(@Param("estado") Pedido.Estado estado);
}
