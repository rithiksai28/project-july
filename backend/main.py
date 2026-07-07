from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import students, attendance, dashboard

# 1. Automatically create database tables on application start if they don't exist
try:
    models.Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")
except Exception as e:
    print(f"Error initializing database tables: {e}")

# 2. Initialize FastAPI Application
app = FastAPI(
    title="Student Attendance Risk Prediction System API",
    description=(
        "A professional, robust FastAPI backend for predicting student attendance risk. "
        "Allows CRUD operations on students, attendance logging, CSV spreadsheet processing, "
        "and Machine Learning powered risk profiling (Safe, Warning, Critical)."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 3. Configure CORS (Cross-Origin Resource Sharing)
# Allowing all origins, credentials, methods, and headers for smooth frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Register Routers
app.include_router(students.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)

# 5. Root Health Check Endpoint
@app.get("/", tags=["Health Check"])
def health_check():
    """
    Root endpoint serving as a system health check.
    """
    return "Game Changer Backend Running"

# Allow direct script execution via uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
