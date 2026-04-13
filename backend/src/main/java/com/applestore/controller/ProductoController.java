package com.applestore.controller;

import com.applestore.audit.AuditService;
import com.applestore.dto.AppDTOs;
import com.applestore.entity.Producto;
import com.applestore.repository.ProductoRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<List<AppDTOs.ProductoDTO>> getAll() {
        return ResponseEntity.ok(productoRepository.findProductosDisponibles()
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EMPLEADO')")
    public ResponseEntity<List<AppDTOs.ProductoDTO>> getAllAdmin() {
        return ResponseEntity.ok(productoRepository.findAll()
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppDTOs.ProductoDTO> getById(@PathVariable Long id) {
        return productoRepository.findById(id)
            .map(p -> ResponseEntity.ok(toDTO(p)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<AppDTOs.ProductoDTO>> getByCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(productoRepository.findByCategoria(categoria)
            .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<String>> getCategorias() {
        return ResponseEntity.ok(productoRepository.findAllCategorias());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<AppDTOs.ProductoDTO> create(@Valid @RequestBody AppDTOs.ProductoRequest request) {
        Producto producto = Producto.builder()
            .nombre(request.getNombre())
            .categoria(request.getCategoria())
            .modelo(request.getModelo())
            .estado(request.getEstado() != null ? request.getEstado() : Producto.Estado.ACTIVO)
            .invDisponible(request.getInvDisponible() != null ? request.getInvDisponible() : 0)
            .invSeparado(request.getInvSeparado() != null ? request.getInvSeparado() : 0)
            .precio(request.getPrecio())
            .imagenUrl(request.getImagenUrl())
            .descripcion(request.getDescripcion())
            .build();
        productoRepository.save(producto);
        auditService.log("CREAR", "Producto", producto.getIdProducto(), "Producto creado: " + producto.getNombre());
        return ResponseEntity.ok(toDTO(producto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<AppDTOs.ProductoDTO> update(@PathVariable Long id,
                                                       @Valid @RequestBody AppDTOs.ProductoRequest request) {
        return productoRepository.findById(id).map(p -> {
            p.setNombre(request.getNombre());
            p.setCategoria(request.getCategoria());
            p.setModelo(request.getModelo());
            p.setEstado(request.getEstado());
            p.setInvDisponible(request.getInvDisponible());
            p.setInvSeparado(request.getInvSeparado());
            p.setPrecio(request.getPrecio());
            p.setImagenUrl(request.getImagenUrl());
            p.setDescripcion(request.getDescripcion());
            productoRepository.save(p);
            auditService.log("ACTUALIZAR", "Producto", id, "Producto actualizado: " + p.getNombre());
            return ResponseEntity.ok(toDTO(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return productoRepository.findById(id).map(p -> {
            p.setEstado(Producto.Estado.INACTIVO);
            productoRepository.save(p);
            auditService.log("ELIMINAR", "Producto", id, "Producto desactivado: " + p.getNombre());
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private AppDTOs.ProductoDTO toDTO(Producto p) {
        AppDTOs.ProductoDTO dto = new AppDTOs.ProductoDTO();
        dto.setIdProducto(p.getIdProducto());
        dto.setNombre(p.getNombre());
        dto.setCategoria(p.getCategoria());
        dto.setModelo(p.getModelo());
        dto.setEstado(p.getEstado());
        dto.setInvDisponible(p.getInvDisponible());
        dto.setInvSeparado(p.getInvSeparado());
        dto.setPrecio(p.getPrecio());
        dto.setImagenUrl(p.getImagenUrl());
        dto.setDescripcion(p.getDescripcion());
        return dto;
    }
}
