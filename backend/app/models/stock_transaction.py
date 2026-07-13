from datetime import datetime
from app.extensions import db

class StockTransaction(db.Model):
    __tablename__ = "stoack_transaction"

    id = db.Column(db.Integer, primary_key=True)
    
    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False,
        index=True
    )
    
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    transaction_type = db.Column(
        db.String(20),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    previous_stock = db.Column(
        db.Integer,
        nullable=False
    )

    new_stock = db.Column(
        db.Integer,
        nullable=False
    )

    remarks = db.Column(
        db.String(255)
    )

    reference_no = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    product = db.relationship(
        "Product",
        backref="transactions"
    )

    user = db.relationship(
        "User",
        backref="inventory_transactions"
    )
    
    def to_dict(self):
        return {
        "id": self.id,
        "reference_no": self.reference_no,
        "product_id": self.product_id,
        "product_name": self.product.name,
        "user_id": self.user_id,
        "user_name": self.user.full_name,
        "transaction_type": self.transaction_type,
        "quantity": self.quantity,
        "previous_stock": self.previous_stock,
        "new_stock": self.new_stock,
        "remarks": self.remarks,
        "created_at": self.created_at.isoformat(),
    }