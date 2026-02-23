package com.ventas.productos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "producto", indexes = {
    @Index(name = "idx_categoria", columnList = "categoria"),
    @Index(name = "idx_nombre", columnList = "nombre")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Nombre del producto es requerido")
    @Size(min = 2, max = 255, message = "Nombre debe tener entre 2 y 255 caracteres")
    private String nombre;

    @Column(columnDefinition = "TEXT")
    @Size(max = 1000, message = "Descripción no puede exceder 1000 caracteres")
    private String descripcion;

    @Column(nullable = false)
    @NotNull(message = "Precio es requerido")
    @DecimalMin(value = "0.0", inclusive = false, message = "Precio debe ser mayor a 0")
    @Digits(integer = 10, fraction = 2, message = "Precio no puede tener más de 2 decimales")
    private Double precio;

    @Column(name = "imagen_url")
    private String imagen;

    @Column(nullable = false)
    @NotBlank(message = "Categoría es requerida")
    @Size(min = 2, max = 100, message = "Categoría debe tener entre 2 y 100 caracteres")
    private String categoria;

    @Column(nullable = false)
    @Min(value = 0, message = "Stock no puede ser negativo")
    private Integer stock = 0;

    @Column(updatable = false)
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}
