from flask import (Blueprint, request)
from flask_jwt_extended import get_jwt_identity

from flask_jwt_extended import jwt_required

from app.decorators.permission_required import require_permission

from app.services.user_service import UserService
from app.models.user import User

from app.utils.api_response import success_response, error_response

user_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/v1/users"
)

# GET all users
@user_bp.route("", methods=["GET"])
@jwt_required(locations=["headers"])
@require_permission('can_manage_users')
def get_users():
    
    users = UserService.get_users()
    
    return success_response(
        data=[
           user.to_dict()
           for user in users
        ],
        message="Users fetched successfully."
    )

# GET particular user
@user_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required(locations=["headers"])
@require_permission('can_manage_users')
def get_user(user_id):
    
    user = UserService.get_user(user_id)
    
    if not user:
        return error_response(
            message="User not found.",
            status_code=404
        )
        
    return success_response(
        data=user.to_dict(),
        message="User fetched successfully."
    )
    
# PATCH - Update user
@user_bp.route("/<int:user_id>/role",  methods=["PATCH"])
@jwt_required(locations=["headers"])
@require_permission("can_manage_users")
def update_role(user_id):
    
    role_id = (
        request.get_json().get('role_id')
    )
    
    if not role_id:
        return error_response(
            message="Role id required.",
            status_code=400
        )
    
    try:
        
        user = (
            UserService.update_role(
                user_id,
                role_id
            )
        )
        
        return success_response(
            data=user.to_dict(),
            message="Role updated successfully."
        )
    except ValueError as e:
        
        return error_response(
            message=str(e),
            status_code=400
        )
        
# PATCH TOGGLE STATUS - to update the status of user
@user_bp.route("/<int:user_id>/status", methods=["PATCH"])
@jwt_required(locations=["headers"])
@require_permission("can_manage_users")
def toggle_status(user_id):
    
    try:
        
        user = (
            UserService.toggle_status(
                user_id
            )
        )
        
        return success_response(
            data=user.to_dict(),
            message="User status updated."
        )
    
    except ValueError as e:
        
        return error_response(
            message=str(e),
            status_code=404
        )

# DELETE - delete particular user
@user_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required(locations=["headers"])
@require_permission("can_manage_users")
def delete_user(user_id):
    
    deleted = (
        UserService.delete_user(
            user_id
        )
    )
    
    if not deleted:
        return error_response(
            message="User not found.",
            status_code=404
        )
    
    return success_response(
        message="User deleted successfully."
    )

# GET - TO get users details
@user_bp.route("/me")
@jwt_required()
def me():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    return success_response(
        data=user.to_dict()
    )