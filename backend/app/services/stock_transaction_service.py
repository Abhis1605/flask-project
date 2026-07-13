
from uuid import uuid4

from app.extensions import db
from app.models.stock_transaction import StockTransaction
from app.services.activity_log_service import (
    ActivityLogService
)


class StockTransactionService:

    @staticmethod
    def update_stock(
        *,
        product,
        user,
        transaction_type,
        quantity,
        remarks=None
    ):
        previous_stock = product.quantity

        if transaction_type == "STOCK_IN":
            new_stock = previous_stock + quantity

            description = (
                f"Added {quantity} units to "
                f"'{product.name}'. "
                f"Stock changed from "
                f"{previous_stock} to "
                f"{new_stock}. "
                f"Remarks: "
                f"{remarks or 'N/A'}"
            )

        elif transaction_type == "STOCK_OUT":

            if quantity > previous_stock:
                raise ValueError(
                    "Insufficient stock available."
                )

            new_stock = previous_stock - quantity

            description = (
                f"Removed {quantity} units from "
                f"'{product.name}'. "
                f"Stock changed from "
                f"{previous_stock} to "
                f"{new_stock}. "
                f"Remarks: "
                f"{remarks or 'N/A'}"
            )

        elif transaction_type == "ADJUSTMENT":
            new_stock = quantity

            description = (
                f"Adjusted stock of "
                f"'{product.name}' from "
                f"{previous_stock} to "
                f"{new_stock}. "
                f"Remarks: "
                f"{remarks or 'N/A'}"
            )

        else:
            raise ValueError(
                "Invalid transaction type."
            )

        product.quantity = new_stock
        product.total_amount = (
            product.price * new_stock
        )

        transaction = StockTransaction(
            product_id=product.id,
            user_id=user.id,
            transaction_type=transaction_type,
            quantity=quantity,
            previous_stock=previous_stock,
            new_stock=new_stock,
            remarks=remarks,
            reference_no=(
                f"TXN-"
                f"{uuid4().hex[:8].upper()}"
            )
        )

        try:
            db.session.add(transaction)

            ActivityLogService.log(
                user_id=user.id,
                action=transaction_type,
                entity_type="PRODUCT",
                entity_id=product.id,
                description=description
            )

            db.session.commit()

            return transaction

        except Exception:
            db.session.rollback()
            raise