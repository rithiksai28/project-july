import React from 'react';
import { useApp } from '../context/AppContext';

export default function StudentTable() {
  const {
    filteredStudents,
    paginatedStudents,
    selectedRiskFilter,
    setSelectedRiskFilter,
    selectedClassFilter,
    setSelectedClassFilter,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    selectedStudentMenu,
    setSelectedStudentMenu,
    removeStudent,
    setToastMessage,
    handleExportCSV,
  } = useApp();

  return (
    <div className="glass-card rounded-[32px] overflow-hidden w-full">
      <div className="px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/20">
        <div>
          <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white">
            Predictive Risk Table {selectedRiskFilter !== 'All' ? `(${selectedRiskFilter} Only)` : ''} {selectedClassFilter !== 'All' ? `(${selectedClassFilter} Class)` : ''}
          </h3>
          <p className="text-xs text-on-surface-variant/80 mt-1">
            Showing {filteredStudents.length} active matching students in scope
          </p>
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          {/* Filter resets */}
          {(selectedRiskFilter !== 'All' || selectedClassFilter !== 'All' || searchTerm !== '') && (
            <button
              onClick={() => {
                setSelectedRiskFilter('All');
                setSelectedClassFilter('All');
                setSearchTerm('');
              }}
              className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-primary transition-colors bg-white/20 dark:bg-black/30 px-3 py-2 rounded-xl border border-white/20 cursor-pointer"
            >
              Clear Filters
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl transition-all hover:bg-primary/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-primary/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Student Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Current Class</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Attendance %</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Predicted %</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Risk Level</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => {
                let riskBadgeClass = 'risk-safe';
                if (student.riskLevel === 'Warning') riskBadgeClass = 'risk-warning';
                if (student.riskLevel === 'Critical') riskBadgeClass = 'risk-critical';

                let riskDotColor = 'bg-green-500';
                if (student.riskLevel === 'Warning') riskDotColor = 'bg-yellow-500';
                if (student.riskLevel === 'Critical') riskDotColor = 'bg-error';

                return (
                  <tr key={student.id} className="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container relative shrink-0">
                          <img className="w-full h-full object-cover" alt={student.name} src={student.avatarUrl} />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface dark:text-white">{student.name}</p>
                          <p className="text-xs text-on-surface-variant/60 dark:text-white/40">ID: {student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-200/50 dark:bg-zinc-800 px-2 py-1 rounded">
                        {student.className}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-on-surface dark:text-white">{student.attendance}%</td>
                    <td className="px-6 py-4 font-bold text-secondary dark:text-secondary-fixed">{student.predicted}%</td>
                    <td className="px-6 py-4">
                      <span className={`risk-badge ${riskBadgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${riskDotColor} animate-pulse`} />
                        {student.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={() => setSelectedStudentMenu(selectedStudentMenu === student.id ? null : student.id)}
                        className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-zinc-800 flex items-center justify-center text-on-surface-variant dark:text-white/80 cursor-pointer"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      {/* Dropdown Action Popover */}
                      {selectedStudentMenu === student.id && (
                        <div className="absolute right-6 mt-1 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-fade-in">
                          <button
                            onClick={() => {
                              setToastMessage(`Details report loaded for student ${student.name}`);
                              setSelectedStudentMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-on-surface dark:text-white cursor-pointer"
                          >
                            View Cohort Report
                          </button>
                          <button
                            onClick={() => {
                              setToastMessage(`Email notification dispatched to ${student.name} regarding attendance of ${student.attendance}%`);
                              setSelectedStudentMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-on-surface dark:text-white cursor-pointer"
                          >
                            Send Email Alert
                          </button>
                          <button
                            onClick={() => removeStudent(student.id)}
                            className="w-full text-left px-3 py-2 text-xs rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-error font-semibold cursor-pointer"
                          >
                            Delete Record
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant dark:text-white/60">
                  No students found matching current filters. Try searching for other values or clearing active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-6 bg-surface-container/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-bold text-on-surface-variant/70 dark:text-white/60 select-none border-t border-white/15">
        <span>
          Showing {Math.min(filteredStudents.length, (currentPage - 1) * pageSize + 1)}-
          {Math.min(filteredStudents.length, currentPage * pageSize)} of {filteredStudents.length} students
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((c) => c - 1)}
            className="w-10 h-10 rounded-xl border border-white/20 bg-white/40 dark:bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-primary text-white font-bold'
                    : 'bg-white/40 dark:bg-zinc-800 hover:bg-primary hover:text-white'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((c) => c + 1)}
            className="w-10 h-10 rounded-xl border border-white/20 bg-white/40 dark:bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
