import os
from datetime import timedelta

from dotenv import load_dotenv
from sqlalchemy.engine import URL

load_dotenv()


class Config:

    SECRET_KEY = os.getenv("SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = URL.create(
        drivername="mysql+pymysql",
        username=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        database=os.getenv("DB_NAME"),
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    IS_PRODUCTION = FLASK_ENV == "production"

    # --- JWT ---
    # Access tokens are short-lived and sent only via the Authorization
    # header (never persisted client-side beyond memory).
    # Refresh tokens are long-lived and delivered as an httpOnly cookie
    # scoped to the auth blueprint so JS can never read them directly.
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY") or SECRET_KEY

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        minutes=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MIN", 15))
    )
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        days=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES_DAYS", 7))
    )

    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    JWT_REFRESH_COOKIE_NAME = "refresh_token"
    JWT_REFRESH_COOKIE_PATH = "/api/v1/auth"
    JWT_COOKIE_DOMAIN = os.getenv("JWT_COOKIE_DOMAIN") or None

    # False for local development. Change to True after deploying with HTTPS.
    JWT_COOKIE_SECURE = IS_PRODUCTION
    JWT_COOKIE_SAMESITE = os.getenv("JWT_COOKIE_SAMESITE", "Lax")

    # Refresh cookie is protected against CSRF via a double-submit token
    # (readable, non-httpOnly `csrf_refresh_token` cookie) that the
    # frontend must echo back in the X-CSRF-TOKEN header.
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-TOKEN"
    JWT_REFRESH_CSRF_HEADER_NAME = "X-CSRF-TOKEN"

    JWT_ERROR_MESSAGE_KEY = "message"