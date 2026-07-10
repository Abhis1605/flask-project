from app.extensions import db


class Product(db.Model):

    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(100),
        nullable=False
    )

    price = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    total_amount = db.Column(
        db.Numeric(12, 2),
        nullable=False,
        default=0
    )
    
    sku = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    low_stock_threshold = db.Column(
        db.Integer,
        nullable=False,
        default=10
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=False
    )

    category = db.relationship(
        "Category",
        back_populates="products"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": float(self.price),
            "quantity": self.quantity,
            "total_amount": float(self.total_amount),
            "category": {
                "id": self.category.id,
                "name": self.category.name
            } if self.category else None,
        }