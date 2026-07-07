import csv
import io
from datetime import date
from sqlalchemy.orm import Session
import models
import schemas
from utils.helpers import parse_date, validate_csv_columns, validate_attendance_status
from services.student_service import get_student_by_roll_number, recalculate_student_metrics

def create_attendance_record(db: Session, record: schemas.AttendanceRecordCreate) -> models.AttendanceRecord:
    # Check if a record already exists for this student on this date
    existing = db.query(models.AttendanceRecord)\
                 .filter(models.AttendanceRecord.student_id == record.student_id,
                         models.AttendanceRecord.date == record.date)\
                 .first()
                 
    if existing:
        existing.status = record.status.strip().title()
        db.commit()
        db.refresh(existing)
        recalculate_student_metrics(db, record.student_id)
        return existing

    db_record = models.AttendanceRecord(
        student_id=record.student_id,
        date=record.date,
        status=record.status.strip().title()
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    # Recalculate metrics for the student
    recalculate_student_metrics(db, record.student_id)
    return db_record

def process_attendance_csv(db: Session, csv_file_bytes: bytes) -> dict:
    """
    Processes uploaded attendance CSV file.
    Validates structure, checks student mapping (creates student if roll number is new),
    safely upserts records (overwriting same-date duplicates), and recalculates risk metrics.
    """
    # Parse file contents
    text_stream = io.StringIO(csv_file_bytes.decode('utf-8'))
    reader = csv.reader(text_stream)
    
    try:
        headers = next(reader)
    except StopIteration:
        return {"success": False, "error": "CSV file is empty."}
        
    is_valid, err_msg = validate_csv_columns(headers)
    if not is_valid:
        return {"success": False, "error": err_msg}
        
    # Map headers to indices
    header_map = {h.strip().lower(): idx for idx, h in enumerate(headers)}
    roll_idx = header_map["roll_number"]
    date_idx = header_map["date"]
    status_idx = header_map["status"]
    
    records_created = 0
    records_updated = 0
    records_skipped = 0
    errors = []
    affected_student_ids = set()
    
    for row_num, row in enumerate(reader, start=2):
        if not row:
            continue
        if len(row) < len(headers):
            errors.append(f"Row {row_num}: Insufficient columns. Skipped.")
            records_skipped += 1
            continue
            
        roll_num = row[roll_idx].strip()
        date_str = row[date_idx].strip()
        status_raw = row[status_idx].strip()
        
        # 1. Validate inputs
        if not roll_num:
            errors.append(f"Row {row_num}: Roll number cannot be empty. Skipped.")
            records_skipped += 1
            continue
            
        parsed_d = parse_date(date_str)
        if not parsed_d:
            errors.append(f"Row {row_num}: Invalid date format '{date_str}'. Expected YYYY-MM-DD or standard formats. Skipped.")
            records_skipped += 1
            continue
            
        is_valid_status, normalized_status = validate_attendance_status(status_raw)
        if not is_valid_status:
            errors.append(f"Row {row_num}: {normalized_status}. Skipped.")
            records_skipped += 1
            continue
            
        # 2. Get or create Student
        student = get_student_by_roll_number(db, roll_num)
        if not student:
            # Auto-create student with placeholder values to provide smooth UX
            placeholder_name = f"Student {roll_num}"
            placeholder_email = f"student_{roll_num.lower().replace('/', '_')}@example.com"
            
            # Double check email uniqueness just in case
            email_exists = db.query(models.Student).filter(models.Student.email == placeholder_email).first()
            if email_exists:
                placeholder_email = f"student_{roll_num.lower()}_{row_num}@example.com"
                
            student = models.Student(
                name=placeholder_name,
                email=placeholder_email,
                roll_number=roll_num,
                attendance_rate=100.0,
                risk_status="Safe"
            )
            db.add(student)
            db.commit()
            db.refresh(student)
            
        student_id = student.id
        affected_student_ids.add(student_id)
        
        # 3. Upsert attendance record
        existing_record = db.query(models.AttendanceRecord)\
                            .filter(models.AttendanceRecord.student_id == student_id,
                                    models.AttendanceRecord.date == parsed_d)\
                            .first()
                            
        if existing_record:
            if existing_record.status != normalized_status:
                existing_record.status = normalized_status
                records_updated += 1
            else:
                records_skipped += 1
        else:
            new_rec = models.AttendanceRecord(
                student_id=student_id,
                date=parsed_d,
                status=normalized_status
            )
            db.add(new_rec)
            records_created += 1
            
    # Commit bulk insertions/updates
    db.commit()
    
    # 4. Recalculate metrics for all affected students
    for s_id in affected_student_ids:
        recalculate_student_metrics(db, s_id)
        
    return {
        "success": True,
        "records_created": records_created,
        "records_updated": records_updated,
        "records_skipped": records_skipped,
        "errors": errors,
        "total_affected_students": len(affected_student_ids)
    }
