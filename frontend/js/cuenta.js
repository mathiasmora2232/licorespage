// Gestión de cuenta de usuario
let usuarioActual = JSON.parse(localStorage.getItem('usuario')) || null;

// Datos de ejemplo para demostración
const datosEjemplo = {
    pedidos: [
        {
            id: 'PED-001',
            fecha: '2024-01-15',
            estado: 'entregado',
            total: 156.50,
            productos: [
                { nombre: 'Vino Tinto Reserva', cantidad: 1, precio: 89.99 },
                { nombre: 'Whisky Single Malt', cantidad: 1, precio: 180.00 }
            ]
        },
        {
            id: 'PED-002',
            fecha: '2024-01-10',
            estado: 'enviado',
            total: 97.50,
            productos: [
                { nombre: 'Vodka Premium', cantidad: 1, precio: 65.00 },
                { nombre: 'Cerveza Artesanal IPA', cantidad: 2, precio: 12.50 }
            ]
        },
        {
            id: 'PED-003',
            fecha: '2024-01-05',
            estado: 'pendiente',
            total: 220.00,
            productos: [
                { nombre: 'Champagne Brut', cantidad: 1, precio: 120.00 },
                { nombre: 'Ron Añejo 7 Años', cantidad: 1, precio: 95.50 }
            ]
        }
    ],
    direcciones: [
        {
            id: 1,
            tipo: 'casa',
            nombre: 'Casa Principal',
            direccion: 'Calle Principal 123',
            ciudad: 'Ciudad Ejemplo',
            codigoPostal: '12345',
            telefono: '+1 234 567 8900',
            principal: true
        },
        {
            id: 2,
            tipo: 'trabajo',
            nombre: 'Oficina',
            direccion: 'Av. Comercial 456',
            ciudad: 'Ciudad Ejemplo',
            codigoPostal: '12346',
            telefono: '+1 234 567 8901',
            principal: false
        }
    ],
    favoritos: [
        { id: 1, nombre: 'Vino Tinto Reserva', precio: 89.99, imagen: 'vino.jpg' },
        { id: 3, nombre: 'Whisky Single Malt', precio: 180.00, imagen: 'whisky.png' },
        { id: 6, nombre: 'Champagne Brut', precio: 120.00, imagen: 'vino.jpg' }
    ]
};

// Inicialización
function inicializarCuenta() {
    verificarAutenticacion();
    configurarEventosAuth();
    configurarEventosUsuario();
    actualizarContadorCarrito();
}

function verificarAutenticacion() {
    const authSection = document.getElementById('auth-section');
    const userPanel = document.getElementById('user-panel');
    
    if (usuarioActual) {
        // Usuario autenticado
        if (authSection) authSection.style.display = 'none';
        if (userPanel) {
            userPanel.style.display = 'block';
            cargarDatosUsuario();
        }
    } else {
        // Usuario no autenticado
        if (authSection) authSection.style.display = 'block';
        if (userPanel) userPanel.style.display = 'none';
    }
}

function cargarDatosUsuario() {
    // Actualizar nombre de usuario
    const userName = document.getElementById('user-name');
    if (userName && usuarioActual) {
        userName.textContent = usuarioActual.nombre;
    }

    // Actualizar información del perfil
    actualizarPerfilUI();
    cargarPedidos();
    cargarDirecciones();
    cargarFavoritos();
}

// Funciones de autenticación
function configurarEventosAuth() {
    // Pestañas de login/registro
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            cambiarTab(tab);
        });
    });

    // Formularios
    const loginForm = document.querySelector('#login-form form');
    const registerForm = document.querySelector('#register-form form');

    if (loginForm) {
        loginForm.addEventListener('submit', manejarLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', manejarRegistro);
    }
}

function cambiarTab(tab) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Actualizar formularios
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
}

function manejarLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const recordar = document.getElementById('remember-me').checked;

    // Validación básica
    if (!email || !password) {
        mostrarNotificacion('❌ Por favor completa todos los campos', 'error');
        return;
    }

    // Simular autenticación
    mostrarCargando('Iniciando sesión...');
    
    setTimeout(() => {
        ocultarCargando();
        
        // Crear usuario simulado
        usuarioActual = {
            id: 1,
            nombre: 'Juan Pérez',
            apellido: 'González',
            email: email,
            telefono: '+1 234 567 8900',
            fechaRegistro: '2024-01-15'
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        if (recordar) {
            localStorage.setItem('recordarUsuario', 'true');
        }

        mostrarNotificacion('🎉 ¡Bienvenido de vuelta!', 'success');
        verificarAutenticacion();
    }, 2000);
}

