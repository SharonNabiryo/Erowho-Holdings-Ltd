"""
Erowho Holdings Limited — Input validation
Pure Python, no Flask dependencies.
"""

import re

ALLOWED_STATUSES = {"Available", "Coming Soon", "Rented", "Under Review"}
ALLOWED_INQUIRY_STATUSES = {"New", "Reviewed", "Contacted", "Closed"}


def valid_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email.strip()))


def validate_property(data: dict) -> dict:
    """Returns {field: error_message}. Empty dict means valid."""
    errors: dict = {}
    if not (data.get("title") or "").strip():
        errors["title"] = "Title is required"
    if not (data.get("country") or "").strip():
        errors["country"] = "Country is required"
    if not (data.get("city") or "").strip():
        errors["city"] = "City is required"
    if not (data.get("property_type") or "").strip():
        errors["property_type"] = "Property type is required"
    try:
        rent = int(data.get("monthly_rent", 0))
        if rent <= 0:
            errors["monthly_rent"] = "Monthly rent must be a positive number"
    except (ValueError, TypeError):
        errors["monthly_rent"] = "Monthly rent must be a number"
    status = data.get("availability_status")
    if status and status not in ALLOWED_STATUSES:
        errors["availability_status"] = (
            f"Status must be one of: {', '.join(sorted(ALLOWED_STATUSES))}"
        )
    return errors


def validate_inquiry(data: dict) -> dict:
    """Returns {field: error_message}. Empty dict means valid."""
    errors: dict = {}
    full_name = (data.get("full_name") or "").strip()
    email = (data.get("email") or "").strip()
    if not full_name:
        errors["full_name"] = "Full name is required"
    if not email:
        errors["email"] = "Email address is required"
    elif not valid_email(email):
        errors["email"] = "Please enter a valid email address"
    return errors
