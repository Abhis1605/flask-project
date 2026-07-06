from flask import Flask
from flask_migrate import Migrate

from app.config import Config
from app.extensions import db, login_manager


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    login_manager.init_app(app)

    # Import Models
    from app.models import User, Product, Category

    # Flask-Login User Loader
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Initialize Migrations
    Migrate(app, db)

    # Register Blueprints
    from app.routes import (
        auth_bp,
        product_bp,
        home_bp,
        category_bp
    )

    app.register_blueprint(home_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(category_bp)

    return app