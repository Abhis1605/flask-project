from app.models.user import User
from app.models.roles import Role
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
            
        user.role_id = role.id
        
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
    
    