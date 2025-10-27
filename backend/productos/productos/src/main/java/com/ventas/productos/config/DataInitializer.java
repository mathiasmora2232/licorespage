package com.ventas.productos.config;

import com.ventas.productos.model.User;
import com.ventas.productos.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.findByEmail("admin@demo").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@demo");
                admin.setName("Administrador");
                admin.setPassword(encoder.encode("admin"));
                admin.setRoles("ADMIN,USER");
                userRepository.save(admin);
            }
            if (userRepository.findByEmail("user@demo").isEmpty()) {
                User user = new User();
                user.setEmail("user@demo");
                user.setName("Usuario Demo");
                user.setPassword(encoder.encode("user"));
                user.setRoles("USER");
                userRepository.save(user);
            }
        };
    }
}
