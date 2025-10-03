package com.ventas.productos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.ventas.productos.model.Producto;
import com.ventas.productos.repository.ProductoRepository;

@SpringBootApplication
public class ProductosApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductosApplication.class, args);
	}

	@Bean
	CommandLineRunner initProductos(ProductoRepository productoRepository) {
		return args -> {
			if (productoRepository.count() == 0) {
				productoRepository.save(new ProductoBuilder()
					.nombre("Vino Tinto Premium")
					.descripcion("Elegancia y sabor en cada copa.")
					.precio(19990.0)
					.imagen("vino.png")
					.build());
				productoRepository.save(new ProductoBuilder()
					.nombre("Whisky Escocés")
					.descripcion("Tradición y carácter único.")
					.precio(29990.0)
					.imagen("whisky.png")
					.build());
				productoRepository.save(new ProductoBuilder()
					.nombre("Cerveza Artesanal")
					.descripcion("Refrescante y llena de sabor.")
					.precio(5990.0)
					.imagen("cerveza.png")
					.build());
			}
		};
	}
}

// Builder para facilitar la creación de productos
class ProductoBuilder {
	private final Producto producto = new Producto();
	ProductoBuilder nombre(String nombre) { producto.setNombre(nombre); return this; }
	ProductoBuilder descripcion(String descripcion) { producto.setDescripcion(descripcion); return this; }
	ProductoBuilder precio(Double precio) { producto.setPrecio(precio); return this; }
	ProductoBuilder imagen(String imagen) { producto.setImagen(imagen); return this; }
	Producto build() { return producto; }

}
