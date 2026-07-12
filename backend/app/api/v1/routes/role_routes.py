from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.models.roles import Role

from app.decorators.permission_required import require_permission

from app.utils.api_response import success_response

role_bp = Blueprint(
    "roles",
    __name__,
    url_prefix="/api/v1/roles"
)

# GET - get all active roles
# GET /api/v1/roles

@role_bp.route("", methods=["GET"])
@jwt_required(locations=["headers"])
@require_permission("can_manage_users")
def get_roles():

    roles = Role.query.filter_by(
        is_active=True
    ).order_by(Role.id.asc()).all()

    return success_response(
        data=[role.to_dict() for role in roles],
        message="Roles fetched successfully."
    )
