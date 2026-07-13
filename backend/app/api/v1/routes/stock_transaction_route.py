
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user

from app.models.stock_transaction import StockTransaction
from app.models.product import Product
from app.decorators.permission_required import require_permission

stock_transaction_bp = Blueprint(
    "stock_transactions",
    __name__,
    url_prefix="/api/v1/stock-transactions"
)


@stock_transaction_bp.route("", methods=["GET"])
@jwt_required()
@require_permission("can_view_stock_transactions")
def get_transactions():
    """
    GET /api/stock-transactions

    Query Params:
    ?page=1
    ?limit=10
    ?type=STOCK_IN
    ?product_id=1
    ?user_id=5
    """

    page = request.args.get(
        "page",
        1,
        type=int
    )

    limit = request.args.get(
        "limit",
        10,
        type=int
    )

    transaction_type = request.args.get("type")

    product_id = request.args.get(
        "product_id",
        type=int
    )

    user_id = request.args.get(
        "user_id",
        type=int
    )

    query = StockTransaction.query

    if transaction_type:
        query = query.filter(
            StockTransaction.transaction_type
            == transaction_type
        )

    if product_id:
        query = query.filter(
            StockTransaction.product_id
            == product_id
        )

    if user_id:
        query = query.filter(
            StockTransaction.user_id
            == user_id
        )

    pagination = query.order_by(
        StockTransaction.created_at.desc()
    ).paginate(
        page=page,
        per_page=limit,
        error_out=False
    )

    return jsonify({
        "success": True,
        "items": [
            item.to_dict()
            for item in pagination.items
        ],
        "pagination": {
            "page": pagination.page,
            "pages": pagination.pages,
            "total": pagination.total,
            "per_page": pagination.per_page,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        }
    }), 200


@stock_transaction_bp.route(
    "/<int:transaction_id>",
    methods=["GET"]
)
@jwt_required()
@require_permission("can_view_stock_transactions")
def get_transaction(transaction_id):
    """
    GET /api/stock-transactions/<id>
    """

    transaction = (
        StockTransaction.query
        .get_or_404(transaction_id)
    )

    return jsonify({
        "success": True,
        "data": transaction.to_dict()
    }), 200


@stock_transaction_bp.route(
    "/product/<int:product_id>",
    methods=["GET"]
)
@jwt_required()
@require_permission("can_view_stock_transactions")
def get_product_transactions(product_id):
    """
    GET /api/stock-transactions/product/<product_id>
    """

    product = Product.query.get_or_404(
        product_id
    )

    page = request.args.get(
        "page",
        1,
        type=int
    )

    limit = request.args.get(
        "limit",
        10,
        type=int
    )

    pagination = (
        StockTransaction.query
        .filter(
            StockTransaction.product_id
            == product.id
        )
        .order_by(
            StockTransaction.created_at.desc()
        )
        .paginate(
            page=page,
            per_page=limit,
            error_out=False
        )
    )

    return jsonify({
        "success": True,
        "product": {
            "id": product.id,
            "name": product.name,
            "quantity": product.quantity,
        },
        "items": [
            item.to_dict()
            for item in pagination.items
        ],
        "pagination": {
            "page": pagination.page,
            "pages": pagination.pages,
            "total": pagination.total,
            "per_page": pagination.per_page,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        }
    }), 200


@stock_transaction_bp.route(
    "/me",
    methods=["GET"]
)
@jwt_required()
def get_my_transactions():
    page = request.args.get(
        "page",
        1,
        type=int
    )

    limit = request.args.get(
        "limit",
        10,
        type=int
    )

    transaction_type = request.args.get(
        "type"
    )

    product_id = request.args.get(
        "product_id",
        type=int
    )

    query = (
        StockTransaction.query
        .filter(
            StockTransaction.user_id
            == current_user.id
        )
    )

    if transaction_type:
        query = query.filter(
            StockTransaction.transaction_type
            == transaction_type
        )

    if product_id:
        query = query.filter(
            StockTransaction.product_id
            == product_id
        )

    pagination = (
        query
        .order_by(
            StockTransaction.created_at.desc()
        )
        .paginate(
            page=page,
            per_page=limit,
            error_out=False
        )
    )

    return jsonify({
        "success": True,
        "items": [
            item.to_dict()
            for item in pagination.items
        ],
        "pagination": {
            "page": pagination.page,
            "pages": pagination.pages,
            "total": pagination.total,
            "per_page": pagination.per_page,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        }
    }), 200