from flask import Blueprint

from flask_jwt_extended import (
    jwt_required,
    current_user
)

from app.services.home_service import HomeService

from app.utils.api_response import success_response

home_bp = Blueprint(
    "home",
    __name__,
    url_prefix="/api/v1/home"
)

@home_bp.route("", methods=["GET"])
@jwt_required(locations=["headers"])
def dashboard():
    
    dashboard = HomeService.get_dashboard(
        current_user
    )
    
    return success_response(
        
        data=dashboard,
        message='Dashboard loaded successfully.'
    )