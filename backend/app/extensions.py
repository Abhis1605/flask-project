from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

from app.utils.api_response import error_response

db = SQLAlchemy()
jwt = JWTManager()


@jwt.unauthorized_loader
def missing_token_callback(_reason):
    return error_response(
        message="Authentication required.",
        status_code=401
    )


@jwt.invalid_token_loader
def invalid_token_callback(_reason):
    return error_response(
        message="Invalid authentication token.",
        status_code=401
    )


@jwt.expired_token_loader
def expired_token_callback(
    _jwt_header,
    jwt_data
):
    token_type = jwt_data.get(
        "type",
        "token"
    )

    return error_response(
        message=f"Your {token_type} token has expired.",
        status_code=401
    )


@jwt.needs_fresh_token_loader
def needs_fresh_token_callback(
    _jwt_header,
    _jwt_data
):
    return error_response(
        message="A fresh login is required for this action.",
        status_code=401
    )


@jwt.user_lookup_loader
def user_lookup_callback(
    _jwt_header,
    jwt_data
):
    from app.models import User

    user_id = jwt_data.get("sub")

    if user_id is None:
        return None

    return User.query.get(int(user_id))


@jwt.user_lookup_error_loader
def user_lookup_error_callback(
    _jwt_header,
    _jwt_data
):
    return error_response(
        message=(
            "This account no longer exists "
            "or has been disabled."
        ),
        status_code=401
    )