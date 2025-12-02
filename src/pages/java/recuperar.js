// ============================================
// SOLICITAR CÓDIGO DE RECUPERACIÓN
// ============================================

document.getElementById('btn-enviar')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const btnEnviar = document.getElementById("btn-enviar");

    // Validaciones
    if (!email) {
        alert("⚠️ Por favor ingresa tu correo electrónico");
        return;
    }

    // Validar formato de email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Por favor ingresa un email válido');
        return;
    }

    // Deshabilitar el botón y mostrar loading
    btnEnviar.textContent = "Enviando...";
    btnEnviar.disabled = true;

    try {
        const res = await fetch('http://localhost:8081/api/Recuperar/solicitar-codigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (res.ok) {
            // Ocultar formulario y mostrar mensaje de éxito
            document.getElementById('form-container').classList.add('hidden');
            document.getElementById('mensaje-exito').classList.remove('hidden');
            
            // Guardar email en sessionStorage para usarlo después
            sessionStorage.setItem('emailRecuperacion', email);
            
            // Redirigir a la página para ingresar código después de 3 segundos
            setTimeout(() => {
                window.location.href = './nueva-contrasena.html';
            }, 3000);
        } else {
            alert('❌ ' + data.message);
            btnEnviar.textContent = 'Recuperar contraseña';
            btnEnviar.disabled = false;
        }

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al procesar la solicitud. Inténtalo de nuevo.');
        btnEnviar.textContent = 'Recuperar contraseña';
        btnEnviar.disabled = false;
    }
});

// Permitir enviar con Enter
document.getElementById('email')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-enviar').click();
    }
});