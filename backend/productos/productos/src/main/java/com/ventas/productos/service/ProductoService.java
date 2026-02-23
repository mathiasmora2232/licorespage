package com.ventas.productos.service;

import com.ventas.productos.model.Producto;
import com.ventas.productos.repository.ProductoRepository;
import com.ventas.productos.exception.EntityNotFoundException;
import com.ventas.productos.exception.InvalidInputException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> getAllProductos() {
        log.info("Obteniendo todos los productos");
        return productoRepository.findAll();
    }

    public Producto getProductoById(Long id) {
        log.info("Buscando producto con ID: {}", id);
        return productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto", id));
    }

    public Producto createProducto(Producto producto) {
        validateProducto(producto);
        log.info("Creando nuevo producto: {}", producto.getNombre());
        return productoRepository.save(producto);
    }

    public Producto updateProducto(Long id, Producto productoUpdate) {
        Producto existing = getProductoById(id);
        validateProducto(productoUpdate);

        existing.setNombre(productoUpdate.getNombre());
        existing.setDescripcion(productoUpdate.getDescripcion());
        existing.setPrecio(productoUpdate.getPrecio());
        existing.setImagen(productoUpdate.getImagen());
        existing.setCategoria(productoUpdate.getCategoria());
        if (productoUpdate.getStock() != null) {
            existing.setStock(productoUpdate.getStock());
        }

        log.info("Actualizando producto con ID: {}", id);
        return productoRepository.save(existing);
    }

    public void deleteProducto(Long id) {
        Producto producto = getProductoById(id);
        log.info("Eliminando producto con ID: {}", id);
        productoRepository.delete(producto);
    }

    public List<Producto> getProductosByCategoria(String categoria) {
        log.info("Buscando productos por categoría: {}", categoria);
        return productoRepository.findByCategoria(categoria);
    }

    private void validateProducto(Producto producto) {
        if (producto == null) {
            throw new InvalidInputException("Producto no puede ser nulo");
        }
        if (producto.getPrecio() <= 0) {
            throw new InvalidInputException("Precio debe ser mayor a 0");
        }
        if (producto.getStock() < 0) {
            throw new InvalidInputException("Stock no puede ser negativo");
        }
    }
}
