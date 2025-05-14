const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioMesaExpress")) || {};
document.getElementById("adminInfo").innerText = `Usuario: ${usuarioLogeado.nombres || "N/A"} ${usuarioLogeado.apellidos || ""} | Rol: ${usuarioLogeado.rol || "N/A"}`;

const userTableBody = document.getElementById("userTableBody");
const productosTableBody = document.getElementById("productosTableBody");
const botonAgregarProducto = document.getElementById("btnAgregarProducto");

// ==== USUARIOS ====

async function fetchUsers() {
    try {
        const response = await fetch("http://127.0.0.1:5000/admin/usuarios");
        if (!response.ok) throw new Error("Error al obtener usuarios");
        const usuarios = await response.json();
        renderUsers(usuarios);
    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}

async function fetchRoles() {
    try {
        const response = await fetch("http://127.0.0.1:5000/admin/roles");
        if (!response.ok) throw new Error("Error al obtener roles");
        return await response.json();
    } catch (error) {
        console.error("Error al obtener los roles:", error);
        return [];
    }
}

async function renderUsers(usuarios) {
    const roles = await fetchRoles();
    userTableBody.innerHTML = "";
    usuarios.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.nombres}</td>
            <td>${user.apellidos}</td>
            <td>${user.email}</td>
            <td>
               <select>
    ${roles.map(rol => `
        <option value="${rol.id}" ${rol.nombre === user.rol ? "selected" : ""}>
            ${rol.nombre}
        </option>
    `).join('')}
</select>

            </td>
            <td><button onclick="eliminarUsuario(${user.id})">Eliminar</button></td>
        `;

        userTableBody.appendChild(row);
    });
}

async function eliminarUsuario(id) {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:5000/admin/usuarios/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("No se pudo eliminar el usuario");

        alert("Usuario eliminado correctamente");
        fetchUsers();  // Recarga la tabla de usuarios
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("Error al eliminar el usuario.");
    }
}

// ==== PRODUCTOS ====

async function fetchProductos() {
    try {
        const response = await fetch("http://127.0.0.1:5000/productos/productos");

        if (!response.ok) throw new Error("Error al obtener productos");
        const productos = await response.json();

        console.log("Productos recibidos:", productos);  // Verifica la respuesta

        renderizarProductos(productos);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}


function renderizarProductos(productos) {
    console.log("Productos recibidos:", productos);  // Depuración
    productosTableBody.innerHTML = "";
    productos.forEach(producto => {
        const row = document.createElement("tr");
        // Celda de la imagen
        const celdaImagen = document.createElement("td");
        const imagen = document.createElement("img");

        console.log("Asignando foto de producto:", producto.foto);
        if (producto.foto && producto.foto.trim() !== "") {
            imagen.src = producto.foto;  // Asignar la URL correcta
        } else {
            imagen.src = "/path/to/placeholder.png";  // Si no tiene URL, usa la imagen predeterminada
        }


        imagen.alt = producto.nombre || "Imagen del producto";
        imagen.width = 60;
        imagen.height = 60;
        celdaImagen.appendChild(imagen);

        // Celda del nombre
        const celdaNombre = document.createElement("td");
        celdaNombre.innerText = producto.nombre || "Nombre no disponible";

        // Celda del precio
        const celdaPrecio = document.createElement("td");
        const precioNumerico = parseFloat(producto.precio);
        celdaPrecio.innerText = isNaN(precioNumerico) ? "N/A" : `$${precioNumerico.toFixed(2)}`;

        // Celda de acciones
        const celdaAcciones = document.createElement("td");
        celdaAcciones.innerHTML = `<button onclick="eliminarProducto(${producto.id})">Eliminar</button>
         <button onclick="mostrarFormularioEdicion(${producto.id})">Modificar</button>
`;

        // Agregar celdas a la fila
        row.appendChild(celdaImagen);
        row.appendChild(celdaNombre);
        row.appendChild(celdaPrecio);
        row.appendChild(celdaAcciones);

        productosTableBody.appendChild(row);
    });
}

botonAgregarProducto.addEventListener("click", async () => {
    const nombre = prompt("Ingrese el nombre del producto:");
    const precio = prompt("Ingrese el precio del producto:");
    const descripcion = prompt("Ingrese una descripción del producto:");
    const foto = prompt("Ingrese la Url:");

    if (!nombre || !precio) {
        alert("Debe ingresar al menos nombre y precio.");
        return;
    }

    const nuevoProducto = {
        nombre,
        precio: parseFloat(precio),
        descripcion,
        foto
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/productos/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoProducto)
        });

        if (!response.ok) throw new Error("No se pudo agregar el producto");

        alert("Producto agregado correctamente");
        fetchProductos();
    } catch (error) {
        console.error("Error al agregar producto:", error);
        alert("Hubo un error al agregar el producto.");
    }
});

// Función para mostrar el formulario de edición
function mostrarFormularioEdicion(id) {
    // Verifica la URL antes de hacer la petición
    console.log(`http://127.0.0.1:5000/productos/productos/${id}`);
    console.log("URL a la que se hace el PUT:", `http://127.0.0.1:5000/productos/productos/${id}`);


    // Obtener el producto a editar
    fetch(`http://127.0.0.1:5000/productos/productos/${id}`)
        .then(response => response.json())
        .then(producto => {
            const nombre = prompt("Modificar nombre:", producto.nombre);
            const precio = prompt("Modificar precio:", producto.precio);
            const descripcion = prompt("Modificar descripción:", producto.descripcion);

            // Confirmar que el usuario ha proporcionado los datos
            if (!nombre || !precio) {
                alert("Debe ingresar al menos nombre y precio.");
                return;
            }

            const productoModificado = {
                nombre,
                precio: parseFloat(precio),
                descripcion
            };

            // Enviar los datos al backend para actualizar
            fetch(`http://127.0.0.1:5000/productos/productos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productoModificado)
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error al modificar el producto");
                    alert("Producto modificado correctamente");
                    fetchProductos();  // Recarga la lista de productos
                })
                .catch(error => {
                    console.error("Error al modificar producto:", error);
                    alert("Hubo un error al modificar el producto.");
                });
        })
        .catch(error => {
            console.error("Error al obtener el producto:", error);
            alert("No se pudo obtener el producto para editar.");
        });
}


async function eliminarProducto(id) {
    console.log("URL a la que se hace el DELETE:", `http://127.0.0.1:5000/productos/productos/${id}`);
    console.log(`http://127.0.0.1:5000/productos/productos/${id}`);
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:5000/productos/productos/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("No se pudo eliminar el producto");

        alert("Producto eliminado correctamente");
        fetchProductos();
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }
}

// ==== INICIALIZAR ====
fetchUsers();
fetchProductos();

