package com.ventas.productos.controller;

import com.ventas.productos.model.Producto;
import com.ventas.productos.model.User;
import com.ventas.productos.repository.ProductoRepository;
import com.ventas.productos.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
	private final ProductoRepository productoRepository;
	private final AuthService authService;

	public ProductoController(ProductoRepository productoRepository, AuthService authService) {
		this.productoRepository = productoRepository;
		this.authService = authService;
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

	// Crear (requiere rol ADMIN)
	@PostMapping
	public ResponseEntity<?> createProducto(@RequestBody Producto producto, HttpServletRequest req) {
		if (!isAdmin(req)) return ResponseEntity.status(403).body("forbidden");
		Producto saved = productoRepository.save(producto);
		return ResponseEntity.created(URI.create("/api/productos/" + saved.getId())).body(saved);
	}

	// Actualizar
	@PutMapping("/{id}")
	public ResponseEntity<?> updateProducto(@PathVariable Long id, @RequestBody Producto producto, HttpServletRequest req) {
		if (!isAdmin(req)) return ResponseEntity.status(403).body("forbidden");
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
	public ResponseEntity<?> deleteProducto(@PathVariable Long id, HttpServletRequest req) {
		if (!isAdmin(req)) return ResponseEntity.status(403).body("forbidden");
		if (!productoRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		productoRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}

	private boolean isAdmin(HttpServletRequest req) {
		String auth = req.getHeader("Authorization");
		if (auth == null || !auth.startsWith("Bearer ")) return false;
		String token = auth.substring(7);
		Optional<User> u = authService.getUserForToken(token);
		return u.map(user -> {
			String roles = user.getRoles();
			return roles != null && roles.contains("ADMIN");
		}).orElse(false);
	}
}
