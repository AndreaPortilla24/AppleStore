package com.applestore.repository;

import com.applestore.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoria(String categoria);
    List<Producto> findByEstado(Producto.Estado estado);

    @Query("SELECT p FROM Producto p WHERE p.invDisponible > 0 AND p.estado = 'ACTIVO'")
    List<Producto> findProductosDisponibles();

    @Query("SELECT DISTINCT p.categoria FROM Producto p WHERE p.estado = 'ACTIVO'")
    List<String> findAllCategorias();
}
