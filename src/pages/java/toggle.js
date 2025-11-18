//funcion de visibilidad de contraseña

document.getElementById("toggle-password").addEventListener('click', function() {
    const passwordInput = document.getElementById("password");
    const eyeOpen = document.getElementById("eye-icon-open");
    const eyeClosed = document.getElementById("eye-icon-closed");
    //verificacion si la contraseña esta oculta
    const isHidden = passwordInput.type === "password";
    //cambiar el password a texto
    passwordInput.type = isHidden ? "text" : "password";
    //alteracion de icono segun estado
    eyeOpen.classList.toggle("hidden", !isHidden);
    eyeClosed.classList.toggle("hidden", isHidden);
}
);