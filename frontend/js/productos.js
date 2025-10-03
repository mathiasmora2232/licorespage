// Este script obtiene productos desde la API y los muestra en la sección destacados
async function cargarProductos() {
    const grid = document.querySelector('.productos-grid');
    if (!grid) return;
    grid.innerHTML = '<span>Cargando productos...</span>';
    try {
    const resp = await fetch('http://localhost:8081/api/productos');
        if (!resp.ok) throw new Error('Error al obtener productos');
        const productos = await resp.json();
        if (!Array.isArray(productos) || productos.length === 0) {
            grid.innerHTML = '<span>No hay productos disponibles.</span>';
            return;
        }
        grid.innerHTML = productos.map(prod => `
            <div class="producto">
                <img src="img/${prod.imagen || 'licor.png'}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
                <span class="precio">$${prod.precio}</span>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = `<span>Error: ${err.message}</span>`;
    }
}

window.addEventListener('DOMContentLoaded', cargarProductos);