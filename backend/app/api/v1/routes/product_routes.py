from flask import Blueprint, request

from flask_login import login_required

from app.services.product_service import ProductService
from app.utils.api_response import (
    success_response,
    error_response
)

product_bp = Blueprint(
    "product",
    __name__,
    url_prefix='/api/v1/products'
)

# GET all products

@product_bp.route("", methods=["GET"])
@login_required
def get_products():
    
    search = request.args.get('search', "").strip()
    
    category_id = request.args.get('category')
    
    page = request.args.get('page', 1, type=int)
    
    per_page = request.args.get("per_page", 10, type=int)
    
    sort = request.args.get("sort" "id")
    
    order = request.args.get("order", "desc")
    
    products = ProductService.get_products(
        search=search,
        category_id=category_id,
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
@login_required
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
@login_required
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
@login_required
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
@login_required
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
@login_required
def get_categories():

    categories = ProductService.get_categories()

    return success_response(
        data=[
            category.to_dict()
            for category in categories
        ],
        message="Categories fetched successfully."
    )