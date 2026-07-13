from flask_jwt_extended import current_user

from app.extensions import db
from app.models import Category
from app.services.activity_log_service import ActivityLogService


class CategoryService:

    @staticmethod
    def get_categories():

        return Category.query.order_by(
            Category.name.asc()
        ).all()

    @staticmethod
    def get_category(category_id):

        return Category.query.get(category_id)

    @staticmethod
    def create_category(data):

        name = data.get("name", "").strip()

        if not name:
            raise ValueError(
                "Category name is required."
            )

        exists = Category.query.filter_by(
            name=name
        ).first()

        if exists:
            raise ValueError(
                "Category already exists."
            )

        try:

            category = Category(
                name=name
            )

            db.session.add(category)
            
            db.session.flush()
            
            ActivityLogService.log(
            user_id=current_user.id,
            action="CREATE",
            entity_type="CATEGORY",
            entity_id=category.id,
            description=
                f"Created category '{category.name}'"
        )

            db.session.commit()

            return category

        except Exception:

            db.session.rollback()

            raise

    @staticmethod
    def update_category(category_id, data):

        category = Category.query.get(category_id)

        if not category:
            return None

        name = data.get("name", "").strip()

        if not name:
            raise ValueError(
                "Category name is required."
            )

        duplicate = Category.query.filter(
            Category.name == name,
            Category.id != category.id
        ).first()

        if duplicate:
            raise ValueError(
                "Category already exists."
            )

        try:

            category.name = name
            
            ActivityLogService.log(
            user_id=current_user.id,
            action="UPDATE",
            entity_type="CATEGORY",
            entity_id=category.id,
            description=
                f"Updated category '{category.name}'"
        )

            db.session.commit()

            return category

        except Exception:

            db.session.rollback()

            raise

    @staticmethod
    def delete_category(category_id):

        category = Category.query.get(category_id)

        if not category:
            return None

        try:
            
            ActivityLogService.log(
            user_id=current_user.id,
            action="DELETE",
            entity_type="CATEGORY",
            entity_id=category.id,
            description=
                f"Deleted category '{category.name}'"
        )

            db.session.delete(category)

            db.session.commit()

            return True

        except Exception:

            db.session.rollback()

            raise