from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from app.services.category_service import CategoryService

from app.decorators.permission_required import require_permission

from app.utils.api_response import (
    success_response,
    error_response
)

category_bp = Blueprint(
    "category",
    __name__,
    url_prefix="/api/v1/categories"
)

# GET - get all categories
# GET /api/v1/categories

@category_bp.route("", methods=["GET"])
@jwt_required(locations=["headers"])
@require_permission("can_view_categories")
def get_categories():

    categories = CategoryService.get_categories()

    return success_response(
        data=[
            category.to_dict()
            for category in categories
        ],
        message="Categories fetched successfully."
    )

# GET - get single category
# GET /api/v1/categories/1

@category_bp.route("/<int:category_id>", methods=["GET"])
@jwt_required(locations=["headers"])
def get_category(category_id):

    category = CategoryService.get_category(
        category_id
    )

    if not category:

        return error_response(
            message="Category not found.",
            status_code=404
        )

    return success_response(
        data=category.to_dict(),
        message="Category fetched successfully."
    )

# POST - create category
# POST /api/v1/categories

@category_bp.route("", methods=["POST"])
@jwt_required(locations=["headers"])
@require_permission("can_create_category")
def create_category():

    try:

        category = CategoryService.create_category(
            request.get_json()
        )

        return success_response(
            data=category.to_dict(),
            message="Category created successfully.",
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

# PUT - update category
# PUT /api/v1/categories/1

@category_bp.route("/<int:category_id>", methods=["PUT"])
@jwt_required(locations=["headers"])
@require_permission("can_update_category")
def update_category(category_id):

    try:

        category = CategoryService.update_category(
            category_id,
            request.get_json()
        )

        if not category:

            return error_response(
                message="Category not found.",
                status_code=404
            )

        return success_response(
            data=category.to_dict(),
            message="Category updated successfully."
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


# DELETE - delete individual category
# DELETE /api/v1/categories/:id

@category_bp.route("/<int:category_id>", methods=["DELETE"])
@jwt_required(locations=["headers"])
@require_permission("can_delete_category")
def delete_category(category_id):

    deleted = CategoryService.delete_category(
        category_id
    )

    if not deleted:

        return error_response(
            message="Category not found.",
            status_code=404
        )

    return success_response(
        message="Category deleted successfully."
    )