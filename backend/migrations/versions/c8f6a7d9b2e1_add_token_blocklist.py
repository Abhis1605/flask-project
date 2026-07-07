"""Add token blocklist

Revision ID: c8f6a7d9b2e1
Revises: 874e6fdec965
Create Date: 2026-07-07 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c8f6a7d9b2e1'
down_revision = '874e6fdec965'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'token_blocklist',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('jti', sa.String(length=36), nullable=False),
        sa.Column('token_type', sa.String(length=10), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('revoked_at', sa.DateTime(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('reason', sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    with op.batch_alter_table('token_blocklist', schema=None) as batch_op:
        batch_op.create_index(
            batch_op.f('ix_token_blocklist_jti'),
            ['jti'],
            unique=True
        )
        batch_op.create_index(
            batch_op.f('ix_token_blocklist_user_id'),
            ['user_id'],
            unique=False
        )


def downgrade():
    with op.batch_alter_table('token_blocklist', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_token_blocklist_user_id'))
        batch_op.drop_index(batch_op.f('ix_token_blocklist_jti'))

    op.drop_table('token_blocklist')