function manejarRegistro(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('register-name').value;
    const apellido = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const telefono = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const aceptaTerminos = document.getElementById('accept-terms').checked;

    // Validaciones
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
        mostrarNotificacion('❌ Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    if (password !== confirmPassword) {
        mostrarNotificacion('❌ Las contraseñas no coinciden', 'error');
        return;
    }

    if (!aceptaTerminos) {
        mostrarNotificacion('❌ Debes aceptar los términos y condiciones', 'error');
        return;
    }

    // Simular registro
    mostrarCargando('Creando tu cuenta...');
    
    setTimeout(() => {
        ocultarCargando();
        
        usuarioActual = {
            id: Date.now(),
            nombre: nombre,
            apellido: apellido,
            email: email,
            telefono: telefono,
            fechaRegistro: new Date().toISOString().split('T')[0]
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        
        mostrarNotificacion('🎉 ¡Cuenta creada exitosamente! Bienvenido!', 'success');
        verificarAutenticacion();
    }, 2000);
}

// Funciones del panel de usuario
function configurarEventosUsuario() {
    // Navegación del panel
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            if (section) {
                cambiarSeccion(section);
            }
        });
    });

    // Botón cerrar sesión
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', cerrarSesion);
    }

    // Otros botones
    configurarBotonesSeccion();
}

function cambiarSeccion(seccionId) {
    // Actualizar navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${seccionId}"]`).classList.add('active');

    // Actualizar contenido
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section-${seccionId}`).classList.add('active');
}

function configurarBotonesSeccion() {
    // Botón editar perfil
    const btnEditPerfil = document.getElementById('btn-edit-perfil');
    if (btnEditPerfil) {
        btnEditPerfil.addEventListener('click', editarPerfil);
    }

    // Botón agregar dirección
    const btnAddDireccion = document.getElementById('btn-add-direccion');
    if (btnAddDireccion) {
        btnAddDireccion.addEventListener('click', agregarDireccion);
    }

    // Botón eliminar cuenta
    const btnDeleteAccount = document.getElementById('btn-delete-account');
    if (btnDeleteAccount) {
        btnDeleteAccount.addEventListener('click', eliminarCuenta);
    }

    // Filtro de pedidos
    const filterPedidos = document.getElementById('filter-pedidos');
    if (filterPedidos) {
        filterPedidos.addEventListener('change', (e) => {
            filtrarPedidos(e.target.value);
        });
    }

    // Toggles de configuración
    configurarToggles();
}

function actualizarPerfilUI() {
    if (!usuarioActual) return;

    const elementos = {
        'profile-name': `${usuarioActual.nombre} ${usuarioActual.apellido}`,
        'profile-email': usuarioActual.email,
        'profile-phone': usuarioActual.telefono,
        'profile-date': formatearFecha(usuarioActual.fechaRegistro)
    };

    Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });
}

function cargarPedidos(filtro = 'todos') {
    const container = document.getElementById('pedidos-list');
    if (!container) return;

    let pedidosFiltrados = datosEjemplo.pedidos;
    
    if (filtro !== 'todos') {
        pedidosFiltrados = datosEjemplo.pedidos.filter(p => p.estado === filtro);
    }

    if (pedidosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem; margin-bottom: 15px;">📦</div>
                <h3>No hay pedidos</h3>
                <p>No se encontraron pedidos con el filtro seleccionado</p>
            </div>
        `;
        return;
    }

    container.innerHTML = pedidosFiltrados.map(pedido => `
        <div class="pedido-card">
            <div class="pedido-header">
                <div class="pedido-info">
                    <h4>Pedido ${pedido.id}</h4>
                    <p>${formatearFecha(pedido.fecha)}</p>
                </div>
                <div class="pedido-estado ${pedido.estado}">
                    ${getEstadoIcon(pedido.estado)} ${capitalizeFirst(pedido.estado)}
                </div>
            </div>
            <div class="pedido-productos">
                ${pedido.productos.map(p => `
                    <div class="producto-pedido">
                        <span>${p.nombre}</span>
                        <span>${p.cantidad}x $${p.precio.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="pedido-total">
                <strong>Total: $${pedido.total.toFixed(2)}</strong>
            </div>
        </div>
    `).join('');
}

function cargarDirecciones() {
    const container = document.getElementById('direcciones-list');
    if (!container) return;

    container.innerHTML = datosEjemplo.direcciones.map(direccion => `
        <div class="direccion-card ${direccion.principal ? 'principal' : ''}">
            <div class="direccion-header">
                <h4>${direccion.nombre}</h4>
                <div class="direccion-actions">
                    ${direccion.principal ? '<span class="badge-principal">📍 Principal</span>' : ''}
                    <button class="btn-sm" onclick="editarDireccion(${direccion.id})">✏️</button>
                    <button class="btn-sm btn-danger" onclick="eliminarDireccion(${direccion.id})">🗑️</button>
                </div>
            </div>
            <div class="direccion-info">
                <p><strong>📍 Dirección:</strong> ${direccion.direccion}</p>
                <p><strong>🏙️ Ciudad:</strong> ${direccion.ciudad} - ${direccion.codigoPostal}</p>
                <p><strong>📞 Teléfono:</strong> ${direccion.telefono}</p>
            </div>
        </div>
    `).join('');
}

function cargarFavoritos() {
    const container = document.getElementById('favoritos-grid');
    if (!container) return;

    if (datosEjemplo.favoritos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem; margin-bottom: 15px;">❤️</div>
                <h3>Sin favoritos</h3>
                <p>Aún no has agregado productos a tus favoritos</p>
                <a href="productos.html" class="btn-primary">Explorar Productos</a>
            </div>
        `;
        return;
    }

    container.innerHTML = datosEjemplo.favoritos.map(producto => `
        <div class="favorito-card">
            <img src="img/${producto.imagen}" alt="${producto.nombre}" 
                 onerror="this.src='img/club.jpg'">
            <h4>${producto.nombre}</h4>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <div class="favorito-actions">
                <button class="btn-primary btn-sm" onclick="agregarAlCarritoDesdeF avoritos(${producto.id})">
                    🛒 Agregar
                </button>
                <button class="btn-sm btn-danger" onclick="quitarDeFavoritos(${producto.id})">
                    💔 Quitar
                </button>
            </div>
        </div>
    `).join('');
}

