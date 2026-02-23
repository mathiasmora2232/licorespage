package com.ventas.productos.exception;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String message) {
        super(message);
    }

    public EntityNotFoundException(String entityType, Long id) {
        super(entityType + " no encontrado con ID: " + id);
    }
}
