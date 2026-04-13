package com.applestore.repository;

import com.applestore.entity.DetallePedidoProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DetallePedidoProductoRepository extends JpaRepository<DetallePedidoProducto, Long> {
    List<DetallePedidoProducto> findByPedidoIdPedido(Long idPedido);
}
