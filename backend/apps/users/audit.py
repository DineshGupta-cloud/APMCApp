from .models import AuditLog


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def record_audit(
    *,
    request=None,
    actor=None,
    action,
    target_type="",
    target_id=None,
    metadata=None,
):
    return AuditLog.objects.create(
        actor=actor if getattr(actor, "is_authenticated", False) else None,
        action=action,
        target_type=target_type,
        target_id=str(target_id) if target_id is not None else "",
        ip_address=get_client_ip(request) if request else None,
        metadata=metadata or {},
    )
