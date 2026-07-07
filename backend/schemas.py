from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict
from datetime import date, datetime

# Attendance Record Schemas
class AttendanceRecordBase(BaseModel):
    date: date
    status: str = Field(..., description="Must be 'Present', 'Absent', or 'Late'")

class AttendanceRecordCreate(AttendanceRecordBase):
    student_id: int

class AttendanceRecordResponse(AttendanceRecordBase):
    id: int
    student_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Student Schemas
class StudentBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    roll_number: str = Field(..., min_length=2, max_length=50)

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    roll_number: Optional[str] = Field(None, min_length=2, max_length=50)
    attendance_rate: Optional[float] = Field(None, ge=0.0, le=100.0)
    risk_status: Optional[str] = Field(None, description="Must be 'Safe', 'Warning', or 'Critical'")

class StudentResponse(StudentBase):
    id: int
    attendance_rate: float
    risk_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class StudentDetailResponse(StudentResponse):
    attendance_records: List[AttendanceRecordResponse] = []

    model_config = ConfigDict(from_attributes=True)


# Prediction & CSV Upload Schemas
class StudentPrediction(BaseModel):
    id: int
    name: str
    roll_number: str
    attendance_rate: float
    predicted_risk: str  # "Safe", "Warning", "Critical"
    consecutive_absences: int
    total_records: int
    present_count: int
    absent_count: int
    late_count: int

class PredictionAPIResponse(BaseModel):
    total_processed: int
    predictions: List[StudentPrediction]


# Dashboard Schemas
class AttendanceStats(BaseModel):
    average_attendance: float
    total_present_records: int
    total_absent_records: int
    total_late_records: int

class DashboardResponse(BaseModel):
    total_students: int
    safe_students: int
    warning_students: int
    critical_students: int
    attendance_stats: AttendanceStats
