from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    if isinstance(response.data, dict):
        detail = response.data.get("detail")
        if detail:
            response.data = {"status": response.status_code, "detail": detail}
        else:
            response.data = {"status": response.status_code, "errors": response.data}
    else:
        response.data = {"status": response.status_code, "detail": response.data}

    return response
