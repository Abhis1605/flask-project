from flask_jwt_extended import current_user

from app.models.user import User
from app.models.roles import Role
from app.services.activity_log_service import ActivityLogService
from app.extensions import db

class UserService:
    
    @staticmethod
    def get_users():
        
        return (
            User.query.order_by(User.created_at.desc()).all()
        )
        
    @staticmethod
    def get_user(user_id):
        
        return User.query.get(user_id)
    
    @staticmethod
    def update_role(user_id, role_id):
        
        user = User.query.get(user_id)
        
        if not user:
            raise ValueError(
                "User not found."
            )
        
        role = Role.query.get(role_id)
        
        if not role:
            raise ValueError(
                "Role not found."
            )
            
        old_role = user.role.display_name
            
        user.role_id = role.id
        
        ActivityLogService.log(
            user_id=current_user.id,
            action="CHANGE_ROLE",
            entity_type="USER",
            entity_id=user.id,
            description=(
                f"Changed role of '{user.full_name}'"
                f"from '{old_role}'"
                f"to '{role.display_name}'"
            )
        )
        
        db.session.commit()
        
        return user
    
    @staticmethod
    def toggle_status(user_id):

        user = User.query.get(user_id)

        if not user:
            raise ValueError(
                "User not found."
            )

        user.is_active = (
            not user.is_active
        )

        db.session.commit()

        return user
    
    @staticmethod
    def delete_user(user_id):

        user = User.query.get(user_id)

        if not user:
            return False

        user.is_active = False

        db.session.commit()

        return True
    
    