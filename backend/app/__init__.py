from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS

from app.config import Config
from app.extensions import db, jwt


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:3000"],
        allow_headers=["Content-Type", "Authorization", "X-CSRF-TOKEN"],
    )

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)

    # Import Models
    from app.models import (User, Product, Category, Role)

    # Initialize Migrations
    Migrate(app, db)

    # Register Blueprints
    # from app.routes import (
    #     auth_bp,
    #     product_bp,
    #     home_bp,
    #     category_bp
    # )
    
    from app.api.v1.routes import (
        auth_bp,
        product_bp,
        category_bp,
        home_bp,
        user_bp
    )

    app.register_blueprint(home_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(user_bp)

    return app