from flask import Blueprint, render_template
from flask_login import login_required

from app.models import Product, Category

home_bp = Blueprint(
    "home",
    __name__
)


@home_bp.route("/")
@login_required
def home():

    total_products = Product.query.count()

    total_categories = Category.query.count()

    return render_template(
        "home.html",
        total_products=total_products,
        total_categories=total_categories,
    )