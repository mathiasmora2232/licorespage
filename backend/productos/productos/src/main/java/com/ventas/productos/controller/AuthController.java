package com.ventas.productos.controller;
import com.ventas.productos.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) return ResponseEntity.badRequest().body(Map.of("error","email and password required"));

        return authService.authenticate(email, password)
                .map(user -> {
                    String token = authService.createTokenForUser(user);
                    return ResponseEntity.ok(Map.of(
                            "token", token,
                            "user", Map.of("name", user.getName(), "roles", user.getRoles())
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error","invalid_credentials")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest req) {
        String auth = req.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) return ResponseEntity.status(401).body(Map.of("error","missing_token"));
        String token = auth.substring(7);
        var opt = authService.getUserForToken(token);
        if (opt.isPresent()) {
            var u = opt.get();
            return ResponseEntity.ok(Map.of("user", Map.of("name", u.getName(), "email", u.getEmail(), "roles", u.getRoles())));
        } else {
            return ResponseEntity.status(401).body(Map.of("error","invalid_token"));
        }
    }
}
