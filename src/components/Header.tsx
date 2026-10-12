import React from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  User, 
  RefreshCw, 
  Building2, 
  CheckCircle2, 
  Briefcase 
} from 'lucide-react';
import { Student } from '../types/index.ts';

interface HeaderProps {
  currentRole: 'admin' | 'student';
  setCurrentRole: (role: 'admin' | 'student') => void;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  students: Student[];
  onResetData: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  selectedStudent,
  setSelectedStudent,
  students,
  onResetData,
  isResetting
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm ring-1 ring-indigo-400/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-white">Apex Institute of Technology</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Accredited A++
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Placement & Department No-Dues Clearance Portal
              </p>
            </div>
          </div>

          {/* Role Switcher & Student Selector */}
          <div className="flex items-center space-x-3">
            {/* Role Switch Pills */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700/80">
              <button
                type="button"
                onClick={() => setCurrentRole('admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  currentRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Placement In-Charge</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('student');
                  if (!selectedStudent && students.length > 0) {
                    setSelectedStudent(students[0]);
                  }
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  currentRole === 'student'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Student Portal</span>
              </button>
            </div>

            {/* If in Student View: Quick Student Impersonator / Selector */}
            {currentRole === 'student' && (
              <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1">
                <span className="text-xs text-slate-400 whitespace-nowrap">Viewing As:</span>
                <select
                  value={selectedStudent?.id || ''}
                  onChange={(e) => {
                    const st = students.find(s => s.id === e.target.value);
                    if (st) setSelectedStudent(st);
                  }}
                  className="bg-slate-900 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.rollNumber} - {st.name} ({st.department.includes('Computer') ? 'CSE' : st.department.includes('Electronics') ? 'ECE' : 'ME'}) - {st.overallNoDuesCleared ? 'Cleared' : 'Pending'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Database Button for quick evaluation */}
            <button
              type="button"
              onClick={onResetData}
              disabled={isResetting}
              title="Reset sample data back to seed state for testing"
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
