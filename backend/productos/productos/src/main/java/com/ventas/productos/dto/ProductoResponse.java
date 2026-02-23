package com.ventas.productos.dto;

import com.ventas.productos.model.Producto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagenUrl;
    private String categoria;
    private Integer stock;
    private String createdAt;
    private String updatedAt;

    public static ProductoResponse fromProducto(Producto p) {
        ProductoResponse pr = new ProductoResponse();
        pr.setId(p.getId());
        pr.setNombre(p.getNombre());
        pr.setDescripcion(p.getDescripcion());
        pr.setPrecio(p.getPrecio());
        pr.setImagenUrl(p.getImagen());
        pr.setCategoria(p.getCategoria());
        pr.setStock(p.getStock());
        if (p.getCreatedAt() != null) pr.setCreatedAt(p.getCreatedAt().toString());
        if (p.getUpdatedAt() != null) pr.setUpdatedAt(p.getUpdatedAt().toString());
        return pr;
    }
}
