from flask import current_app


def set_refresh_cookie(
    response,
    refresh_token,
    csrf_token,
):
    max_age = int(
        current_app.config[
            "JWT_REFRESH_TOKEN_EXPIRES"
        ].total_seconds()
    )

    response.set_cookie(
        key=current_app.config[
            "REFRESH_COOKIE_NAME"
        ],
        value=refresh_token,
        max_age=max_age,
        httponly=True,
        secure=current_app.config[
            "REFRESH_COOKIE_SECURE"
        ],
        samesite=current_app.config[
            "REFRESH_COOKIE_SAMESITE"
        ],
        path=current_app.config[
            "REFRESH_COOKIE_PATH"
        ],
    )

    response.set_cookie(
        key="csrf_refresh_token",
        value=csrf_token,
        max_age=max_age,
        httponly=False,
        secure=current_app.config[
            "REFRESH_COOKIE_SECURE"
        ],
        samesite=current_app.config[
            "REFRESH_COOKIE_SAMESITE"
        ],
        path="/",
    )


def clear_refresh_cookie(response):
    response.delete_cookie(
        key=current_app.config[
            "REFRESH_COOKIE_NAME"
        ],
        path=current_app.config[
            "REFRESH_COOKIE_PATH"
        ],
        samesite=current_app.config[
            "REFRESH_COOKIE_SAMESITE"
        ],
    )

    response.delete_cookie(
        key="csrf_refresh_token",
        path="/",
        samesite=current_app.config[
            "REFRESH_COOKIE_SAMESITE"
        ],
    )