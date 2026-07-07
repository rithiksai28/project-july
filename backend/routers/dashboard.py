from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard Statistics"]
)

@router.get("/", response_model=schemas.DashboardResponse)
def get_dashboard_statistics(db: Session = Depends(get_db)):
    """
    Get aggregated high-level KPIs and attendance stats for the dashboard.
    Returns student volume, risk categories, and total attendance records metrics.
    """
    # 1. Total Students Count
    total_students = db.query(models.Student).count()
    
    # 2. Risk Status Distribution Counts
    safe_students = db.query(models.Student).filter(models.Student.risk_status == "Safe").count()
    warning_students = db.query(models.Student).filter(models.Student.risk_status == "Warning").count()
    critical_students = db.query(models.Student).filter(models.Student.risk_status == "Critical").count()
    
    # 3. Attendance Records Counters
    total_present_records = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.status == "Present").count()
    total_absent_records = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.status == "Absent").count()
    total_late_records = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.status == "Late").count()
    
    # 4. Average Attendance Rate across all students
    avg_rate_result = db.query(func.avg(models.Student.attendance_rate)).scalar()
    average_attendance = round(avg_rate_result, 2) if avg_rate_result is not None else 100.0
    
    return schemas.DashboardResponse(
        total_students=total_students,
        safe_students=safe_students,
        warning_students=warning_students,
        critical_students=critical_students,
        attendance_stats=schemas.AttendanceStats(
            average_attendance=average_attendance,
            total_present_records=total_present_records,
            total_absent_records=total_absent_records,
            total_late_records=total_late_records
        )
    )
