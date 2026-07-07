from sqlalchemy.orm import Session
from sqlalchemy import desc
import models
import schemas
from ml.predictor import predictor

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_student_by_roll_number(db: Session, roll_number: str):
    return db.query(models.Student).filter(models.Student.roll_number == roll_number).first()

def get_student_by_email(db: Session, email: str):
    return db.query(models.Student).filter(models.Student.email == email).first()

def get_all_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Student).offset(skip).limit(limit).all()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(
        name=student.name,
        email=student.email,
        roll_number=student.roll_number,
        attendance_rate=100.0,
        risk_status="Safe"
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def update_student(db: Session, student_id: int, student_data: schemas.StudentUpdate):
    db_student = get_student(db, student_id)
    if not db_student:
        return None
    
    update_data = student_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_student, key, value)
        
    db.commit()
    db.refresh(db_student)
    
    # Recalculate metrics just in case the manual update changed something critical
    recalculate_student_metrics(db, student_id)
    return db_student

def delete_student(db: Session, student_id: int) -> bool:
    db_student = get_student(db, student_id)
    if not db_student:
        return False
    db.delete(db_student)
    db.commit()
    return True

def recalculate_student_metrics(db: Session, student_id: int) -> models.Student:
    """
    Recalculates attendance rate and predicted risk status for a student.
    Formula for Attendance Rate: (Present + 0.5 * Late) / Total * 100
    Risk Status: Calculated using ML predictor (based on rate, late ratio, and consecutive absences)
    """
    db_student = get_student(db, student_id)
    if not db_student:
        return None
    
    # Fetch all attendance records sorted by date ascending
    records = db.query(models.AttendanceRecord)\
                .filter(models.AttendanceRecord.student_id == student_id)\
                .order_by(models.AttendanceRecord.date.asc())\
                .all()
                
    total_records = len(records)
    if total_records == 0:
        db_student.attendance_rate = 100.0
        db_student.risk_status = "Safe"
        db.commit()
        db.refresh(db_student)
        return db_student
    
    # Core Counts
    present_count = sum(1 for r in records if r.status.title() == "Present")
    absent_count = sum(1 for r in records if r.status.title() == "Absent")
    late_count = sum(1 for r in records if r.status.title() == "Late")
    
    # 1. Calculate Attendance Rate (Lates are 0.5 Present)
    attendance_rate = ((present_count + (late_count * 0.5)) / total_records) * 100.0
    db_student.attendance_rate = round(attendance_rate, 2)
    
    # 2. Calculate Late Ratio
    late_ratio = late_count / total_records
    
    # 3. Calculate Consecutive Absences (from newest record backwards)
    consecutive_absences = 0
    # Sort backwards for current absence streak
    for r in reversed(records):
        if r.status.title() == "Absent":
            consecutive_absences += 1
        else:
            break
            
    # 4. Predict Risk Status via ML Predictor
    predicted_risk = predictor.predict(
        attendance_rate=attendance_rate,
        consecutive_absences=consecutive_absences,
        late_ratio=late_ratio
    )
    db_student.risk_status = predicted_risk
    
    db.commit()
    db.refresh(db_student)
    return db_student
