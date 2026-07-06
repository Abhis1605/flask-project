from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash,
)

from flask_login import login_required

from app.services.product_service import ProductService

product_bp = Blueprint(
    "product",
    __name__,
    url_prefix="/products"
)

@product_bp.route("/add", methods=["POST"])
@login_required
def add_product():

    result = ProductService.create_product(
        request.form
    )

    flash(
        result["message"],
        "success" if result["success"] else "danger"
    )

    return redirect(
        url_for("product.list_products")
    )


@product_bp.route("/", methods=["GET"])
@login_required
def list_products():

    search = request.args.get("search", "").strip()

    category_id = request.args.get("category", "").strip()

    products = ProductService.get_products(
        search,
        category_id
    )

    categories = ProductService.get_categories()

    return render_template(
        "products.html",
        products=products,
        categories=categories,
        search=search,
        selected_category=category_id
    )
    
@product_bp.route("/edit/<int:product_id>", methods=["GET", "POST"])
@login_required
def edit_product(product_id):

    product = ProductService.get_product(product_id)

    if request.method == "POST":

        result = ProductService.update_product(
            product_id,
            request.form
        )

        flash(
            result["message"],
            "success" if result["success"] else "danger"
        )

        if result["success"]:

            return redirect(
                url_for("product.list_products")
            )

    return render_template(
        "products/edit.html",
        product=product,
        categories=ProductService.get_categories()
    )
    
@product_bp.route("/delete/<int:product_id>", methods=["POST"])
@login_required
def delete_product(product_id):

    result = ProductService.delete_product(product_id)

    flash(
        result["message"],
        "success" if result["success"] else "danger"
    )

    return redirect(
        url_for("product.list_products")
    )