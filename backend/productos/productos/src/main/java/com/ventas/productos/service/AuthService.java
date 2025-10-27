package com.ventas.productos.service;

import com.ventas.productos.model.User;
import com.ventas.productos.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // token -> userId
    private final Map<String, Long> tokens = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> authenticate(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()));
    }

    public String createTokenForUser(User user) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, user.getId());
        return token;
    }

    public Optional<User> getUserForToken(String token) {
        if (token == null) return Optional.empty();
        Long uid = tokens.get(token);
        if (uid == null) return Optional.empty();
        return userRepository.findById(uid);
    }

    public void revokeToken(String token) {
        tokens.remove(token);
    }
}
