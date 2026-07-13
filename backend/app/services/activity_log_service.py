from app.extensions import db
from app.models import ActivityLog

class ActivityLogService:
    
    @staticmethod
    def log(user_id, action, entity_type, entity_id, description):
        activity = ActivityLog(
            user_id=user_id,
            action=action,
            entity_id=entity_id,
            entity_type=entity_type,
            description=description
        )
        
        
        db.session.add(activity)
        
        
    @staticmethod
    def get_logs(
        page=1,
        per_page=10,
        user_id=None,
        action=None,
        entity_type=None
    ):
        query = ActivityLog.query

        if user_id:
            query = query.filter(
                ActivityLog.user_id == user_id
            )

        if action:
            query = query.filter(
                ActivityLog.action == action
            )

        if entity_type:
            query = query.filter(
                ActivityLog.entity_type == entity_type
            )

        return (
            query
            .order_by(
                ActivityLog.created_at.desc()
            )
            .paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
        )

    @staticmethod
    def get_user_logs(
        user_id,
        page=1,
        per_page=10,
        action=None,
        entity_type=None
    ):
        query = ActivityLog.query.filter(
            ActivityLog.user_id == user_id
        )

        if action:
            query = query.filter(
                ActivityLog.action == action
            )

        if entity_type:
            query = query.filter(
                ActivityLog.entity_type == entity_type
            )

        return (
            query
            .order_by(
                ActivityLog.created_at.desc()
            )
            .paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
        )

    @staticmethod
    def get_recent_logs(limit=10):
        return (
            ActivityLog.query
            .order_by(
                ActivityLog.created_at.desc()
            )
            .limit(limit)
            .all()
        )