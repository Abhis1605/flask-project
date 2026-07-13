from flask import Blueprint, request
from flask_jwt_extended import (
    jwt_required,
    current_user
)

from app.services.activity_log_service import (
    ActivityLogService
)
from app.utils.api_response import (
    success_response
)
from app.decorators.permission_required import (
    require_permission
)

activity_log_bp = Blueprint(
    "activity_logs",
    __name__,
    url_prefix="/api/v1/activity-logs"
)

@activity_log_bp.route(
    "",
    methods=["GET"]
)
@jwt_required(locations=["headers"])
@require_permission(
    "can_view_activity_logs"
)
def get_logs():

    page = request.args.get(
        "page",
        1,
        type=int
    )

    per_page = request.args.get(
        "per_page",
        10,
        type=int
    )

    user_id = request.args.get(
        "user_id",
        type=int
    )

    action = request.args.get(
        "action"
    )

    entity_type = request.args.get(
        "entity_type"
    )

    logs = (
        ActivityLogService
        .get_logs(
            page=page,
            per_page=per_page,
            user_id=user_id,
            action=action,
            entity_type=entity_type,
        )
    )

    return success_response(
        data={
            "items": [
                item.to_dict()
                for item in logs.items
            ],
            "pagination": {
                "page": logs.page,
                "pages": logs.pages,
                "total": logs.total,
                "per_page": logs.per_page,
                "has_next": logs.has_next,
                "has_prev": logs.has_prev,
            }
        },
        message="Activity logs fetched successfully."
    )

@activity_log_bp.route(
    "/me",
    methods=["GET"]
)
@jwt_required(locations=["headers"])
def get_my_logs():

    page = request.args.get(
        "page",
        1,
        type=int
    )

    per_page = request.args.get(
        "per_page",
        10,
        type=int
    )

    action = request.args.get(
        "action"
    )

    entity_type = request.args.get(
        "entity_type"
    )

    logs = (
        ActivityLogService
        .get_user_logs(
            user_id=current_user.id,
            page=page,
            per_page=per_page,
            action=action,
            entity_type=entity_type,
        )
    )

    return success_response(
        data={
            "items": [
                item.to_dict()
                for item in logs.items
            ],
            "pagination": {
                "page": logs.page,
                "pages": logs.pages,
                "total": logs.total,
                "per_page": logs.per_page,
                "has_next": logs.has_next,
                "has_prev": logs.has_prev,
            }
        },
        message="Activity logs fetched successfully."
    )
    
@activity_log_bp.route(
    "/recent",
    methods=["GET"]
)
@jwt_required(locations=["headers"])
@require_permission(
    "can_view_activity_logs"
)
def get_recent_logs():

    logs = (
        ActivityLogService
        .get_recent_logs()
    )

    return success_response(
        data=[
            item.to_dict()
            for item in logs
        ],
        message="Recent activities fetched successfully."
    )