# app/models/activity_log.py

from datetime import datetime, timezone

from app.extensions import db


class ActivityLog(db.Model):

    __tablename__ = "activity_logs"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    action = db.Column(
        db.String(50),
        nullable=False,
        index=True
    )

    entity_type = db.Column(
        db.String(50),
        nullable=False,
        index=True
    )

    entity_id = db.Column(
        db.Integer,
        nullable=True,
        index=True
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True
    )

    user = db.relationship(
        "User",
        backref=db.backref(
            "activity_logs",
            lazy=True
        )
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": (
                self.user.full_name
                if self.user
                else None
            ),
            "action": self.action,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "description": self.description,
            "created_at": (
                self.created_at.replace(tzinfo=timezone.utc).isoformat()
                if self.created_at
                else None
            )
        }