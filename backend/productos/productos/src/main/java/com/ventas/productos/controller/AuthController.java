package com.ventas.productos.controller;

import com.ventas.productos.model.User;
import com.ventas.productos.service.AuthService;
import com.ventas.productos.dto.ApiResponse;
import com.ventas.productos.dto.AuthResponse;
import com.ventas.productos.dto.LoginRequest;
import com.ventas.productos.dto.UserResponse;
import com.ventas.productos.exception.UnauthorizedException;
import com.ventas.productos.exception.InvalidInputException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Slf4j
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        log.info("Intento de login para: {}", request.getEmail());

        User user = authService.authenticate(request.getEmail(), request.getPassword())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        String token = authService.createTokenForUser(user);

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRoles(user.getRoles());
        response.setUserId(user.getId());
        response.setExpiresIn(authService.getJwtExpiration());

        log.info("Login exitoso para: {}", user.getEmail());
        return ResponseEntity.ok(ApiResponse.ok(response, "Login exitoso"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest req) {
        String auth = req.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new UnauthorizedException("Token no proporcionado");
        }

        String token = auth.substring(7);
        User user = authService.getUserForToken(token)
                .orElseThrow(() -> new UnauthorizedException("Token inválido o expirado"));

        log.info("Info del usuario solicitada: {}", user.getEmail());
        return ResponseEntity.ok(ApiResponse.ok(UserResponse.fromUser(user), "Información del usuario"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User newUser) {
        if (newUser.getPassword().length() < 8) {
            throw new InvalidInputException("Contraseña debe tener al menos 8 caracteres");
        }

        // TODO: Implement user registration with password encoding
        log.info("Registro de usuario: {}", newUser.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(UserResponse.fromUser(newUser), "Usuario registrado"));
    }
}
