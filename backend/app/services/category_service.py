from app.extensions import db
from app.models import Category


class CategoryService:

    @staticmethod
    def get_categories():
        return Category.query.order_by(Category.name.asc()).all()

    @staticmethod
    def get_category(category_id):
        return Category.query.get_or_404(category_id)

    @staticmethod
    def create_category(data):

        name = data.get("name", "").strip()

        if not name:
            return {
                "success": False,
                "message": "Category name is required."
            }

        exists = Category.query.filter_by(name=name).first()

        if exists:
            return {
                "success": False,
                "message": "Category already exists."
            }

        category = Category(name=name)

        db.session.add(category)
        db.session.commit()

        return {
            "success": True,
            "message": "Category created successfully."
        }

    @staticmethod
    def update_category(category_id, data):

        category = Category.query.get_or_404(category_id)

        name = data.get("name", "").strip()

        if not name:
            return {
                "success": False,
                "message": "Category name is required."
            }

        category.name = name

        db.session.commit()

        return {
            "success": True,
            "message": "Category updated successfully."
        }

    @staticmethod
    def delete_category(category_id):

        category = Category.query.get_or_404(category_id)

        db.session.delete(category)

        db.session.commit()

        return {
            "success": True,
            "message": "Category deleted successfully."
        }