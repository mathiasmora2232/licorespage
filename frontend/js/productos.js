// Productos de ejemplo con más datos
const productosEjemplo = [
    {
        id: 1,
        nombre: "Vino Tinto Reserva",
        descripcion: "Vino tinto de excelente calidad con notas frutales",
        precio: 89.99,
        imagen: "vino.jpg",
        categoria: "vinos",
        stock: 15
    },
    {
        id: 2,
        nombre: "Cerveza Artesanal IPA",
        descripcion: "Cerveza artesanal con intenso sabor a lúpulo",
        precio: 12.50,
        imagen: "593.png",
        categoria: "cervezas",
        stock: 30
    },
    {
        id: 3,
        nombre: "Whisky Single Malt",
        descripcion: "Whisky escocés envejecido 12 años",
        precio: 180.00,
        imagen: "whisky.png",
        categoria: "whisky",
        stock: 8
    },
    {
        id: 4,
        nombre: "Vodka Premium",
        descripcion: "Vodka ultra premium destilado 5 veces",
        precio: 65.00,
        imagen: "club.jpg",
        categoria: "vodka",
        stock: 20
    },
    {
        id: 5,
        nombre: "Ron Añejo 7 Años",
        descripcion: "Ron caribeño envejecido en barricas de roble",
        precio: 95.50,
        imagen: "club.jpg",
        categoria: "ron",
        stock: 12
    },
    {
        id: 6,
        nombre: "Champagne Brut",
        descripcion: "Champagne francés con burbujas refinadas",
        precio: 120.00,
        imagen: "vino.jpg",
        categoria: "vinos",
        stock: 6
    }
];

// Variables globales
let productos = [];
let productosFiltrados = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Funciones principales
async function cargarProductos() {
    const grid = document.querySelector('.productos-grid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading">🔄 Cargando productos...</div>';
    
    try {
        // Intentar cargar desde la API
        const resp = await fetch('http://localhost:8081/api/productos');
        if (resp.ok) {
            productos = await resp.json();
        } else {
            throw new Error('API no disponible');
        }
    } catch (err) {
        console.log('Usando productos de ejemplo:', err.message);
        productos = productosEjemplo;
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        grid.innerHTML = '<div class="no-productos">📦 No hay productos disponibles</div>';
        return;
    }

    productosFiltrados = productos;
    mostrarProductos();
    actualizarContadorCarrito();
}

function mostrarProductos() {
    const grid = document.querySelector('.productos-grid');
    const esInicio = window.location.pathname.includes('inicio.html') || window.location.pathname === '/';
    
    if (!grid) return;

    // En la página de inicio, mostrar solo los primeros 3 productos
    const productosAMostrar = esInicio ? productosFiltrados.slice(0, 3) : productosFiltrados;

    if (productosAMostrar.length === 0) {
        grid.innerHTML = '<div class="no-productos">🔍 No se encontraron productos</div>';
        return;
    }

    grid.innerHTML = productosAMostrar.map(prod => {
        if (esInicio) {
            // Vista simple para inicio
            return `
                <div class="producto" data-id="${prod.id}">
                    <img src="img/${prod.imagen || 'licor.png'}" alt="${prod.nombre}" 
                         onerror="this.src='img/club.jpg'">
                    <h3>${prod.nombre}</h3>
                    <p>${prod.descripcion}</p>
                    <span class="precio">$${prod.precio.toFixed(2)}</span>
                </div>
            `;
        } else {
            // Vista completa para página de productos
            const categoriaLabel = getCategoriaLabel(prod.categoria);
            const badgeHtml = categoriaLabel ? `<div class="categoria-badge">${categoriaLabel}</div>` : '';
            return `
                <div class="producto-card" data-id="${prod.id}" data-categoria="${prod.categoria}">
                    ${badgeHtml}
                    <div class="producto-imagen">
                        <img src="img/${prod.imagen || 'licor.png'}" alt="${prod.nombre}" 
                             onerror="this.src='img/club.jpg'">
                    </div>
                    <div class="producto-info">
                        <h3>${prod.nombre}</h3>
                        <p>${prod.descripcion}</p>
                        <div class="producto-precio">$${prod.precio.toFixed(2)}</div>
                        <button class="btn-ver-detalles" onclick="abrirModalProducto(${prod.id})">
                            👁️ Ver Detalles
                        </button>
                    </div>
                </div>
            `;
        }
    }).join('');
}

function getCategoriaLabel(categoria) {
    const labels = {
        'vinos': '🍷 Vinos',
        'cervezas': '🍺 Cervezas', 
        'whisky': '🥃 Whisky',
        'vodka': '🍸 Vodka',
        'ron': '🏴‍☠️ Ron'
    };
    if (!categoria) return '';
    return labels[categoria] || categoria;
}

// Funciones del carrito
function actualizarContadorCarrito() {
    const contador = document.querySelector('.cart-count');
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
        
        if (totalItems > 0) {
            contador.style.display = 'inline-block';
        } else {
            contador.style.display = 'none';
        }
    }
}

