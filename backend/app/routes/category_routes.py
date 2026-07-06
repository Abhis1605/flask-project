from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash,
)

from flask_login import login_required

from app.services.category_service import CategoryService

category_bp = Blueprint(
    "category",
    __name__,
    url_prefix="/categories"
)

@category_bp.route("/")
@login_required
def list_categories():

    categories = CategoryService.get_categories()

    return render_template(
        "categories/list.html",
        categories=categories
    )


@category_bp.route("/add", methods=["POST"])
@login_required
def add_category():

    result = CategoryService.create_category(
        request.form
    )

    flash(
        result["message"],
        "success" if result["success"] else "danger"
    )

    return redirect(
        url_for("category.list_categories")
    )

@category_bp.route("/edit/<int:category_id>", methods=["GET", "POST"])
@login_required
def edit_category(category_id):

    category = CategoryService.get_category(category_id)

    if request.method == "POST":

        result = CategoryService.update_category(
            category_id,
            request.form
        )

        flash(
            result["message"],
            "success" if result["success"] else "danger"
        )

        if result["success"]:

            return redirect(
                url_for("category.list_categories")
            )

    return render_template(
        "categories/edit.html",
        category=category
    )

@category_bp.route("/delete/<int:category_id>", methods=["POST"])
@login_required
def delete_category(category_id):

    result = CategoryService.delete_category(
        category_id
    )

    flash(
        result["message"],
        "success" if result["success"] else "danger"
    )

    return redirect(
        url_for("category.list_categories")
    )