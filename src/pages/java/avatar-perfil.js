document.addEventListener("DOMContentLoaded", () => {
    console.log("Perfil JS cargado");
    // Contenedor donde se insertará el avatar
    const contenedorAvatar = document.getElementById("user-perfil-avatar");
    if (contenedorAvatar){
        // Crear el avatar
        contenedorAvatar.innerHTML = `
        <div class ="relative">
            <div
                class="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-3xl shadow-md">
                <span id="user-avatar-perfil"></span>
            </div>
        </div>
        `;
        const avatarSpan = `${usuario.name[0]}`.toUpperCase();
        document.getElementById("user-avatar-perfil").textContent = avatarSpan;
        //nombre del usuario al lado del avatar
        document.getElementById("user-name-perfil").textContent = `${usuario.name}`;
        //correo del usuario al lado del avatar
        document.getElementById("user-email-perfil").textContent = usuario.email;
    }
});