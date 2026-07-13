from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from app.services.product_service import ProductService
from app.utils.api_response import (
    success_response,
    error_response
)
from app.decorators.permission_required import require_permission

product_bp = Blueprint(
    "product",
    __name__,
    url_prefix='/api/v1/products'
)

# GET all products

@product_bp.route("", methods=["GET"])
@jwt_required(locations=["headers"])
@require_permission("can_view_products")
def get_products():
    
    search = request.args.get('search', "").strip()

    category_id = request.args.get('category')

    min_price = request.args.get('min_price', type=float)

    max_price = request.args.get('max_price', type=float)

    page = request.args.get('page', 1, type=int)

    per_page = request.args.get("per_page", 10, type=int)

    sort = request.args.get("sort", "id")

    order = request.args.get("order", "desc")

    products = ProductService.get_products(
        search=search,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        page=page,
        per_page=per_page,
        sort=sort,
        order=order,
    )
    
    return success_response(
        data={
            "products": [
                product.to_dict()
                for product in products.items
            ],
            "pagination": {
                "page": products.page,
                "per_page": products.per_page,
                "total": products.total,
                "pages": products.pages,
                "has_next": products.has_next,
                "has_prev": products.has_prev,
            },
        },
        message="Products fetched successfully.",
    )
    
# GET single product

@product_bp.route("/<int:product_id>", methods=["GET"])
@jwt_required(locations=["headers"])
def get_product(product_id):

    product = ProductService.get_product(product_id)

    if not product:
        return error_response(
            message="Product not found.",
            status_code=404
        )

    return success_response(
        data=product.to_dict(),
        message="Product fetched successfully."
    )

# POST - create product

@product_bp.route("", methods=["POST"])
@jwt_required(locations=["headers"])
@require_permission("can_create_product")
def create_product():

    try:

        product = ProductService.create_product(
            request.get_json()
        )

        return success_response(
            data=product.to_dict(),
            message="Product created successfully.",
            status_code=201
        )

    except ValueError as e:

        return error_response(
            message=str(e),
            status_code=400
        )

    except Exception:

        return error_response(
            message="Something went wrong.",
            status_code=500
        )

# PUT - update product

@product_bp.route("/<int:product_id>", methods=["PUT"])
@jwt_required(locations=["headers"])
@require_permission("can_update_product")
def update_product(product_id):

    try:

        product = ProductService.update_product(
            product_id,
            request.get_json()
        )

        if not product:

            return error_response(
                message="Product not found.",
                status_code=404
            )

        return success_response(
            data=product.to_dict(),
            message="Product updated successfully."
        )

    except ValueError as e:

        return error_response(
            message=str(e),
            status_code=400
        )

    except Exception:

        return error_response(
            message="Something went wrong.",
            status_code=500
        )

# DELETE - delete product

@product_bp.route("/<int:product_id>", methods=["DELETE"])
@jwt_required(locations=["headers"])
@require_permission("can_delete_product")
def delete_product(product_id):

    deleted = ProductService.delete_product(product_id)

    if not deleted:

        return error_response(
            message="Product not found.",
            status_code=404
        )

    return success_response(
        message="Product deleted successfully."
    )

@product_bp.route("/categories", methods=["GET"])
@jwt_required(locations=["headers"])
@require_permission("can_view_categories")
def get_categories():

    categories = ProductService.get_categories()

    return success_response(
        data=[
            category.to_dict()
            for category in categories
        ],
        message="Categories fetched successfully."
    )
    
@product_bp.route(
    "/<int:product_id>/quantity",
    methods=["PATCH"]
)
@jwt_required(locations=["headers"])
@require_permission("can_update_stock")
def update_quantity(product_id):
    """
    PATCH /api/v1/products/<product_id>/quantity

    Body:
    {
        "operation": "increase",
        "quantity": 10,
        "remarks": "New shipment"
    }

    or

    {
        "operation": "decrease",
        "quantity": 5,
        "remarks": "Sold items"
    }
    """

    data = request.get_json() or {}

    operation = (
        data.get("operation", "")
        .strip()
        .lower()
    )

    quantity = data.get("quantity")
    remarks = data.get("remarks")

    if operation not in (
        "increase",
        "decrease"
    ):
        return error_response(
            message=(
                "Operation must be "
                "'increase' or 'decrease'."
            ),
            status_code=400
        )

    if quantity is None:
        return error_response(
            message="Quantity is required.",
            status_code=400
        )

    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return error_response(
            message="Quantity must be a number.",
            status_code=400
        )

    if quantity <= 0:
        return error_response(
            message=(
                "Quantity must be "
                "greater than 0."
            ),
            status_code=400
        )

    try:
        result = ProductService.update_quantity(
            product_id=product_id,
            operation=operation,
            quantity=quantity,
            remarks=remarks
        )

        return success_response(
            data=result["product"].to_dict(),
            message="Stock updated successfully."
        )

    except ValueError as e:
        return error_response(
            message=str(e),
            status_code=400
        )

    except Exception:
        return error_response(
            message="Something went wrong.",
            status_code=500
        )