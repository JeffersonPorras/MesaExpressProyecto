from flask import Flask
from flask_cors import CORS
from app.routes.login import loginIniciado
from app.routes.admin import adminStart
from app.routes.registro import registroUsuarios
from app.routes.productos import productosStart

def create_app():
    app = Flask(__name__)  # 👈 Usa el static por defecto: ./static/

    CORS(app, resources={r"/*": {
        "origins": "http://127.0.0.1:5500",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Headers", "Access-Control-Allow-Origin"]
    }})

    app.register_blueprint(loginIniciado, url_prefix='/auth')
    app.register_blueprint(adminStart, url_prefix='/admin')
    app.register_blueprint(registroUsuarios, url_prefix='/usuarios')
    app.register_blueprint(productosStart, url_prefix='/productos')

    return app
