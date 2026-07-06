from app.extensions import db
from app.models import User

from app.utils import hash_password, validate_password, validate_name, ValidationError, validate_email, verify_password

class AuthService:
    
    @staticmethod
    def register(data):
        try:
            full_name = validate_name(
                data.get('full_name', "")
            )
            
            email = validate_email(
                data.get('email', "")
            )
            
            password = validate_password(
                data.get("password", "")
            )
            
        except ValidationError as e:

            return False, str(e)
        
        existing_user = User.query.filter_by(
            email = email
        ).first()
        
        if existing_user:
            
            return {
                "success": False,
                "message": "Email already exists."
            }
        
        user = User(
            full_name= full_name,
            email= email,
            password_hash= hash_password(password)
        )
        
        db.session.add(user)
        
        db.session.commit()
        
        return {
            "success": True,
            "message": "Registration successful"
        }
        
    @staticmethod
    def login(data):
        
        email = data.get('email', "").strip().lower()
        password = data.get('password', "")
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            
            return {
                "success": False,
                "message": "Invalid email or password."
            }
        
        if not verify_password(password, user.password_hash):
            
            return {
                "success": False,
                "message": 'Your account has been disabled.'
            }
        
        return {
            "success": True,
            "message": "Login successful.",
            "user": user
        }   