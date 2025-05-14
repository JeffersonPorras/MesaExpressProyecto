from flask import Blueprint, jsonify, request
import mysql.connector
from config import DB_CONFIG

# Crear Blueprint para productos
productosStart = Blueprint('productos', __name__)

# Función para conectar con MySQL
def conectar_a_mysql():
    try:
        conexion = mysql.connector.connect(**DB_CONFIG)
        if conexion.is_connected():
            return conexion
    except mysql.connector.Error as e:
        return None


# Ruta para obtener todos los productos
@productosStart.route('/productos', methods=['GET'])
def obtener_productos():
    conexion = conectar_a_mysql()
    if conexion:
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM productos")
        productos = cursor.fetchall()
        productos_list = []
        for producto in productos:
            # Asegúrate de que el campo 'Foto' está siendo recuperado correctamente
            productos_list.append({
                "id": producto[0],
                "nombre": producto[1],
                "descripcion": producto[2],
                "precio": producto[3],
                "categoria": producto[4],
                "foto":producto[5], # Revisa que este campo se recupere correctamente
            })
            print("Producto Foto:", producto[5])

        conexion.close()
        return jsonify(productos_list)
    else:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

# Ruta para agregar un producto
@productosStart.route('/productos', methods=['POST'])
def agregar_producto():
    data = request.get_json()
    nombre = data['nombre']
    precio = data['precio']
    descripcion = data['descripcion']
    foto = data['foto']

    conexion = conectar_a_mysql()
    if conexion:
        cursor = conexion.cursor()
        cursor.execute("""
    INSERT INTO productos (nombre, precio, descripcion, foto)
    VALUES (%s, %s, %s, %s)
""", (nombre, precio, descripcion, foto))


        conexion.commit()
        conexion.close()
        return jsonify({"message": "Producto agregado exitosamente!"}), 201
    else:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500


# Ruta para eliminar un producto (ruta corregida)
@productosStart.route('/productos/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
    conexion = conectar_a_mysql()
    if conexion:
        cursor = conexion.cursor()
        cursor.execute("DELETE FROM productos WHERE producto_id = %s", (id,))
        conexion.commit()
        conexion.close()
        return jsonify({"message": "Producto eliminado exitosamente!"})
    else:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500


# Ruta para modificar o consultar un producto por ID
@productosStart.route('/productos/<int:id>', methods=['GET', 'PUT'])
def modificar_producto(id):
    conexion = conectar_a_mysql()
    if not conexion:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cursor = conexion.cursor(dictionary=True)

    if request.method == 'GET':
        cursor.execute("SELECT * FROM productos WHERE producto_id = %s", (id,))
        producto = cursor.fetchone()
        if producto:
            return jsonify(producto)
        else:
            return jsonify({"error": "Producto no encontrado"}), 404

    elif request.method == 'PUT':
        # Ahora también estamos recibiendo el campo 'foto' en los datos del producto
        data = request.get_json()

        # Verifica si la URL de la foto está incluida en la solicitud
        foto = data.get('Foto', None)  # Si no se pasa, será 'None'

        # Si se proporciona, actualizamos el campo Foto, si no, lo dejamos como está.
        update_query = """
            UPDATE productos 
            SET nombre = %s, precio = %s, descripcion = %s, foto = %s
            WHERE producto_id = %s
        """

        cursor.execute(update_query, (data['nombre'], data['precio'], data['descripcion'], foto, id))
        conexion.commit()

        return jsonify({"message": "Producto modificado exitosamente!"}), 200

