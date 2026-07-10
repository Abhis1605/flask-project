from functools import wraps

from flask_jwt_extended import (
    get_jwt_identity
)

from app.models.user import User
from app.utils.api_response import (
    error_response
)


def require_permission(permission: str):

    def decorator(fn):

        @wraps(fn)
        def wrapper(*args, **kwargs):

            user_id = get_jwt_identity()

            user = User.query.filter_by(
                id=user_id
            ).first()

            if not user:
                return error_response(
                    message="User not found.",
                    status_code=404
                )

            if not user.is_active:
                return error_response(
                    message="User account is disabled.",
                    status_code=403
                )

            role = user.role

            if not role:
                return error_response(
                    message="Role not found.",
                    status_code=404
                )

            if not role.is_active:
                return error_response(
                    message="Role is inactive.",
                    status_code=403
                )

            has_permission = getattr(
                role,
                permission,
                False
            )

            if not has_permission:
                return error_response(
                    message="Permission denied.",
                    status_code=403
                )

            return fn(*args, **kwargs)

        return wrapper

    return decorator