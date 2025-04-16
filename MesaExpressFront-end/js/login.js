document.addEventListener("DOMContentLoaded", () => {
    // Obtener el formulario cuando el DOM esté cargado
    let formulario = document.getElementById("formLogin");

    if (!formulario) {
        console.error("Error: No se encontró el formulario con id='formLogin'");
        return;
    }

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Recibiendo datos");

        let emailValue = document.getElementById("email").value;
        let passwordValue = document.getElementById("password").value; // Sin encriptar



        let credenciales = {
            "email": emailValue,
            "password": passwordValue,
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credenciales),
            });

            const data = await response.json();

            if (response.ok && data.usuario) {
                alert('Login exitoso!');
                localStorage.setItem("usuarioMesaExpress", JSON.stringify(data.usuario));

                // Redirigir según el rol del usuario
                if (data.usuario.rol === "Admin") {
                    window.location.href = "admin.html"; 
                } else {
                    window.location.href = "paginaPrincipal.html"; 
                }
            } else {
                // Mostrar error en la pantalla
                let errorMessage = document.getElementById("errorMessage");
                if (errorMessage) {
                    errorMessage.textContent = data.error || 'Error al iniciar sesión.';
                    errorMessage.style.display = 'block';
                }
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error al conectar con el servidor.");
        }
    });
});

// Función para hashear la contraseña con SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}





