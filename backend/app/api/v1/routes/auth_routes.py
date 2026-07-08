from user_agents import parse

from flask import Blueprint, request

from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    current_user,
)

from app.models import User

from app.services.auth_service import (
    AuthService,
)

from app.services.session_service import (
    SessionService,
)

from app.utils.cookies import (
    set_refresh_cookie,
    clear_refresh_cookie,
)

from app.utils.api_response import (
    success_response,

    error_response,
)

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/v1/auth",
)

def _issue_access_token(user):
    return create_access_token(
        identity=str(user.id),
        additional_claims={
            "email": user.email,
            "role": user.role,
        },
    )


def _validate_csrf():
    csrf_cookie = request.cookies.get(
        "csrf_refresh_token"
    )

    csrf_header = request.headers.get(
        "X-CSRF-TOKEN"
    )

    if (
        not csrf_cookie
        or not csrf_header
        or csrf_cookie != csrf_header
    ):
        return False

    return True


@auth_bp.route(
    "/register",
    methods=["POST"]
)
def register():

    data = request.get_json(
        silent=True
    ) or {}

    result = AuthService.register(data)

    if not result["success"]:
        return error_response(
            message=result["message"],
            status_code=400,
        )

    return success_response(
        message=result["message"],
        status_code=201,
    )


@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.get_json(
        silent=True
    ) or {}

    result = AuthService.login(data)

    if not result["success"]:
        return error_response(
            message=result["message"],
            status_code=401,
        )

    user = result["user"]

    access_token = (
        _issue_access_token(user)
    )
    
    ua = parse(
        request.headers.get(
            "User-Agent",
            ""
        )
    )
    
    device_name = (
        f"{ua.browser.family} "
        f"on "
        f"{ua.os.family}"
    )

    (
        refresh_token,
        csrf_token,
        _,
    ) = SessionService.create_session(
        user=user,
        ip_address=request.remote_addr,
        user_agent=request.headers.get(
            "User-Agent"
        ),
        device_name=device_name
    )

    response, status_code = (
        success_response(
            data={
                "user": user.to_dict(),
                "access_token": access_token,
            },
            message=result["message"],
        )
    )

    set_refresh_cookie(
        response,
        refresh_token,
        csrf_token,
    )

    return response, status_code


@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    print("Refresh endpoint hit")

    if not _validate_csrf():
        print("CSRF FAILED")
        return error_response(
            message="CSRF validation failed.",
            status_code=401,
        )

    refresh_token = request.cookies.get(
        "refresh_token"
    )

    print("REFRESH TOKEN:", refresh_token)

    if not refresh_token:
        print("NO REFRESH TOKEN")
        return error_response(
            message="Refresh token not found.",
            status_code=401,
        )

    print("BEFORE FIND SESSION")

    session = SessionService.find_session(
        refresh_token
    )

    print("SESSION FOUND:", session)

    if not SessionService.is_session_valid(
        session
    ):
        print("SESSION INVALID")
        return error_response(
            message="Invalid refresh token.",
            status_code=401,
        )

@auth_bp.route(
    "/me",
    methods=["GET"]
)
@jwt_required()
def me():
    return success_response(
        data=current_user.to_dict(),
        message=(
            "Current user fetched "
            "successfully."
        ),
    )


@auth_bp.route(
    "/logout",
    methods=["POST"]
)
def logout():

    if not _validate_csrf():
        return error_response(
            message="CSRF validation failed.",
            status_code=401,
        )

    refresh_token = request.cookies.get(
        "refresh_token"
    )

    response, status_code = (
        success_response(
            message="Logout successful."
        )
    )

    clear_refresh_cookie(
        response
    )

    if refresh_token:
        SessionService.revoke_session(
            refresh_token
        )

    return response, status_code


@auth_bp.route(
    "/logout-all",
    methods=["POST"]
)
def logout_all():

    if not _validate_csrf():
        return error_response(
            message="CSRF validation failed.",
            status_code=401,
        )

    refresh_token = request.cookies.get(
        "refresh_token"
    )

    if not refresh_token:
        return error_response(
            message="Refresh token not found.",
            status_code=401,
        )

    session = (
        SessionService.find_session(
            refresh_token
        )
    )

    if not SessionService.is_session_valid(
        session
    ):
        return error_response(
            message="Invalid refresh token.",
            status_code=401,
        )

    SessionService.revoke_all_sessions(
        session.user_id
    )

    response, status_code = (
        success_response(
            message=(
                "Logged out from all "
                "devices successfully."
            )
        )
    )

    clear_refresh_cookie(
        response
    )

    return response, status_code