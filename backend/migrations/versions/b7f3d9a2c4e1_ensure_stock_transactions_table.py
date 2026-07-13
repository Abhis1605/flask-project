"""ensure stock transactions table exists

The original "create stock transactions table" migration
(ccbe09dcca7a) was auto-generated incorrectly and never
actually created the table - it only added a unique
constraint on products.sku. Any database that already has
that revision (and everything after it) stamped as applied
is missing the `stoack_transaction` table entirely, which
causes every stock update to fail with a 500 error. This
migration creates it if it isn't already present.

Revision ID: b7f3d9a2c4e1
Revises: a1e5c2f4b6d7
Create Date: 2026-07-13 16:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7f3d9a2c4e1'
down_revision = 'a1e5c2f4b6d7'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if 'stoack_transaction' in inspector.get_table_names():
        return

    op.create_table(
        'stoack_transaction',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('transaction_type', sa.String(length=20), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('previous_stock', sa.Integer(), nullable=False),
        sa.Column('new_stock', sa.Integer(), nullable=False),
        sa.Column('remarks', sa.String(length=255), nullable=True),
        sa.Column('reference_no', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['product_id'], ['products.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('reference_no'),
    )
    with op.batch_alter_table('stoack_transaction', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_stoack_transaction_product_id'), ['product_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_stoack_transaction_user_id'), ['user_id'], unique=False)


def downgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if 'stoack_transaction' not in inspector.get_table_names():
        return

    with op.batch_alter_table('stoack_transaction', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_stoack_transaction_user_id'))
        batch_op.drop_index(batch_op.f('ix_stoack_transaction_product_id'))

    op.drop_table('stoack_transaction')
