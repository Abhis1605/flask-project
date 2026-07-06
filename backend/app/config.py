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

    # Prevent JavaScript from accessing the session cookie
    SESSION_COOKIE_HTTPONLY = True

    # Protect against many CSRF attacks
    SESSION_COOKIE_SAMESITE = "Lax"

    # False for local development.
    # Change to True after deploying with HTTPS.
    SESSION_COOKIE_SECURE = False

    # Expire inactive sessions after 30 minutes
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)

    # Remember Me cookie duration
    REMEMBER_COOKIE_DURATION = timedelta(days=7)

    # Additional Flask-Login settings
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_SECURE = False      # True in production
    REMEMBER_COOKIE_SAMESITE = "Lax"

    # Refresh session lifetime on each request
    SESSION_REFRESH_EACH_REQUEST = True