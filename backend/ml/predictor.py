import os
import pickle
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

# Try to import scikit-learn; if not available, we use a custom smart math fallback
try:
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

class StudentAttendancePredictor:
    def __init__(self, model_dir: str = "./ml"):
        self.model_dir = model_dir
        self.model_path = os.path.join(model_dir, "risk_model.pkl")
        self.scaler_path = os.path.join(model_dir, "scaler.pkl")
        self.classes_ = ["Safe", "Warning", "Critical"]
        
        # Ensure model directory exists
        os.makedirs(self.model_dir, exist_ok=True)
        
        self.model = None
        self.scaler = None
        
        # Initialize/Load the model
        if HAS_SKLEARN:
            self._load_or_train_model()

    def _generate_synthetic_training_data(self) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generates robust synthetic data for training the student risk predictor.
        Features: [attendance_rate (0-100), consecutive_absences, late_ratio]
        Labels: 0 (Safe), 1 (Warning), 2 (Critical)
        """
        np.random.seed(42)
        n_samples = 300
        
        # Safe class: High attendance, low consecutive absences, low late ratio
        safe_attendance = np.random.uniform(85.0, 100.0, n_samples // 3)
        safe_absences = np.random.randint(0, 2, n_samples // 3)
        safe_late = np.random.uniform(0.0, 0.15, n_samples // 3)
        X_safe = np.column_stack((safe_attendance, safe_absences, safe_late))
        y_safe = np.zeros(n_samples // 3)
        
        # Warning class: Moderate attendance, some consecutive absences, moderate late ratio
        warning_attendance = np.random.uniform(73.0, 86.0, n_samples // 3)
        warning_absences = np.random.randint(0, 3, n_samples // 3)
        warning_late = np.random.uniform(0.1, 0.4, n_samples // 3)
        X_warning = np.column_stack((warning_attendance, warning_absences, warning_late))
        y_warning = np.ones(n_samples // 3)
        
        # Critical class: Low attendance, high consecutive absences, high late ratio
        critical_attendance = np.random.uniform(40.0, 74.0, n_samples // 3)
        critical_absences = np.random.randint(2, 6, n_samples // 3)
        critical_late = np.random.uniform(0.2, 0.7, n_samples // 3)
        X_critical = np.column_stack((critical_attendance, critical_absences, critical_late))
        y_critical = np.ones(n_samples // 3) * 2
        
        X = np.vstack((X_safe, X_warning, X_critical))
        y = np.concatenate((y_safe, y_warning, y_critical))
        
        # Add some random noise to make the model training realistic
        noise = np.random.normal(0, 0.05, X.shape)
        X = np.abs(X + noise)
        X[:, 0] = np.clip(X[:, 0], 0.0, 100.0)  # cap attendance rate to 100%
        X[:, 1] = np.round(X[:, 1])  # absences are integers
        
        return X, y.astype(int)

    def _load_or_train_model(self):
        """Loads a pre-trained model and scaler or trains a new one if not found."""
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            try:
                with open(self.model_path, "rb") as f:
                    self.model = pickle.load(f)
                with open(self.scaler_path, "rb") as f:
                    self.scaler = pickle.load(f)
                return
            except Exception as e:
                print(f"Error loading model: {e}. Retraining...")
        
        # Train a new model
        try:
            X, y = self._generate_synthetic_training_data()
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X)
            
            self.model = LogisticRegression(max_iter=1000, random_state=42)
            self.model.fit(X_scaled, y)
            
            # Save the trained components
            with open(self.model_path, "wb") as f:
                pickle.dump(self.model, f)
            with open(self.scaler_path, "wb") as f:
                pickle.dump(self.scaler, f)
            print("Model trained and saved successfully.")
        except Exception as e:
            print(f"Model training failed: {e}. Will fall back to rule-based classification.")
            self.model = None
            self.scaler = None

    def predict(self, attendance_rate: float, consecutive_absences: int, late_ratio: float) -> str:
        """
        Predicts student risk status.
        Returns: "Safe", "Warning", or "Critical"
        """
        # Always run rule-based constraints for strict logical overrides (industry practice)
        if attendance_rate < 60.0 or consecutive_absences >= 4:
            return "Critical"
        
        if HAS_SKLEARN and self.model is not None and self.scaler is not None:
            try:
                features = np.array([[attendance_rate, consecutive_absences, late_ratio]])
                features_scaled = self.scaler.transform(features)
                class_idx = self.model.predict(features_scaled)[0]
                return self.classes_[class_idx]
            except Exception as e:
                print(f"Prediction error using ML model: {e}. Falling back to rules.")
        
        # Rule-based fallback (very elegant and reliable)
        if attendance_rate >= 85.0 and consecutive_absences <= 1 and late_ratio <= 0.2:
            return "Safe"
        elif attendance_rate < 75.0 or consecutive_absences >= 3:
            return "Critical"
        else:
            return "Warning"

# Instantiate global predictor
predictor = StudentAttendancePredictor()
