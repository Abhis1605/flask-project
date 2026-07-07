from datetime import datetime

from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import TokenBlocklist


class TokenService:

    @staticmethod
    def is_token_revoked(jwt_payload):
        jti = jwt_payload.get("jti")

        if not jti:
            return True

        return db.session.query(TokenBlocklist.id).filter_by(
            jti=jti
        ).scalar() is not None

    @staticmethod
    def revoke_token(jwt_payload, reason="revoked"):
        jti = jwt_payload.get("jti")

        if not jti:
            return None

        existing = TokenBlocklist.query.filter_by(
            jti=jti
        ).first()

        if existing:
            return existing

        user_id = None
        subject = jwt_payload.get("sub")

        if subject is not None:
            try:
                user_id = int(subject)
            except (TypeError, ValueError):
                user_id = None

        expires_at = datetime.utcfromtimestamp(
            jwt_payload.get("exp", 0)
        )

        token = TokenBlocklist(
            jti=jti,
            token_type=jwt_payload.get("type", "unknown"),
            user_id=user_id,
            expires_at=expires_at,
            reason=reason,
        )

        db.session.add(token)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()

            return TokenBlocklist.query.filter_by(
                jti=jti
            ).first()
        except Exception:
            db.session.rollback()
            raise

        return token
