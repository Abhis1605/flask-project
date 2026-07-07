from flask import Blueprint, request

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    set_refresh_cookies,
    unset_jwt_cookies,
    jwt_required,
    current_user,
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


def _issue_access_token(user):
    """Builds a short-lived access token carrying identity claims."""

    return create_access_token(
        identity=str(user.id),
        additional_claims={
            "email": user.email,
            "role": user.role,
        },
    )


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json(silent=True) or {}

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

    data = request.get_json(silent=True) or {}

    result = AuthService.login(data)

    if not result["success"]:
        return error_response(
            message=result["message"],
            status_code=401
        )

    user = result["user"]

    access_token = _issue_access_token(user)

    refresh_token = create_refresh_token(
        identity=str(user.id),
        additional_claims={
            "email": user.email,
            "role": user.role,
        },
    )

    response, status_code = success_response(
        data={
            "user": user.to_dict(),
            "access_token": access_token,
        },
        message=result["message"],
    )

    # Refresh token never touches JS - httpOnly cookie, scoped to /auth only.
    set_refresh_cookies(response, refresh_token)

    return response, status_code


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True, locations=["cookies"])
def refresh():

    if current_user is None:
        return error_response(
            message="This account no longer exists or has been disabled.",
            status_code=401
        )

    access_token = _issue_access_token(current_user)

    return success_response(
        data={"access_token": access_token},
        message="Token refreshed successfully.",
    )


@auth_bp.route("/me", methods=["GET"])
@jwt_required(locations=["headers"])
def me():

    return success_response(
        data=current_user.to_dict(),
        message="Current user fetched successfully."
    )


@auth_bp.route("/logout", methods=["POST"])
def logout():

    response, status_code = success_response(
        message="Logout successful."
    )

    # Idempotent: always clear the refresh cookie, regardless of whether
    # the caller's access token is still valid.
    unset_jwt_cookies(response)

    return response, status_code
