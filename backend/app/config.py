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
    minutes=2
)

    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    JWT_COOKIE_DOMAIN = os.getenv("JWT_COOKIE_DOMAIN") or None

    # False for local development. Change to True after deploying with HTTPS.
    JWT_COOKIE_SECURE = IS_PRODUCTION
    JWT_COOKIE_SAMESITE = os.getenv("JWT_COOKIE_SAMESITE", "Lax")

    JWT_ERROR_MESSAGE_KEY = "message"
    
    
    REFRESH_COOKIE_NAME = 'refresh_token'
    REFRESH_COOKIE_PATH = "/api/v1/auth"
    REFRESH_COOKIE_SECURE= IS_PRODUCTION
    REFRESH_COOKIE_SAMESITE = 'Lax'