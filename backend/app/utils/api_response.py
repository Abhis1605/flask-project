# This file will contain all success and error responses.
# Every route in the project will use this helper.
# This avoids repeating JSON formatting everywhere.

from flask import jsonify


def success_response(
    data=None,
    message="Success",
    status_code=200
):
    """
    Standard success API response.
    """

    return jsonify({
        "success": True,
        "message": message,
        "data": data
    }), status_code


def error_response(
    message="Something went wrong.",
    errors=None,
    status_code=400
):
    """
    Standard error API response.
    """

    return jsonify({
        "success": False,
        "message": message,
        "errors": errors
    }), status_code