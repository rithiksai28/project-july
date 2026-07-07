import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { Student, DerivedStats } from '../types';

interface AppContextType {
  // Navigation & Layout
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;

  // Student State
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedRiskFilter: 'All' | 'Safe' | 'Warning' | 'Critical';
  setSelectedRiskFilter: React.Dispatch<React.SetStateAction<'All' | 'Safe' | 'Warning' | 'Critical'>>;
  selectedClassFilter: string;
  setSelectedClassFilter: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;

  // Interaction Modals & Alerts
  showAddStudentModal: boolean;
  setShowAddStudentModal: React.Dispatch<React.SetStateAction<boolean>>;
  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStudentMenu: string | null;
  setSelectedStudentMenu: React.Dispatch<React.SetStateAction<string | null>>;
  toastMessage: string | null;
  setToastMessage: React.Dispatch<React.SetStateAction<string | null>>;

  // ML Predict Simulation States
  isPredicting: boolean;
  setIsPredicting: React.Dispatch<React.SetStateAction<boolean>>;
  predictionStep: number;
  setPredictionStep: React.Dispatch<React.SetStateAction<number>>;
  modelAccuracy: number;
  setModelAccuracy: React.Dispatch<React.SetStateAction<number>>;
  predictionProgressText: string;

  // File Upload State
  uploadState: 'idle' | 'dragging' | 'uploading' | 'completed';
  setUploadState: React.Dispatch<React.SetStateAction<'idle' | 'dragging' | 'uploading' | 'completed'>>;
  uploadedFile: { name: string; size: string } | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<{ name: string; size: string } | null>>;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;

  // New Student Form
  newStudentForm: {
    name: string;
    id: string;
    attendance: string;
    predicted: string;
    className: string;
    riskLevel: 'Safe' | 'Warning' | 'Critical';
  };
  setNewStudentForm: React.Dispatch<React.SetStateAction<{
    name: string;
    id: string;
    attendance: string;
    predicted: string;
    className: string;
    riskLevel: 'Safe' | 'Warning' | 'Critical';
  }>>;

  // Derived Calculations
  derivedStats: DerivedStats;
  filteredStudents: Student[];
  paginatedStudents: Student[];
  totalPages: number;

