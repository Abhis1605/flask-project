from datetime import datetime

from app.extensions import db
from app.models import UserSession


class SessionCleanupService:

    @staticmethod
    def delete_expired_sessions():
        UserSession.query.filter(
            UserSession.expires_at < datetime.utcnow()
        ).delete()

        db.session.commit()