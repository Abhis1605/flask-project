from app.extensions import db
from app.models import Category


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

            db.session.delete(category)

            db.session.commit()

            return True

        except Exception:

            db.session.rollback()

            raise