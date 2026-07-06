from flask import Blueprint, request
from flask_login import (
    login_user,
    current_user,
    login_required,
    logout_user
)

from app.services.auth_service import AuthService

from app.utils.api_response import (
    success_response,
    error_response
)

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/v1/auth"
)

@auth_bp.route("/register", methods=["POST"])
def register():
    
    data = request.get_json()
    
    result = AuthService.register(data)
    
    if not result["success"]:
        
        return error_response(
            message=result["message"],
            status_code=400
        )
    
    return success_response(
        message=result["message"],
        status_code=201
    )
    

@auth_bp.route("/login", methods=["POST"])
def login():
    
    data = request.get_json()
    
    result = AuthService.login(data)
    
    if not result["success"]:
        return error_response(
            message=result["message"],
            status_code=401
        )
    
    login_user(result["user"])
    
    return success_response(
        data=result["user"].to_dict(),
        message=result["message"]
    )
    
@auth_bp.route('/me', methods=["GET"])
@login_required
def me():
    
    return success_response(
        data=current_user.to_dict(),
        message="Current user fetched successfully."
    )
    
@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    
    logout_user()
    
    return success_response(
        message="Logout successful."
    )