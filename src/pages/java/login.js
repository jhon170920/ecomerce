//verificar que toda la pagina este cargada
document.addEventListener('DOMContentLoaded', function() {
    console.log('pagina cargada correctamente');
    //creamos la constante de la api
    const API_URL = 'http://localhost:8081/api/login';

    //Envair los datos del formulario
    document.getElementById('login-form').addEventListener('submit', async function(e){
        e.preventDefault();
        //preparamos los elementos de la pagina 
        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-message');
        errorDiv.classList.add('hidden');
        //recoger los cambios del formulario
        const datos = {
            email: document.getElementById('email').value.trim(),
            pass: document.getElementById('password').value
        };
       
        //validamos que los campos no esten vacios
        if (!datos.email || !datos.pass) {
            errorMsg.textContent = 'Por favor, complete los datos.';
            errorDiv.classList.remove('hidden');
            return;
        }
        //cambia el boton mientras se procesa
        btn.disabled=true;
        btn.textContent='Iniciando Sesion...';

        //envaindo los datos

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(datos)
            });
            //Respuesta del servidor
            const resultado = await response.json();
            if (response.ok){
                console.log('201 incio de sesion exitoso');
                //guardar informacion
                localStorage.setItem("sessionActiva", "true")
                localStorage.setItem("usuario", JSON.stringify({
                    id: resultado.usuario._id,
                    name:resultado.usuario.name,
                    email:resultado.usuario.email,
                    telefono:resultado.usuario.telefono

                }));
                //mensaje de exito
                errorDiv.className='bg-green-100 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent='Inicio de sesion exitoso. Redirigiendo...';
                errorDiv.classList.remove('hidden');
                //redirigir a productos
                setTimeout(()=> window.location.href = 'productos.html', 3000);
            
            }else{
                //credenciales incorrectas
                errorMsg.textContent=resultado.message ||'credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.disabled=false;
                btn.innerHTML='Iniciar Sesion';
            }
        } catch (error) {
            console.error('Error 404- Error de conexion con el servidor', error); // Agregar detalles del error para depuración
            errorMsg.textContent='Error de conexion con el servidor';
            errorDiv.classList.remove('hidden');
            btn.disabled=false;
            btn.innerHTML='Iniciar Sesion';
        }
    })
});

