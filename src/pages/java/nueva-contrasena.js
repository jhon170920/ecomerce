
// Ocultar loader y mostrar formulario al cargar
window.addEventListener('DOMContentLoaded', () => {
    // Verificar que venga desde la página de recuperación
    const emailRecuperacion = sessionStorage.getItem('emailRecuperacion');
    
    if (!emailRecuperacion) {
        // Si no hay email guardado, redirigir a recuperar
        window.location.href = './recuperar.html';
        return;
    }
    
    // Mostrar formulario
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('form-container').classList.remove('hidden');
});

// FUNCIÓN PARA RESTABLECER CONTRASEÑA

async function restablecerPassword() {
    const emailRecuperacion = sessionStorage.getItem('emailRecuperacion');
    const codigo = document.getElementById('codigo').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const btnRestablecer = document.getElementById('btn-restablecer');

    // Validaciones
    if (!codigo) {
        alert('⚠️ Por favor ingresa el código de 5 dígitos');
        return;
    }

    if (codigo.length !== 5) {
        alert('⚠️ El código debe tener exactamente 5 dígitos');
        return;
    }

    if (!password || !passwordConfirm) {
        alert('⚠️ Por favor completa ambos campos de contraseña');
        return;
    }

    if (password.length < 6) {
        alert('⚠️ La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (password !== passwordConfirm) {
        alert('⚠️ Las contraseñas no coinciden');
        return;
    }

    // Deshabilitar botón
    btnRestablecer.textContent = 'Restableciendo...';
    btnRestablecer.disabled = true;

    try {
        const res = await fetch('https://ecomerce-c5tt.onrender.com/api/Recuperar/cambiar-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailRecuperacion,
                codigo: codigo,
                nuevaPassword: password
            })
        });

        const data = await res.json();

        if (res.ok) {
            // Limpiar sessionStorage
            sessionStorage.removeItem('emailRecuperacion');
            
            // Mostrar mensaje de éxito
            document.getElementById('form-container').classList.add('hidden');
            document.getElementById('mensaje-exito').classList.remove('hidden');
            
            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                window.location.href = './login.html';
            }, 3000);
        } else {
            alert('❌ ' + data.message);
            btnRestablecer.textContent = 'Restablecer contraseña';
            btnRestablecer.disabled = false;
        }

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al restablecer contraseña. Inténtalo de nuevo.');
        btnRestablecer.textContent = 'Restablecer contraseña';
        btnRestablecer.disabled = false;
    }
}
// Hacer la función global para que funcione con onclick
window.restablecerPassword = restablecerPassword;