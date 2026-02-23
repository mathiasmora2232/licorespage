package com.ventas.productos.controller;

import com.ventas.productos.model.Producto;
import com.ventas.productos.model.User;
import com.ventas.productos.service.ProductoService;
import com.ventas.productos.service.AuthService;
import com.ventas.productos.dto.ApiResponse;
import com.ventas.productos.dto.ProductoResponse;
import com.ventas.productos.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
@Slf4j
public class ProductoController {
    private final ProductoService productoService;
    private final AuthService authService;

    public ProductoController(ProductoService productoService, AuthService authService) {
        this.productoService = productoService;
        this.authService = authService;
    }

    // Listar todos
    @GetMapping
    public ResponseEntity<?> getAllProductos() {
        List<ProductoResponse> productos = productoService.getAllProductos()
                .stream()
                .map(ProductoResponse::fromProducto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(productos, "Productos obtenidos exitosamente"));
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductoById(@PathVariable Long id) {
        Producto producto = productoService.getProductoById(id);
        return ResponseEntity.ok(ApiResponse.ok(ProductoResponse.fromProducto(producto), "Producto encontrado"));
    }

    // Filtrar por categoría
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<?> getProductosByCategoria(@PathVariable String categoria) {
        List<ProductoResponse> productos = productoService.getProductosByCategoria(categoria)
                .stream()
                .map(ProductoResponse::fromProducto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(productos, "Productos de la categoría encontrados"));
    }

    // Crear (requiere rol ADMIN)
    @PostMapping
    public ResponseEntity<?> createProducto(@Valid @RequestBody Producto producto, HttpServletRequest req) {
        isAdmin(req);
        Producto saved = productoService.createProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(ProductoResponse.fromProducto(saved), "Producto creado exitosamente"));
    }

    // Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProducto(@PathVariable Long id, @Valid @RequestBody Producto producto, HttpServletRequest req) {
        isAdmin(req);
        Producto updated = productoService.updateProducto(id, producto);
        return ResponseEntity.ok(ApiResponse.ok(ProductoResponse.fromProducto(updated), "Producto actualizado"));
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProducto(@PathVariable Long id, HttpServletRequest req) {
        isAdmin(req);
        productoService.deleteProducto(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Producto eliminado exitosamente"));
    }

    private void isAdmin(HttpServletRequest req) {
        String auth = req.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new UnauthorizedException("Token no proporcionado");
        }
        
        String token = auth.substring(7);
        Optional<User> user = authService.getUserForToken(token);
        
        if (user.isEmpty()) {
            throw new UnauthorizedException("Token inválido");
        }

        User u = user.get();
        if (u.getRoles() == null || !u.getRoles().contains("ADMIN")) {
            throw new UnauthorizedException("Se requiere rol ADMIN");
        }
    }
}
