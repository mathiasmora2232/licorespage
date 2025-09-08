// Gestión del carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Funciones principales del carrito
function inicializarCarrito() {
    actualizarContadorCarrito();
    mostrarCarrito();
    configurarEventosCarrito();
    aplicarCodigosPredefinidos();
}

function actualizarContadorCarrito() {
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

function mostrarCarrito() {
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoConProductos = document.getElementById('carrito-con-productos');
    const listaProductos = document.getElementById('lista-productos-carrito');

    if (!carritoVacio || !carritoConProductos) return;

    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoConProductos.style.display = 'none';
        return;
    }

    carritoVacio.style.display = 'none';
    carritoConProductos.style.display = 'block';

    // Renderizar productos del carrito
    if (listaProductos) {
        listaProductos.innerHTML = carrito.map(item => `
            <div class="producto-carrito" data-id="${item.id}">
                <div class="producto-info-carrito">
                    <div class="producto-img-carrito">
                        <img src="img/${item.imagen || 'club.jpg'}" alt="${item.nombre}" 
                             onerror="this.src='img/club.jpg'">
                    </div>
                    <div class="producto-detalles">
                        <h4>${item.nombre}</h4>
                        <p>Producto premium seleccionado</p>
                    </div>
                </div>
                <div class="producto-precio">$${item.precio.toFixed(2)}</div>
                <div class="cantidad-control">
                    <button class="cantidad-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <input type="number" class="cantidad-input" value="${item.cantidad}" 
                           onchange="actualizarCantidad(${item.id}, this.value)" min="1" max="10">
                    <button class="cantidad-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                </div>
                <div class="producto-subtotal">$${(item.precio * item.cantidad).toFixed(2)}</div>
                <div class="producto-acciones">
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    actualizarResumen();
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (!item) return;

    const nuevaCantidad = item.cantidad + cambio;
    if (nuevaCantidad < 1) {
        eliminarDelCarrito(id);
        return;
    }

    if (nuevaCantidad > 10) return; // Límite máximo

    item.cantidad = nuevaCantidad;
    guardarCarrito();
    mostrarCarrito();
}

function actualizarCantidad(id, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    if (cantidad < 1 || cantidad > 10) return;

    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad = cantidad;
        guardarCarrito();
        mostrarCarrito();
    }
}

function eliminarDelCarrito(id) {
    const item = carrito.find(item => item.id === id);
    if (!item) return;

    mostrarConfirmacion(
        `¿Estás seguro de que quieres eliminar "${item.nombre}" del carrito?`,
        () => {
            carrito = carrito.filter(item => item.id !== id);
            guardarCarrito();
            mostrarCarrito();
            mostrarNotificacion('🗑️ Producto eliminado del carrito', 'warning');
        }
    );
}

function limpiarCarrito() {
    if (carrito.length === 0) return;

    mostrarConfirmacion(
        '¿Estás seguro de que quieres vaciar todo el carrito?',
        () => {
            carrito = [];
            guardarCarrito();
            mostrarCarrito();
            mostrarNotificacion('🧹 Carrito vaciado completamente', 'info');
        }
    );
}

function actualizarResumen() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = subtotal > 100 ? 0 : 15; // Envío gratis para compras mayores a $100
    const descuentoActual = parseFloat(localStorage.getItem('descuento') || '0');
    const total = subtotal + envio - descuentoActual;

    // Actualizar elementos del DOM
    const elementoSubtotal = document.getElementById('subtotal');
    const elementoEnvio = document.getElementById('envio');
    const elementoDescuento = document.getElementById('descuento');
    const elementoTotal = document.getElementById('total');

    if (elementoSubtotal) elementoSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elementoEnvio) {
        elementoEnvio.textContent = envio === 0 ? 'GRATIS' : `$${envio.toFixed(2)}`;
        if (envio === 0) {
            elementoEnvio.style.color = '#4caf50';
            elementoEnvio.style.fontWeight = 'bold';
        }
    }
    if (elementoDescuento) elementoDescuento.textContent = `-$${descuentoActual.toFixed(2)}`;
    if (elementoTotal) elementoTotal.innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
}

function aplicarCodigoPredefinidos() {
    const codigosPredefinidos = {
        'BIENVENIDO': 10,
        'PRIMERA': 15,
        'VERANO2024': 20,
        'PREMIUM': 25
    };
    return codigosPredefinidos;
}

function aplicarCodigoDescuento() {
    const inputCodigo = document.getElementById('input-codigo');
    if (!inputCodigo) return;

    const codigo = inputCodigo.value.trim().toUpperCase();
    const codigosPredefinidos = aplicarCodigoPredefinidos();

    if (!codigo) {
        mostrarNotificacion('❌ Por favor ingresa un código válido', 'error');
        return;
    }

    if (codigosPredefinidos[codigo]) {
        const descuento = codigosPredefinidos[codigo];
        localStorage.setItem('descuento', descuento.toString());
        localStorage.setItem('codigoAplicado', codigo);
        
        inputCodigo.value = '';
        inputCodigo.placeholder = `✅ Código ${codigo} aplicado`;
        inputCodigo.disabled = true;
        
        actualizarResumen();
        mostrarNotificacion(`🎉 ¡Código ${codigo} aplicado! Descuento de $${descuento}`, 'success');
    } else {
        mostrarNotificacion('❌ Código de descuento no válido', 'error');
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Funciones de UI
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
    const modal = document.getElementById('modal-confirmacion');
    const mensajeElement = document.getElementById('mensaje-confirmacion');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const btnCancelar = document.getElementById('btn-cancelar');

    if (!modal || !mensajeElement) return;

    mensajeElement.textContent = mensaje;
    modal.style.display = 'block';

    // Configurar botones
    btnConfirmar.onclick = () => {
        modal.style.display = 'none';
        callback();
    };

    btnCancelar.onclick = () => {
        modal.style.display = 'none';
    };
}

function abrirCheckout() {
    if (carrito.length === 0) {
        mostrarNotificacion('🛒 Tu carrito está vacío', 'warning');
        return;
    }

    const modal = document.getElementById('modal-checkout');
    if (modal) {
        modal.style.display = 'block';
        configurarFormularioCheckout();
    }
}

function configurarFormularioCheckout() {
    const form = document.getElementById('form-checkout');
    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();
        procesarPedido();
    };

    // Validación en tiempo real
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validarCampo);
        input.addEventListener('input', limpiarError);
    });

    // Formatear número de tarjeta
    const numeroTarjeta = document.getElementById('numero-tarjeta');
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', formatearNumeroTarjeta);
    }

    // Formatear fecha de expiración
    const fechaExpiracion = document.getElementById('fecha-expiracion');
    if (fechaExpiracion) {
        fechaExpiracion.addEventListener('input', formatearFechaExpiracion);
    }
}

function validarCampo(e) {
    const campo = e.target;
    const valor = campo.value.trim();

    // Remover error previo
    campo.classList.remove('error');
    
    if (!valor && campo.required) {
        campo.classList.add('error');
        return false;
    }

    // Validaciones específicas
    if (campo.type === 'email' && !validarEmail(valor)) {
        campo.classList.add('error');
        return false;
    }

    if (campo.id === 'numero-tarjeta' && !validarNumeroTarjeta(valor)) {
        campo.classList.add('error');
        return false;
    }

    return true;
}

function limpiarError(e) {
    e.target.classList.remove('error');
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarNumeroTarjeta(numero) {
    return /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(numero);
}

function formatearNumeroTarjeta(e) {
    let valor = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    let valorFormateado = valor.match(/.{1,4}/g)?.join(' ') || valor;
    e.target.value = valorFormateado.substring(0, 19);
}

function formatearFechaExpiracion(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length >= 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }
    e.target.value = valor;
}

function procesarPedido() {
    // Simular procesamiento de pago
    const modal = document.getElementById('modal-checkout');
    modal.style.display = 'none';

    // Mostrar loading
    const loading = document.createElement('div');
    loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.8); display: flex; align-items: center; 
                    justify-content: center; z-index: 20000;">
            <div style="background: white; padding: 40px; border-radius: 20px; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 20px;">🔄</div>
                <h3>Procesando tu pedido...</h3>
                <p>Por favor espera mientras confirmamos tu compra</p>
            </div>
        </div>
    `;
    document.body.appendChild(loading);

    // Simular procesamiento
    setTimeout(() => {
        document.body.removeChild(loading);
        
        // Limpiar carrito y mostrar éxito
        carrito = [];
        localStorage.removeItem('carrito');
        localStorage.removeItem('descuento');
        localStorage.removeItem('codigoAplicado');
        
        guardarCarrito();
        mostrarCarrito();
        
        mostrarNotificacion('🎉 ¡Pedido confirmado! Recibirás un email con los detalles', 'success');
        
        // Redireccionar a inicio después de 3 segundos
        setTimeout(() => {
            window.location.href = 'inicio.html';
        }, 3000);
    }, 3000);
}

function configurarEventosCarrito() {
    // Botón limpiar carrito
    const btnLimpiar = document.getElementById('btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarCarrito);
    }

    // Botón proceder al pago
    const btnProceder = document.getElementById('btn-proceder');
    if (btnProceder) {
        btnProceder.addEventListener('click', abrirCheckout);
    }

    // Botón aplicar código
    const btnAplicarCodigo = document.getElementById('btn-aplicar-codigo');
    if (btnAplicarCodigo) {
        btnAplicarCodigo.addEventListener('click', aplicarCodigoDescuento);
    }

    // Enter en input de código
    const inputCodigo = document.getElementById('input-codigo');
    if (inputCodigo) {
        inputCodigo.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                aplicarCodigoDescuento();
            }
        });
    }

    // Cerrar modales
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // Verificar código aplicado previamente
    const codigoAplicado = localStorage.getItem('codigoAplicado');
    if (codigoAplicado && inputCodigo) {
        inputCodigo.placeholder = `✅ Código ${codigoAplicado} aplicado`;
        inputCodigo.disabled = true;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrito();
});

// Agregar estilos para validación
const estilosValidacion = `
    .error {
        border-color: #ff6b6b !important;
        box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2) !important;
    }
    
    .loading-overlay {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const styleValidacion = document.createElement('style');
styleValidacion.textContent = estilosValidacion;
document.head.appendChild(styleValidacion);