  // Actions
  triggerPrediction: () => void;
  handleAddStudent: (e: React.FormEvent) => void;
  handleExportCSV: () => void;
  removeStudent: (id: string) => void;
  processSelectedFile: (file: File) => void;
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: '#88291',
    name: 'Alex Rivera',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcuKNedc31jIdPH5mq3g38FzpCErw-OgnwnEcIRRj4_7u_uIFwODgsdja-p_hqnKzEydlQmkRalTxCIJzI6RrEtqweIppzLiy8HqfL71RmageGqQ8GIn0PTKxhaAYlaL8ZacJZNe59xU9uT9P3iLASZ2hajnN6CXD8M2Uzh-Hd4FvPk_B2yUBvKHKgR5lCQ8k9IuZ7Sk2t1FS6Kkq9Je1dDb-hKtahdRNdZbd5wErxaqKWXckz0fPF4sID5gk0Pzv7ZZiuy2K6tyk',
    attendance: 94.5,
    predicted: 92.0,
    riskLevel: 'Safe',
    className: 'CS101',
  },
  {
    id: '#88432',
    name: 'Jordan Smith',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChBVbkyVy0ezarK5p_zTpcORAjuUZF6cwYRxVR63OfeBB0oPolMZqS5MI9wJUhNIMolPH3GhhKH4RMEAPN3C3QLul9LN_J0hArhsot1RWL_T8img6i4yAv75_0jvuV-A6KTP3eUNH7Jw4lx6sWfQ5Tuxe3ID8xvfiNPUqRXtUrBCykA0tyhF0QTv1d0ZJcf6wjOmIUz__2zDzG09DhxrinNeBxq9SL8lzRQiLV6FmbAaRdBuyA2fF9hfpFGwEN6Et3xCwA8E8lPoo',
    attendance: 76.2,
    predicted: 68.5,
    riskLevel: 'Warning',
    className: 'MAT202',
  },
  {
    id: '#88511',
    name: "Liam O'Connor",
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsGhihlxTgS87n6jUxXR9dGeITzYQE3gYEMPAgFJ4BvmwTHavH52wIguwVwoivwu3w3bK4ue4bVqA028AtI0SSDwmXh81G2547EUGhjVDCheySkKkV_VC-o3u8xTnUiMTSQdr-YDmJsfuxIK4OfV87lMamoxASlEwaxl9sMUxOXfWj82g3iWW68oqaRYmXLE_O0m2B2sRB7BpvGyY_Z_ObIo5qFsRPBWKqTN0gVxIWh6jA4U5wBXzcoCIiq4NGAP0VnHpyooVrX3U',
    attendance: 62.8,
    predicted: 48.2,
    riskLevel: 'Critical',
    className: 'BIO301',
  },
  {
    id: '#88624',
    name: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    attendance: 92.1,
    predicted: 91.5,
    riskLevel: 'Safe',
    className: 'CS101',
  },
  {
    id: '#88102',
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    attendance: 81.5,
    predicted: 79.0,
    riskLevel: 'Warning',
    className: 'MAT202',
  },
  {
    id: '#88390',
    name: 'Chloe Dubois',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    attendance: 55.4,
    predicted: 41.0,
    riskLevel: 'Critical',
    className: 'BIO301',
  },
  {
    id: '#88741',
    name: 'Raj Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    attendance: 97.2,
    predicted: 96.8,
    riskLevel: 'Safe',
    className: 'ECO105',
  },
  {
    id: '#88582',
    name: 'Sophia Martinez',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    attendance: 73.6,
    predicted: 71.2,
    riskLevel: 'Warning',
    className: 'LIT110',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Student Data States
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'Safe' | 'Warning' | 'Critical'>('All');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(3);

  // Interaction Modals & Triggers
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [selectedStudentMenu, setSelectedStudentMenu] = useState<string | null>(null);

  // Predict ML Simulation States
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionStep, setPredictionStep] = useState<number>(0);
  const [modelAccuracy, setModelAccuracy] = useState<number>(98.4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File upload state simulation
  const [uploadState, setUploadState] = useState<'idle' | 'dragging' | 'uploading' | 'completed'>('idle');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // New Student Form States
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    id: '',
    attendance: '85',
    predicted: '80',
    className: 'CS101',
    riskLevel: 'Safe' as 'Safe' | 'Warning' | 'Critical',
  });

  // Dark Mode Sync Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDarkMode]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Reset currentPage if filtered list size drops
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRiskFilter, selectedClassFilter]);

  // ML Prediction Simulation Handler
  const triggerPrediction = () => {
    if (isPredicting) return;
    setIsPredicting(true);
    setPredictionStep(0);

    const stepsCount = 5;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setPredictionStep(currentStep);
      if (currentStep >= stepsCount) {
        clearInterval(interval);
        setIsPredicting(false);
        setModelAccuracy(98.9);
        setToastMessage('Predictive model successfully re-calibrated. Accuracy increased to 98.9%!');
        
        // Slightly update predicted values in state to show dynamic change!
        setStudents((prev) =>
          prev.map((s) => ({
            ...s,
            predicted: Math.min(100, Math.round((s.predicted + (Math.random() * 4 - 2)) * 10) / 10),
          }))
        );
      }
    }, 1200);
  };

  const predictionProgressText = useMemo(() => {
    const steps = [
      'Initializing predictor engine...',
      'Verifying data stream integrity...',
      'Running gradient boosted risk regression...',
      'Synthesizing cohort behaviors and historical vectors...',
      'Computing engagement index coefficients...',
      'Syncing predictive margins across 1,248 student nodes...',
      'Prediction run complete!'
    ];
    return steps[predictionStep] || steps[0];
  }, [predictionStep]);

  // File processing Simulation
  const processSelectedFile = (file: File) => {
    setUploadState('uploading');
    setUploadedFile({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadState('completed');
        setToastMessage(`Successfully uploaded and parsed ${file.name}`);
        setStudents((prev) => [
          ...prev,
          {
            id: `#${Math.floor(10000 + Math.random() * 90000)}`,
            name: 'Uploaded Record Student',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
            attendance: 87.5,
            predicted: 82.0,
            riskLevel: 'Safe',
            className: 'CS101',
          }
        ]);
      }
    }, 150);
  };

  // Stats Derived Calculations
  const baseTotal = 1248;
  const derivedStats = useMemo<DerivedStats>(() => {
    const totalCount = students.length;
    const safeCount = students.filter((s) => s.riskLevel === 'Safe').length;
    const warningCount = students.filter((s) => s.riskLevel === 'Warning').length;
    const criticalCount = students.filter((s) => s.riskLevel === 'Critical').length;

    return {
      total: baseTotal + (students.length - INITIAL_STUDENTS.length),
      safe: Math.round(baseTotal * (safeCount / totalCount)),
      warning: Math.round(baseTotal * (warningCount / totalCount)),
      critical: Math.round(baseTotal * (criticalCount / totalCount)),
    };
  }, [students]);

  // Custom Student Form Handler
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.id) {
      alert('Please fill out Name and ID fields.');
      return;
    }

    const currentAttendance = parseFloat(newStudentForm.attendance) || 85;
    const predictedAttendance = parseFloat(newStudentForm.predicted) || 80;

    let autoRisk: 'Safe' | 'Warning' | 'Critical' = 'Safe';
    if (predictedAttendance < 65) autoRisk = 'Critical';
    else if (predictedAttendance < 80) autoRisk = 'Warning';

    const newS: Student = {
      id: newStudentForm.id.startsWith('#') ? newStudentForm.id : `#${newStudentForm.id}`,
      name: newStudentForm.name,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      attendance: currentAttendance,
      predicted: predictedAttendance,
      riskLevel: autoRisk,
      className: newStudentForm.className,
    };

    setStudents((prev) => [newS, ...prev]);
    setShowAddStudentModal(false);
    setToastMessage(`Student ${newStudentForm.name} added and analyzed successfully.`);
    
    // Reset form
    setNewStudentForm({
      name: '',
      id: '',
      attendance: '85',
      predicted: '80',
      className: 'CS101',
      riskLevel: 'Safe',
    });
  };

  // Student list search, filter and pagination memo
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.className.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk = selectedRiskFilter === 'All' || student.riskLevel === selectedRiskFilter;
      const matchesClass = selectedClassFilter === 'All' || student.className === selectedClassFilter;

      return matchesSearch && matchesRisk && matchesClass;
    });
  }, [students, searchTerm, selectedRiskFilter, selectedClassFilter]);

  // Pagination bounds
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;

  // Export CSV generator function
  const handleExportCSV = () => {
    const headers = 'ID,Student Name,Attendance %,Predicted %,Risk Level,Class\n';
    const rows = filteredStudents
      .map((s) => `"${s.id}","${s.name}",${s.attendance}%,${s.predicted}%,"${s.riskLevel}","${s.className}"`)
      .join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'EduPulse_Predictive_Risk_Report.csv');
    a.click();
    setToastMessage('Exported active analysis records to CSV successfully.');
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setSelectedStudentMenu(null);
    setToastMessage('Student record removed from tracking session.');
  };

  return (
    <AppContext.Provider
      value={{
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isDarkMode,
        setIsDarkMode,
        students,
        setStudents,
        searchTerm,
        setSearchTerm,
        selectedRiskFilter,
        setSelectedRiskFilter,
        selectedClassFilter,
        setSelectedClassFilter,
        currentPage,
        setCurrentPage,
        pageSize,
        showAddStudentModal,
        setShowAddStudentModal,
        showNotifications,
        setShowNotifications,
        selectedStudentMenu,
        setSelectedStudentMenu,
        toastMessage,
        setToastMessage,
        isPredicting,
        setIsPredicting,
        predictionStep,
        setPredictionStep,
        modelAccuracy,
        setModelAccuracy,
        predictionProgressText,
        uploadState,
        setUploadState,
        uploadedFile,
        setUploadedFile,
        uploadProgress,
        setUploadProgress,
        newStudentForm,
        setNewStudentForm,
        derivedStats,
        filteredStudents,
        paginatedStudents,
        totalPages,
        triggerPrediction,
        handleAddStudent,
        handleExportCSV,
        removeStudent,
        processSelectedFile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
