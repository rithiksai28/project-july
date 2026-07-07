import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
import schemas
import models
from database import get_db
import services.attendance_service as attendance_service
import services.student_service as student_service

router = APIRouter(
    prefix="/api/attendance",
    tags=["Attendance & ML Predictions"]
)

# Folder to store uploaded CSV files
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=schemas.AttendanceRecordResponse, status_code=status.HTTP_201_CREATED)
def add_attendance_record(record: schemas.AttendanceRecordCreate, db: Session = Depends(get_db)):
    """
    Manually add or update a single student attendance record.
    """
    student = student_service.get_student(db, record.student_id)
    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"Student with ID {record.student_id} not found."
        )
    return attendance_service.create_attendance_record(db, record)

@router.post("/upload")
async def upload_attendance_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload an attendance CSV file.
    Format required: roll_number, date, status (Present, Absent, Late).
    Saves the file to 'uploads/' and processes records into SQLite.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only CSV files are allowed."
        )
        
    try:
        contents = await file.read()
        
        # Save a copy of the uploaded file to the uploads directory for logging
        saved_file_path = os.path.join(UPLOAD_DIR, f"{int(os.path.getmtime('./'))}_{file.filename}")
        try:
            with open(saved_file_path, "wb") as f:
                f.write(contents)
        except Exception as e:
            # If filesystem is read-only or save fails, print warning but don't crash
            print(f"Warning: Could not save file to disk: {e}")
            
        # Process CSV in-memory
        result = attendance_service.process_attendance_csv(db, contents)
        
        if not result["success"]:
            raise HTTPException(
                status_code=400,
                detail=result["error"]
            )
            
        return {
            "message": "CSV file processed successfully.",
            "data": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the file: {str(e)}"
        )

@router.get("/predict", response_model=schemas.PredictionAPIResponse)
def get_attendance_predictions(db: Session = Depends(get_db)):
    """
    ML Prediction Endpoint:
    Processes and returns the predictive risk categorization (Safe, Warning, Critical)
    for all students, together with attendance trends (consecutive absences, counts).
    """
    students = student_service.get_all_students(db)
    predictions = []
    
    for s in students:
        # Fetch all attendance records
        records = db.query(models.AttendanceRecord)\
                    .filter(models.AttendanceRecord.student_id == s.id)\
                    .order_by(models.AttendanceRecord.date.asc())\
                    .all()
                    
        total_records = len(records)
        present_count = sum(1 for r in records if r.status.title() == "Present")
        absent_count = sum(1 for r in records if r.status.title() == "Absent")
        late_count = sum(1 for r in records if r.status.title() == "Late")
        
        # Calculate consecutive absences
        consecutive_absences = 0
        for r in reversed(records):
            if r.status.title() == "Absent":
                consecutive_absences += 1
            else:
                break
                
        predictions.append(
            schemas.StudentPrediction(
                id=s.id,
                name=s.name,
                roll_number=s.roll_number,
                attendance_rate=s.attendance_rate,
                predicted_risk=s.risk_status,
                consecutive_absences=consecutive_absences,
                total_records=total_records,
                present_count=present_count,
                absent_count=absent_count,
                late_count=late_count
            )
        )
        
    return schemas.PredictionAPIResponse(
        total_processed=len(predictions),
        predictions=predictions
    )
