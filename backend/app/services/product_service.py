from sqlalchemy import func
from uuid import uuid4
from flask_jwt_extended import current_user

from app.extensions import db
from app.models import Product, Category, StockTransaction
from app.services.activity_log_service import ActivityLogService

class ProductService:

    @staticmethod
    def get_categories():
        return Category.query.order_by(Category.name.asc()).all()

    @staticmethod
    def get_products(
        search="",
        category_id=None,
        min_price=None,
        max_price=None,
        page=1,
        per_page=10,
        sort="id",
        order="desc",
    ):

        query = Product.query

        # Search
        if search:
            normalized_search = search.replace(" ", "").lower()

            query = query.filter(
                func.replace(
                    func.lower(Product.name),
                    " ",
                    ""
                ).like(f"%{normalized_search}%")
            )

        # Category Filter
        if category_id:
            query = query.filter(
                Product.category_id == int(category_id)
            )

        # Price range filter
        if min_price is not None:
            query = query.filter(Product.price >= min_price)

        if max_price is not None:
            query = query.filter(Product.price <= max_price)

        # Sorting
        sort_columns = {
            "id": Product.id,
            "name": Product.name,
            "price": Product.price,
            "quantity": Product.quantity,
            "total_amount": Product.total_amount,
        }

        sort_column = sort_columns.get(sort, Product.id)

        if order.lower() == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        return query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

    @staticmethod
    def get_product(product_id):

        return Product.query.get(product_id)

    @staticmethod
    def create_product(data):

        name = data.get("name", "").strip()

        price = float(data.get("price", 0))

        quantity = int(data.get("quantity", 0))

        category_id = int(data.get("category"))

        if not name:
            raise ValueError("Product name is required.")

        if price <= 0:
            raise ValueError("Price must be greater than 0.")

        if quantity < 0:
            raise ValueError("Quantity cannot be negative.")

        category = Category.query.get(category_id)

        if not category:
            raise ValueError("Category not found.")

        exists = Product.query.filter(
            func.lower(Product.name) == name.lower()
        ).first()

        if exists:
            raise ValueError("Product already exists.")

        try:

            product = Product(
                name=name,
                price=price,
                quantity=quantity,
                total_amount=price * quantity,
                category_id=category_id,
            )

            db.session.add(product)
            
            db.session.flush()
            
            ActivityLogService.log(
                user_id=current_user.id,
                action="CREATE",
                entity_type="PRODUCT",
                entity_id=product.id,
                description=f"Created product '{product.name}'"
            )

            db.session.commit()

            return product

        except Exception:

            db.session.rollback()

            raise

    @staticmethod
    def update_product(product_id, data):

        product = Product.query.get(product_id)

        if not product:
            return None

        name = data.get("name", "").strip()

        price = float(data.get("price", 0))

        quantity = int(data.get("quantity", 0))

        category_id = int(data.get("category"))

        if not name:
            raise ValueError("Product name is required.")

        if price <= 0:
            raise ValueError("Price must be greater than 0.")

        if quantity < 0:
            raise ValueError("Quantity cannot be negative.")

        category = Category.query.get(category_id)

        if not category:
            raise ValueError("Category not found.")

        duplicate = Product.query.filter(
            func.lower(Product.name) == name.lower(),
            Product.id != product.id
        ).first()

        if duplicate:
            raise ValueError("Product already exists.")

        try:

            product.name = name
            product.price = price
            product.quantity = quantity
            product.category_id = category_id
            product.total_amount = price * quantity
            
            ActivityLogService.log(
                user_id=current_user.id,
                action="UPDATE",
                entity_type="PRODUCT",
                entity_id=product.id,
                description=f"Updated product '{product.name}'"
            )

            db.session.commit()

            return product

        except Exception:

            db.session.rollback()

            raise

    @staticmethod
    def delete_product(product_id):

        product = Product.query.get(product_id)

        if not product:
            return None

        try:

            ActivityLogService.log(
                user_id=current_user.id,
                action="DELETE",
                entity_type="PRODUCT",
                entity_id=product.id,
                description=f"Deleted product '{product.name}'"
            )
            
            db.session.delete(product)

            db.session.commit()

            return True

        except Exception:

            db.session.rollback()

            raise
    
    @staticmethod
    def update_quantity(
        product_id,
        operation,
        quantity,
        remarks=None
    ):
        product = Product.query.get(product_id)

        if not product:
            raise ValueError(
                "Product not found."
            )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            raise ValueError(
                "Quantity must be a number."
            )

        if quantity <= 0:
            raise ValueError(
                "Quantity must be greater than 0."
            )

        previous_stock = product.quantity

        if operation == "increase":
            product.quantity += quantity
            transaction_type = "STOCK_IN"

        elif operation == "decrease":

            if quantity > product.quantity:
                raise ValueError(
                    "Insufficient stock."
                )

            product.quantity -= quantity
            transaction_type = "STOCK_OUT"

        else:
            raise ValueError(
                "Invalid operation."
            )

        # Keep total amount in sync
        product.total_amount = (
            product.price *
            product.quantity
        )

        transaction = StockTransaction(
            product_id=product.id,
            user_id=current_user.id,
            transaction_type=transaction_type,
            quantity=quantity,
            previous_stock=previous_stock,
            new_stock=product.quantity,
            remarks=remarks,
            reference_no=
                f"TXN-{uuid4().hex[:8].upper()}"
        )
        
        ActivityLogService.log(
        user_id=current_user.id,
        action=transaction_type,
        entity_type="PRODUCT",
        entity_id=product.id,
        description=
            f"{transaction_type} "
            f"{quantity} units of "
            f"'{product.name}'"
        )

        try:
            db.session.add(transaction)
            db.session.commit()

            return {
                "product": product,
                "transaction": transaction
            }

        except Exception:
            db.session.rollback()
            raise