"""grant stock transaction permissions to admin and inventory manager

Revision ID: a1e5c2f4b6d7
Revises: df3d24d0164a
Create Date: 2026-07-13 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1e5c2f4b6d7'
down_revision = 'df3d24d0164a'
branch_labels = None
depends_on = None

roles_table = sa.table(
    'roles',
    sa.column('code', sa.String),
    sa.column('can_view_stock_transactions', sa.Boolean),
    sa.column('can_adjust_stock', sa.Boolean),
)

GRANTED_ROLE_CODES = ('ADMIN', 'INVENTORY_MANAGER')


def upgrade():
    conn = op.get_bind()

    conn.execute(
        roles_table.update()
        .where(sa.func.upper(roles_table.c.code).in_(GRANTED_ROLE_CODES))
        .values(can_view_stock_transactions=True, can_adjust_stock=True)
    )


def downgrade():
    conn = op.get_bind()

    conn.execute(
        roles_table.update()
        .where(sa.func.upper(roles_table.c.code).in_(GRANTED_ROLE_CODES))
        .values(can_view_stock_transactions=False, can_adjust_stock=False)
    )
