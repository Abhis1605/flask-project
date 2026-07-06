from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from app.utils.api_response import error_response

db = SQLAlchemy()

login_manager = LoginManager()

login_manager.login_view = "auth.login"

login_manager.login_message = "You must login to access this page."

login_manager.login_message_category = "warning"

@login_manager.unauthorized_handler
def unauthorized():
    
    return error_response(
        message='Authentication required.',
        status_code=401
    )