// Funciones auxiliares
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getEstadoIcon(estado) {
    const iconos = {
        'pendiente': '⏳',
        'enviado': '🚚',
        'entregado': '✅'
    };
    return iconos[estado] || '📦';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function filtrarPedidos(filtro) {
    cargarPedidos(filtro);
}

function configurarToggles() {
    const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const setting = e.target.id;
            const value = e.target.checked;
            localStorage.setItem(`config_${setting}`, value);
            mostrarNotificacion(`⚙️ Configuración ${setting} ${value ? 'activada' : 'desactivada'}`, 'info');
        });

        // Cargar configuración guardada
        const savedValue = localStorage.getItem(`config_${toggle.id}`);
        if (savedValue !== null) {
            toggle.checked = savedValue === 'true';
        }
    });
}

// Funciones de acción
function editarPerfil() {
    mostrarNotificacion('🚧 Función de edición en desarrollo', 'info');
}

function agregarDireccion() {
    mostrarNotificacion('🚧 Función para agregar direcciones en desarrollo', 'info');
}

function editarDireccion(id) {
    mostrarNotificacion(`🚧 Editar dirección ${id} - en desarrollo`, 'info');
}

function eliminarDireccion(id) {
    mostrarNotificacion(`🗑️ Eliminar dirección ${id} - en desarrollo`, 'warning');
}

function quitarDeFavoritos(id) {
    mostrarNotificacion(`💔 Producto quitado de favoritos`, 'info');
    // Aquí iría la lógica para quitar de favoritos
    setTimeout(() => cargarFavoritos(), 1000);
}

function agregarAlCarritoDesdeF avoritos(id) {
    const producto = datosEjemplo.favoritos.find(p => p.id === id);
    if (producto) {
        // Agregar al carrito (requiere función del carrito)
        mostrarNotificacion(`🛒 ${producto.nombre} agregado al carrito`, 'success');
    }
}

