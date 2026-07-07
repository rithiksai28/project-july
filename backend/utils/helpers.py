import re
from datetime import datetime, date
from typing import List, Tuple, Optional

def parse_date(date_str: str) -> Optional[date]:
    """
    Parses dynamic date strings in common formats (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY).
    """
    date_str = date_str.strip()
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%m-%d-%Y"):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    return None

def validate_csv_columns(headers: List[str]) -> Tuple[bool, str]:
    """
    Validates that the upload CSV contains the required columns.
    Headers are normalized to lowercase for consistency.
    """
    normalized_headers = [h.strip().lower() for h in headers]
    required = ["roll_number", "date", "status"]
    
    missing = [col for col in required if col not in normalized_headers]
    if missing:
        return False, f"Missing required columns: {', '.join(missing)}"
    
    return True, ""

def validate_attendance_status(status: str) -> Tuple[bool, str]:
    """
    Normalizes and validates attendance statuses.
    Allowed: 'Present', 'Absent', 'Late'
    """
    status_norm = status.strip().title()
    allowed = ["Present", "Absent", "Late"]
    if status_norm not in allowed:
        return False, f"Invalid status '{status}'. Must be one of: {', '.join(allowed)}"
    return True, status_norm
