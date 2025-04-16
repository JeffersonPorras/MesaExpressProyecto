document.getElementById("registroForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const emailValue = document.getElementById("email").value;
    
    // Expresión regular para validar el correo en JavaScript
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(emailValue)) {
        alert("❌ El correo electrónico no es válido.");
        return;
    }

    const datosUsuario = {
        nombres: document.getElementById("nombres").value,
        apellidos: document.getElementById("apellidos").value,
        email: emailValue,
        password: document.getElementById("password").value,
        celular: document.getElementById("celular").value,
        direccion: document.getElementById("direccion").value
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/usuarios/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosUsuario)
        });

        const data = await response.json();
        document.getElementById("mensaje").innerText = data.mensaje || data.error;

        if (response.ok) {
            alert("✅ Registro exitoso, ahora puedes iniciar sesión.");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error);
    }
});

