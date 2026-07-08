from datetime import datetime

from app.extensions import db

class UserSession(db.Model):
    
    __tablename__ = "user_sessions"
    
    id = db.Column(
        db.Integer,
        primary_key= True
    )
    
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    token_hash = db.Column(
        db.String(64),
        nullable=False,
        unique=True,
        index=True
    )
    
    ip_address = db.Column(
        db.String(100),
        nullable= True
    )
    
    user_agent = db.Column(
        db.Text,
        nullable=True
    )

    device_name = db.Column(
        db.String(255),
        nullable=True
    )

    revoked = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        index=True
    )
    
    expires_at = db.Column(
        db.DateTime,
        nullable=False,
        index=True
    )

    last_used_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    user = db.relationship(
        "User",
        backref=db.backref(
            "sessions",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )
    
    csrf_token = db.Column(
        db.String(255),
        nullable=False
    )
    
    def __repr__(self):
        return (
            f"<UserSession "
            f"user_id={self.user_id} "
            f"revoked={self.revoked}>"
        )