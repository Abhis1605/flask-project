import hashlib
import secrets
from datetime import datetime

from flask import current_app

from app.extensions import db
from app.models import UserSession


class SessionService:

    @staticmethod
    def generate_refresh_token():
        return secrets.token_urlsafe(64)

    @staticmethod
    def hash_refresh_token(token):
        return hashlib.sha256(
            token.encode()
        ).hexdigest()

    @staticmethod
    def create_session(
        user,
        ip_address=None,
        user_agent=None,
        device_name=None,
    ):
        refresh_token = (
            SessionService.generate_refresh_token()
        )

        token_hash = (
            SessionService.hash_refresh_token(
                refresh_token
            )
        )

        csrf_token = (
            secrets.token_urlsafe(32)
        )

        expires_at = (
            datetime.utcnow()
            + current_app.config[
                "JWT_REFRESH_TOKEN_EXPIRES"
            ]
        )

        session = UserSession(
            user_id=user.id,
            token_hash=token_hash,
            csrf_token=csrf_token,
            ip_address=ip_address,
            user_agent=user_agent,
            device_name=device_name,
            expires_at=expires_at,
        )

        db.session.add(session)
        db.session.commit()

        return (
            refresh_token,
            csrf_token,
            session,
        )

    @staticmethod
    def find_session(
        refresh_token,
    ):
        token_hash = (
            SessionService.hash_refresh_token(
                refresh_token
            )
        )

        return UserSession.query.filter_by(
            token_hash=token_hash,
            revoked=False,
        ).first()

    @staticmethod
    def revoke_session(
        refresh_token,
    ):
        session = (
            SessionService.find_session(
                refresh_token
            )
        )

        if not session:
            return None

        session.revoked = True

        db.session.commit()

        return session

    @staticmethod
    def revoke_all_sessions(
        user_id,
    ):
        UserSession.query.filter_by(
            user_id=user_id,
            revoked=False,
        ).update(
            {
                "revoked": True
            }
        )

        db.session.commit()

    @staticmethod
    def is_session_valid(session):
        print("SESSION:", session)

        if not session:
            return False

        print("NOW:", datetime.utcnow())
        print("EXPIRES:", session.expires_at)

        if session.revoked:
            return False

        if session.expires_at <= datetime.utcnow():
            print("EXPIRED -> REVOKING")
            session.revoked = True
            db.session.commit()
            return False

        return True

    @staticmethod
    def touch_session(
        session,
    ):
        session.last_used_at = (
            datetime.utcnow()
        )

        db.session.commit()