from datetime import datetime
from app.extensions import db


class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    code = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    display_name = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    can_view_products = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_create_product = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_update_product = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_delete_product = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_view_categories = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_create_category = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_update_category = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_delete_category = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_view_stock = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_update_stock = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    can_manage_users = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )