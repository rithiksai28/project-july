import os
from sqlalchemy import create_backend_engine, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define database URL. Using SQLite local file.
DATABASE_URL = "sqlite:///./attendance.db"

# Create database engine
# connect_args={"check_same_thread": False} is needed only for SQLite to allow multi-threaded access.
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create declarative Base class for models
Base = declarative_base()

def get_db():
    """
    Dependency generator function that yields a database session and closes it
    after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
