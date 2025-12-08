document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    actualizarResumen();
});

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const carritoVacio = document.getElementById("carrito-vacio");
    const carritoItems = document.getElementById("carrito-items");

    if (carrito.length === 0) {
        carritoVacio.classList.remove("hidden");
        carritoItems.classList.add("hidden");
        return;
    }
    carritoVacio.classList.add("hidden");
    carritoItems.classList.remove("hidden");

    carritoItems.innerHTML = "";

    carrito.forEach(producto => {
        carritoItems.innerHTML += `
            <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow">
                <div class="flex items-center gap-4">
                    <img src="${producto.imagen}" class="w-20 h-20 object-cover rounded-lg shadow-md">
                    <div>
                        <h3 class="font-semibold text-gray-800">${producto.nombre}</h3>
                        <p class="text-gray-600">$${producto.precio.toLocaleString()}</p>
                        <p class="text-gray-600 text-sm">Cantidad: ${producto.cantidad}</p>
                    </div>
                </div>
                <button onclick="eliminarProducto('${producto.id}')" class="text-red-600 font-bold hover:underline">
                    Eliminar
                </button>
            </div>
        `;
    });
}

function eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
    actualizarResumen();
}

function actualizarResumen() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    document.getElementById("subtotal").innerText = `$${subtotal.toLocaleString()}`;
    document.getElementById("total").innerText = `$${subtotal.toLocaleString()}`;
}

async function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // Validar datos del formulario
    const direccion = document.getElementById("direccion").value.trim();
    const ciudad = document.getElementById("ciudad").value.trim();
    const codigoPostal = document.getElementById("codigo-postal").value.trim();
    const metodoPago = document.getElementById("metodo-pago").value;

    if (!direccion || !ciudad || !codigoPostal) {
        alert("Por favor completa toda la información de envío.");
        return;
    }

    // Obtener datos del usuario
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario.email) {
        alert("Debes iniciar sesión para realizar la compra.");
        window.location.href = "login.html";
        return;
    }

    if (!usuario.telefono) {
        alert("Tu perfil no tiene número de teléfono. Por favor actualiza tu información.");
        return;
    }

    // Deshabilitar botón
    const btnFinalizar = document.getElementById("btn-finalizar");
    btnFinalizar.disabled = true;
    btnFinalizar.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Procesando...
    `;

    // CALCULAR EL TOTAL
    const precio_total = carrito.reduce((total, item) => {
        return total + (parseFloat(item.precio || item.Precio) * parseInt(item.cantidad));
    }, 0);

    // Preparar estructura del pedido
    const pedido = {
        productos: carrito.map(item => ({
            producto_id: item._id || item.id,
            nombre: item.nombre || item.Nombre,
            precio: parseFloat(item.precio || item.Precio),
            cantidad: parseInt(item.cantidad)
        })),
        precio_total: precio_total,  // ✅ Enviar el total calculado
        email: usuario.email,
        telefono: usuario.telefono.toString(),
        direccion: `${direccion}, ${ciudad}, ${codigoPostal}`,
        metodo_pago: metodoPago
    };
    console.log("📦 Pedido a enviar:", pedido);
    try {
        const response = await fetch("https://ecomerce-c5tt.onrender.com/api/pedido", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });
        const data = await response.json();
        if (response.ok) {
            alert(`✅ ¡Pedido realizado con éxito!\n\nID: ${data.pedido.id}\nTotal: $${data.pedido.total.toLocaleString()}`);
            localStorage.removeItem("carrito");
            window.location.href = "index.html";
        } else {
            console.error("Error del servidor:", data);
            alert("❌ Error al procesar el pedido:\n" + (data.message || "Error desconocido"));         
            if (data.errores) {
                alert("Detalles:\n" + data.errores.join("\n"));
            }
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("❌ Error de conexión con el servidor.\nVerifica que el servidor esté ejecutándose.");
    } finally {
        // Rehabilitar botón
        btnFinalizar.disabled = false;
        btnFinalizar.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Finalizar Compra
        `;
    }
}


