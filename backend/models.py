from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    roll_number = Column(String, unique=True, index=True, nullable=False)
    attendance_rate = Column(Float, default=100.0, nullable=False)  # 0.0 to 100.0 %
    risk_status = Column(String, default="Safe", nullable=False)     # "Safe", "Warning", "Critical"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to attendance records
    attendance_records = relationship("AttendanceRecord", back_populates="student", cascade="all, delete-orphan")


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)  # Store as Date type for easy date queries
    status = Column(String, nullable=False)  # "Present", "Absent", "Late"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to student
    student = relationship("Student", back_populates="attendance_records")
