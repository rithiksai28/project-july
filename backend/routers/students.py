from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import schemas
import models
from database import get_db
import services.student_service as student_service

router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)

@router.get("/", response_model=List[schemas.StudentResponse])
def get_all_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all students with pagination.
    """
    return student_service.get_all_students(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    """
    Create a new student. Validates uniqueness of roll number and email.
    """
    # Check roll number uniqueness
    existing_roll = student_service.get_student_by_roll_number(db, student.roll_number)
    if existing_roll:
        raise HTTPException(
            status_code=400,
            detail=f"Student with roll number '{student.roll_number}' already exists."
        )
        
    # Check email uniqueness
    existing_email = student_service.get_student_by_email(db, student.email)
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail=f"Student with email '{student.email}' already exists."
        )
        
    return student_service.create_student(db, student)

@router.get("/{student_id}", response_model=schemas.StudentDetailResponse)
def get_student_details(student_id: int, db: Session = Depends(get_db)):
    """
    Get detailed profile of a student including their complete attendance record history.
    """
    db_student = student_service.get_student(db, student_id)
    if not db_student:
        raise HTTPException(
            status_code=404,
            detail=f"Student with ID {student_id} not found."
        )
    return db_student

@router.put("/{student_id}", response_model=schemas.StudentResponse)
def update_student(student_id: int, student: schemas.StudentUpdate, db: Session = Depends(get_db)):
    """
    Update details of an existing student. Recalculates risk metrics if necessary.
    """
    db_student = student_service.get_student(db, student_id)
    if not db_student:
        raise HTTPException(
            status_code=404,
            detail=f"Student with ID {student_id} not found."
        )
        
    # Check email unique constraints if email is updated
    if student.email and student.email != db_student.email:
        existing_email = student_service.get_student_by_email(db, student.email)
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail=f"Student with email '{student.email}' already exists."
            )
            
    # Check roll number unique constraints if roll number is updated
    if student.roll_number and student.roll_number != db_student.roll_number:
        existing_roll = student_service.get_student_by_roll_number(db, student.roll_number)
        if existing_roll:
            raise HTTPException(
                status_code=400,
                detail=f"Student with roll number '{student.roll_number}' already exists."
            )
            
    return student_service.update_student(db, student_id, student)

@router.delete("/{student_id}", status_code=status.HTTP_200_OK)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    """
    Delete a student and cascade delete all their attendance records.
    """
    success = student_service.delete_student(db, student_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Student with ID {student_id} not found."
        )
    return {"message": "Student and associated records successfully deleted."}