function eliminarCuenta() {
    mostrarConfirmacion(
        '⚠️ ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
        () => {
            cerrarSesion();
            mostrarNotificacion('🗑️ Cuenta eliminada exitosamente', 'warning');
        }
    );
}

function cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('recordarUsuario');
    usuarioActual = null;
    
    mostrarNotificacion('👋 ¡Hasta pronto!', 'info');
    setTimeout(() => {
        window.location.href = 'inicio.html';
    }, 1500);
}

// Funciones de UI
function mostrarCargando(mensaje) {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.8); display: flex; align-items: center; 
                    justify-content: center; z-index: 20000;">
            <div style="background: white; padding: 40px; border-radius: 20px; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 20px; animation: spin 1s linear infinite;">⏳</div>
                <h3>${mensaje}</h3>
            </div>
        </div>
    `;
    document.body.appendChild(loading);
}

function ocultarCargando() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        document.body.removeChild(loading);
    }
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const colores = {
        success: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
        error: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
        warning: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
        info: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
    };

    const notif = document.createElement('div');
    notif.className = 'notificacion';
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colores[tipo]};
        color: white;
        padding: 15px 25px;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => notif.style.transform = 'translateX(0)', 100);
    
    setTimeout(() => {
        notif.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notif), 300);
    }, 4000);
}

function mostrarConfirmacion(mensaje, callback) {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.7); display: flex; align-items: center; 
                    justify-content: center; z-index: 15000;">
            <div style="background: white; padding: 30px; border-radius: 20px; text-align: center; max-width: 400px;">
                <h3>⚠️ Confirmación</h3>
                <p>${mensaje}</p>
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                    <button class="btn-cancelar" style="padding: 10px 20px; border: none; border-radius: 10px; 
                                                       background: #f5f5f5; cursor: pointer;">Cancelar</button>
                    <button class="btn-confirmar" style="padding: 10px 20px; border: none; border-radius: 10px; 
                                                        background: #ff6b6b; color: white; cursor: pointer;">Confirmar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.querySelector('.btn-cancelar').onclick = () => {
        document.body.removeChild(overlay);
    };
    
    overlay.querySelector('.btn-confirmar').onclick = () => {
        document.body.removeChild(overlay);
        callback();
    };
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contadores = document.querySelectorAll('.cart-count');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    contadores.forEach(contador => {
        contador.textContent = totalItems;
        if (totalItems > 0) {
            contador.style.display = 'inline-block';
        } else {
            contador.style.display = 'none';
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarCuenta();
});

// Agregar estilos dinámicos
const estilosCuenta = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .empty-state {
        text-align: center;
        padding: 40px;
        color: #666;
    }
    
    .pedido-card {
        background: rgba(248, 249, 250, 0.8);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 15px;
        border: 1px solid #e0e0e0;
    }
    
    .pedido-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .pedido-estado {
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .pedido-estado.pendiente { background: #fff3cd; color: #856404; }
    .pedido-estado.enviado { background: #d1ecf1; color: #0c5460; }
    .pedido-estado.entregado { background: #d4edda; color: #155724; }
    
    .producto-pedido {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .direccion-card {
        background: rgba(248, 249, 250, 0.8);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 15px;
        border: 1px solid #e0e0e0;
    }
    
    .direccion-card.principal {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.05);
    }
    
    .direccion-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .direccion-actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .badge-principal {
        background: #667eea;
        color: white;
        padding: 3px 8px;
        border-radius: 10px;
        font-size: 0.8rem;
    }
    
    .btn-sm {
        padding: 5px 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.8rem;
        background: #f0f0f0;
    }
    
    .btn-sm.btn-danger {
        background: #ff6b6b;
        color: white;
    }
    
    .favorito-card {
        background: white;
        border-radius: 15px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    
    .favorito-card:hover {
        transform: translateY(-5px);
    }
    
    .favorito-card img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 10px;
    }
    
    .favorito-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 15px;
    }
    
    #favoritos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
    }
`;

const styleCuenta = document.createElement('style');
styleCuenta.textContent = estilosCuenta;
document.head.appendChild(styleCuenta);
