package com.ventas.productos.controller;

import com.ventas.productos.model.Producto;
import com.ventas.productos.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
	private final ProductoRepository productoRepository;

	public ProductoController(ProductoRepository productoRepository) {
		this.productoRepository = productoRepository;
	}

	// Listar todos
	@GetMapping
	public List<Producto> getAllProductos() {
		return productoRepository.findAll();
	}

	// Obtener por ID
	@GetMapping("/{id}")
	public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
		return productoRepository.findById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	// Crear
	@PostMapping
	public ResponseEntity<Producto> createProducto(@RequestBody Producto producto) {
		Producto saved = productoRepository.save(producto);
		return ResponseEntity.created(URI.create("/api/productos/" + saved.getId())).body(saved);
	}

	// Actualizar
	@PutMapping("/{id}")
	public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
		return productoRepository.findById(id)
				.map(existing -> {
					existing.setNombre(producto.getNombre());
					existing.setDescripcion(producto.getDescripcion());
					existing.setPrecio(producto.getPrecio());
					existing.setImagen(producto.getImagen());
					Producto updated = productoRepository.save(existing);
					return ResponseEntity.ok(updated);
				})
				.orElse(ResponseEntity.notFound().build());
	}

	// Eliminar
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
		if (!productoRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		productoRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
