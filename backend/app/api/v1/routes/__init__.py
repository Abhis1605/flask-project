from .auth_routes import auth_bp
from .product_routes import product_bp
from .category_routes import category_bp
from .home_routes import home_bp
from .user_routes import user_bp
from .role_routes import role_bp
from .stock_transaction_route import stock_transaction_bp
from .activity_log_routes import activity_log_bp

__all__ = [
    "auth_bp",
    "product_bp",
    "category_bp",
    "home_bp",
    "user_bp",
    "role_bp",
    "stock_transaction_bp",
    "activity_log_bp"
]