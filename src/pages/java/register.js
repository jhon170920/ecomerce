document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada correctamente');

    const API_URL = 'http://localhost:8081/api/user/register';

    document.getElementById('register-form').addEventListener('submit', async function(e){
        e.preventDefault();

        const btn = document.getElementById('register-button');
        const errorDiv = document.getElementById('register-error');
        const errorMsg = document.getElementById('register-error-message');
        errorDiv.classList.add('hidden');

        const datos = {
            name: document.getElementById('Nombre').value,
            email: document.getElementById('Email').value.trim(),
            tel: document.getElementById('Telefono-num').value.trim(),
            pass: document.getElementById('password').value,            
            //passwordConfirm: document.getElementById('password-confirm').value,
        };

        if (!datos.name || !datos.email || !datos.tel || !datos.pass /*|| !datos.passwordConfirm*/) {
            errorMsg.textContent = 'Por favor, complete los datos.';
            errorDiv.classList.remove('hidden');
            return;
        }
        /*
        if (datos.password !== datos.passwordConfirm){
            errorMsg.textContent = 'Las contraseñas no coinciden.';
            errorDiv.classList.remove('hidden');
            return;
        }
        */
        btn.disabled = true;
        btn.textContent = 'Creando cuenta...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok){
                errorDiv.className = 'bg-green-100 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent = 'Usuario creado exitosamente. Redirigiendo al login...';
                errorDiv.classList.remove('hidden');

                setTimeout(()=> window.location.href = 'login.html', 3000);
            } else {
                errorMsg.textContent = resultado.message || 'Error al crear el usuario';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = 'Crear Cuenta';
            }

        } catch (error) {
            console.error('Error al conectar con el servidor', error);
            errorMsg.textContent = 'Error de conexión con el servidor';
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.innerHTML = 'Crear Cuenta';
        }
    });
});