function agregarAlCarrito(productoId, cantidad = 1) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`);
}

function mostrarNotificacion(mensaje) {
    // Crear notificación temporal
    const notif = document.createElement('div');
    notif.className = 'notificacion';
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    // Animar entrada
    setTimeout(() => {
        notif.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notif.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notif);
        }, 300);
    }, 3000);
}

// Modal de producto (solo para página de productos)
function abrirModalProducto(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    const modal = document.getElementById('modal-producto');
    if (!modal) return;

    // Llenar información del modal
    document.getElementById('modal-img').src = `img/${producto.imagen || 'licor.png'}`;
    document.getElementById('modal-titulo').textContent = producto.nombre;
    document.getElementById('modal-descripcion').textContent = producto.descripcion;
    document.getElementById('modal-precio').textContent = `$${producto.precio.toFixed(2)}`;
    
    // Resetear cantidad
    document.getElementById('cantidad').value = 1;
    
    // Configurar botón de agregar al carrito
    const btnAgregar = document.getElementById('btn-agregar-carrito');
    btnAgregar.onclick = () => {
        const cantidad = parseInt(document.getElementById('cantidad').value);
        agregarAlCarrito(productoId, cantidad);
        cerrarModal();
    };

    modal.style.display = 'block';
}

function cerrarModal() {
    const modal = document.getElementById('modal-producto');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Filtros (solo para página de productos)
function configurarFiltros() {
    const filtros = document.querySelectorAll('.filtro-btn');
    const buscador = document.getElementById('buscador');

    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botón activo
            filtros.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Aplicar filtro
            const categoria = btn.dataset.categoria;
            aplicarFiltros(categoria, buscador ? buscador.value : '');
        });
    });

    if (buscador) {
        buscador.addEventListener('input', (e) => {
            const categoriaActiva = document.querySelector('.filtro-btn.active')?.dataset.categoria || 'todos';
            aplicarFiltros(categoriaActiva, e.target.value);
        });
    }
}

function aplicarFiltros(categoria, busqueda) {
    productosFiltrados = productos.filter(producto => {
        const cumpleCategoria = categoria === 'todos' || producto.categoria === categoria;
        const cumpleBusqueda = !busqueda || 
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
        
        return cumpleCategoria && cumpleBusqueda;
    });
    
    mostrarProductos();
}

// Controles de cantidad en modal
function configurarControlesCantidad() {
    const btnMenos = document.getElementById('btn-menos');
    const btnMas = document.getElementById('btn-mas');
    const inputCantidad = document.getElementById('cantidad');

    if (btnMenos) {
        btnMenos.addEventListener('click', () => {
            const valor = parseInt(inputCantidad.value);
            if (valor > 1) {
                inputCantidad.value = valor - 1;
            }
        });
    }

    if (btnMas) {
        btnMas.addEventListener('click', () => {
            const valor = parseInt(inputCantidad.value);
            const max = parseInt(inputCantidad.max) || 10;
            if (valor < max) {
                inputCantidad.value = valor + 1;
            }
        });
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    configurarFiltros();
    configurarControlesCantidad();

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal-producto');
        if (modal && e.target === modal) {
            cerrarModal();
        }
    });

    // Cerrar modal con botón X
    const closeBtn = document.querySelector('.modal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModal);
    }
});

// Estilos para elementos dinámicos
const estilosDinamicos = `
    .loading, .no-productos {
        text-align: center;
        padding: 40px;
        font-size: 1.2rem;
        color: #666;
        grid-column: 1 / -1;
    }
    
    .notificacion {
        font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
    }
`;

// Agregar estilos dinámicos
const style = document.createElement('style');
style.textContent = estilosDinamicos;
document.head.appendChild(style);