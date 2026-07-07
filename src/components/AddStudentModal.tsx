import React from 'react';
import { useApp } from '../context/AppContext';

export default function AddStudentModal() {
  const {
    showAddStudentModal,
    setShowAddStudentModal,
    newStudentForm,
    setNewStudentForm,
    handleAddStudent,
  } = useApp();

  if (!showAddStudentModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] max-w-md w-full p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative">
        <button
          onClick={() => setShowAddStudentModal(false)}
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          title="Close Modal"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h3 className="font-headline-md text-2xl font-bold text-on-surface dark:text-white mb-2">New Student Analysis</h3>
        <p className="text-sm text-zinc-500 mb-6">Create a predictive tracking record for a new semester attendee.</p>

        <form onSubmit={handleAddStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              required
              value={newStudentForm.name}
              onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
              placeholder="e.g. Liam Patterson"
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Student ID</label>
              <input
                type="text"
                required
                value={newStudentForm.id}
                onChange={(e) => setNewStudentForm({ ...newStudentForm, id: e.target.value })}
                placeholder="e.g. 88612"
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Class</label>
              <select
                value={newStudentForm.className}
                onChange={(e) => setNewStudentForm({ ...newStudentForm, className: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="CS101">CS101</option>
                <option value="MAT202">MAT202</option>
                <option value="BIO301">BIO301</option>
                <option value="ECO105">ECO105</option>
                <option value="LIT110">LIT110</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Attendance %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newStudentForm.attendance}
                onChange={(e) => setNewStudentForm({ ...newStudentForm, attendance: e.target.value })}
                placeholder="85"
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Predicted %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newStudentForm.predicted}
                onChange={(e) => setNewStudentForm({ ...newStudentForm, predicted: e.target.value })}
                placeholder="80"
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all cursor-pointer"
            >
              Analyze & Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
