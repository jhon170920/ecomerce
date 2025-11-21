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

//funcion de visibilidad de confirmar contraseña

document.getElementById("toggle-password1").addEventListener('click', function() {
    const passwordInput1 = document.getElementById("password-confirm");
    const eyeOpen1 = document.getElementById("eye-icon-open1");
    const eyeClosed1 = document.getElementById("eye-icon-closed1");
    //verificacion si la contraseña esta oculta
    const isHidden = passwordInput1.type === "password";
    //cambiar el password a texto
    passwordInput1.type = isHidden ? "text" : "password";
     //alteracion de icono segun estado
    eyeOpen1.classList.toggle("hidden", !isHidden);
    eyeClosed1.classList.toggle("hidden", isHidden);
});
