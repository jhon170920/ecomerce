// Verificar que toda la página esté cargada
document.addEventListener("DOMContentLoaded", async () => {

    console.log("perfil cargado correctamente");

    // Validar sesión activa
    const sesionActiva = localStorage.getItem("sessionActiva");
    if (!sesionActiva) return;

    // Contenedor donde se insertará el menú
    const contenedor = document.getElementById("user-menu-container");
    if (!contenedor) return;

    // Recuperar información del usuario
    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil || !perfil.email) return;

    let usuario = null;

    // Solicitar datos actualizados del servidor
    try {
        const res = await fetch("http://localhost:8081/api/perfil/obtener", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: perfil.email })
        });

        const data = await res.json();
        if (!res.ok) throw new Error("No se pudo obtener el perfil");

        usuario = data.usuario;

    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;
    }

    // Crear el menú del usuario
    contenedor.innerHTML = `
    <div class ="relative">
       <button id="user-menu-btn"
            class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 transition-transform">
             <span id="user-avatar"></span>
    
        </button>
        <div id="user-dropdown"

            class="hidden absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl
                   border border-gray-100 py-2 z-50 transition-all duration-200
                   ease-out overflow-hidden transform origin-top scale-95 opacity-0">

            <div class="px-4 py-3 border-b border-gray-200">
                <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                <p class="text-xs text-gray-500" id="user-email"></p>
            </div>

            <a href="../pages/perfil.html"
                class="flex items-center px-4 py-3 text-sm text-gray-700 
                       hover:bg-blue-100 hover:text-blue-800 rounded-md cursor-pointer">
                Mi Perfil
            </a>

            <button id="logout-btn"
                class="flex items-center w-full px-4 py-3 text-sm text-gray-600
                       hover:bg-blue-100 hover:text-blue-800 rounded-md cursor-pointer">
                Cerrar sesión
            </button>
        </div>
         </div>

    `;

   //3. INSERTAR DATOS EN EL MENÚ
    
   document.getElementById("user-name").textContent =
   `${usuario.name}`;

document.getElementById("user-email").textContent = usuario.email;

const avatar = `${usuario.name[0]}`.toUpperCase();
document.getElementById("user-avatar").textContent = avatar;

    // Animación abrir/cerrar menú
    document.getElementById("user-menu-btn").addEventListener("click", () => {
        const drop = document.getElementById("user-dropdown");

        if (drop.classList.contains("hidden")) {
            drop.classList.remove("hidden");

            setTimeout(() => {
                drop.classList.remove("opacity-0", "scale-95");
                drop.classList.add("opacity-100", "scale-100");
            }, 20);

        } else {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");

            setTimeout(() => {
                drop.classList.add("hidden");
            }, 150);
        }
    });

    // Cerrar sesión
    document.addEventListener("click", (e) => {
        if (e.target.id === "logout-btn") {

            localStorage.clear();

            const toast = document.getElementById("logout-toast");

            toast.classList.remove("hidden");
            setTimeout(() => toast.classList.add("opacity-100"), 20);

            setTimeout(() => {
                toast.classList.remove("opacity-100");

                setTimeout(() => {
                    window.location.href = "../pages/login.html";
                }, 500);

            }, 1500);
        }
    });
// seccion de perfil: actualizar datos de perfil
    const contenedorAvatar = document.getElementById("user-perfil-avatar");
    if (contenedorAvatar) {
        // Crear el avatar con gradiente
        contenedorAvatar.innerHTML = `
        <div class="relative">
            <div class="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-3xl shadow-md">
                <span id="user-avatar-perfil"></span>
            </div>
        </div>
        `;
        
        // ✅ CORRECCIÓN: usar el ID correcto "user-avatar-perfil"
        const avatarSpan = `${usuario.name[0]}`.toUpperCase();
        document.getElementById("user-avatar-perfil").textContent = avatarSpan;
        
        // ✅ Nombre del usuario al lado del avatar
        document.getElementById("user-perfil-name").textContent = `${usuario.name}`;
        
        // ✅ Correo del usuario al lado del avatar
        document.getElementById("user-perfil-email").textContent = usuario.email;
        
        // LLENAR LOS CAMPOS DEL FORMULARIO
        document.getElementById("nombre").value = usuario.name || '';
        document.getElementById("email").value = usuario.email || '';
        document.getElementById("telefono").value = usuario.telefono || usuario.phone || '';
    }
});
//FUNCIÓN PARA EDITAR PERFIL
// ========================================
async function editarPerfil() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    // Validaciones básicas
    if (!nombre || !email) {
        alert('Por favor completa los campos obligatorios (Nombre y Email)');
        return;
    }

    // Preparar datos para enviar al servidor
    const datosActualizados = {
        email: email,
        name: nombre,
        telefono: telefono
    };

    try {
        // Enviar al servidor
        const res = await fetch("http://localhost:8081/api/perfil/actualizar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosActualizados)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Error al actualizar el perfil");
        }

        // Actualizar localStorage
        localStorage.setItem('usuario', JSON.stringify(datosActualizados));

        alert('✅ Perfil actualizado exitosamente!');
        
        // Recargar la página para mostrar los cambios
        location.reload();

    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        alert('❌ Error al actualizar el perfil: ' + error.message);
    }
}


