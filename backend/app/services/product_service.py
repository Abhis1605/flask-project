from sqlalchemy import func

from app.extensions import db
from app.models import Product, Category


class ProductService:

    @staticmethod
    def get_categories():
        return Category.query.order_by(Category.name).all()

    @staticmethod
    def get_products(search="", category_id=""):

        query = Product.query

        if search:

            normalized_search = search.replace(" ", "").lower()

            query = query.filter(
                func.replace(
                    func.lower(Product.name),
                    " ",
                    ""
                ).like(f"%{normalized_search}%")
            )

        if category_id:
            query = query.filter(
                Product.category_id == int(category_id)
            )

        return query.order_by(Product.id.asc()).all()

    @staticmethod
    def create_product(data):

        name = data.get("name")
        price = float(data.get("price"))
        quantity = int(data.get("quantity"))
        category_id = data.get("category")

        if not all([name, price, quantity, category_id]):

            return {
                "success": False,
                "message": "All fields are required."
            }

        product = Product(
            name=name,
            price=float(price),
            quantity=int(quantity),
            total_amount= price * quantity,
            category_id=int(category_id)
        )

        db.session.add(product)
        db.session.commit()

        return {
            "success": True,
            "message": "Product added successfully."
        }
        
    @staticmethod
    def get_product(product_id):

        return Product.query.get_or_404(product_id)
    
    @staticmethod
    def update_product(product_id, data):

        product = Product.query.get_or_404(product_id)

        name = data.get("name")
        price = float(data.get("price"))
        quantity = int(data.get("quantity"))
        category_id = data.get("category")

        if not all([name, price, quantity, category_id]):

            return {
                "success": False,
                "message": "All fields are required."
            }

        product.name = name
        product.price = float(price)
        product.quantity = int(quantity)
        product.category_id = int(category_id)
        product.total_amount = (
            product.price * product.quantity
        )

        db.session.commit()

        return {
            "success": True,
            "message": "Product updated successfully."
        }
        
    @staticmethod
    def delete_product(product_id):

        product = Product.query.get_or_404(product_id)

        db.session.delete(product)

        db.session.commit()

        return {
        "success": True,
        "message": "Product deleted successfully."
        }