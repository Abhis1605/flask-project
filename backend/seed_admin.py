from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.roles import Role
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():

    admin_role = Role.query.filter_by(
        code="ADMIN"
    ).first()

    if not admin_role:
        print("ADMIN role does not exist. Seed roles first.")
        exit()

    admin = User.query.filter_by(
        email="admin@example.com"
    ).first()

    if not admin:
        admin = User(
            full_name="Admin",
            email="admin@example.com",
            password_hash=generate_password_hash(
                "Admin@123"
            ),
            role=admin_role
        )

        db.session.add(admin)
        db.session.commit()

        print("Admin user created.")

    else:
        print("Admin already exists.")