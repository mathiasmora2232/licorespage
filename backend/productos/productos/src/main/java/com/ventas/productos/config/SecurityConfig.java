package com.ventas.productos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

// Configuración para permitir acceso público al endpoint de productos
@org.springframework.context.annotation.Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/productos/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin()
            .and()
            .httpBasic();
        return http.build();
    }
}
