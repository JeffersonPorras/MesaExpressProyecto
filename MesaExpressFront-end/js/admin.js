const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioMesaExpress")) || {};
document.getElementById("adminInfo").innerText = `Usuario: ${usuarioLogeado.nombres || "N/A"} ${usuarioLogeado.apellidos || ""} | Rol: ${usuarioLogeado.rol || "N/A"}`;

const userTableBody = document.getElementById("userTableBody");

// Función para obtener los usuarios desde la base de datos
async function fetchUsers() {
    try {
        const response = await fetch("http://127.0.0.1:5000/admin/usuarios"); 
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const usuarios = await response.json();
        renderUsers(usuarios);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
    }
}


async function fetchRoles() {
    try {
        const response = await fetch("http://127.0.0.1:5000/admin/roles"); // Guardar la respuesta
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return await response.json();  // Convertirla a JSON
    } catch (error) {
        console.error("Error al obtener los roles:", error);
        return [];
    }
}


// Función para renderizar los usuarios en la tabla
async function renderUsers(usuarios) {
    const roles = await fetchRoles(); // Obtener roles dinámicamente

    userTableBody.innerHTML = "";
    usuarios.forEach(user => {
        const row = document.createElement("tr");

        // Construir opciones del select con los roles obtenidos
        let roleOptions = roles.map(role => 
            `<option value="${role.id}" ${user.rol_id === role.id ? "selected" : ""}>${role.nombre}</option>`    
        ).join("");

        row.innerHTML = `
            <td>${user.nombres}</td>
            <td>${user.apellidos}</td>
            <td>${user.email}</td> 
            <td>
                <select onchange="updateUser(${user.id}, this.value)">
                    ${roleOptions}
                </select>
            </td>
        
            <td>
                <button class="btn-delete" onclick="deleteUser(${user.id})">Eliminar</button>
            </td>
        `;
        userTableBody.appendChild(row);
    
    });
}

// Función para actualizar el rol del usuario
async function updateUser(userId, newRoleId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/admin/usuarios/${userId}/rol`, {  // 🔹 Asegurar que apunta a '/admin/'
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ rol_id: newRoleId })  // Enviar rol_id en JSON
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.mensaje);  // Mensaje de éxito
            fetchUsers();  // Recargar la tabla con los nuevos datos
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error al actualizar el rol:", error);
    }
}



async function deleteUser(userId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:5000/admin/usuarios/${userId}`, {
            method: "DELETE"
        });

        const result = await response.json();
        
        if (response.ok) {
            alert(result.mensaje);  // Muestra mensaje de éxito
            fetchUsers();  // Recarga la lista de usuarios
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
    }
}





async function logout() {
    await fetch("http://127.0.0.1:5000/login");
    localStorage.removeItem("usuario"); // Eliminar usuario de localStorage
    window.location.href = "login.html";
}



// Cargar usuarios al iniciar
fetchUsers();
