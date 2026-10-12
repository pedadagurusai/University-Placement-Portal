import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  FileText, 
  Users, 
  ShieldCheck, 
  Briefcase, 
  Award,
  AlertTriangle,
  Building2,
  Calendar
} from 'lucide-react';
import { Department, Student, RecruitmentDrive, PlacementApplication } from '../types/index.ts';

interface ReportsViewProps {
  students: Student[];
  drives: RecruitmentDrive[];
  applications: PlacementApplication[];
  departments: Department[];
  batches: string[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  drives,
  applications,
  departments,
  batches
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('2025');

  const handleDownloadPlacementReport = (format: 'csv' | 'xlsx') => {
    const params = new URLSearchParams({ format });
    if (selectedDept) params.set('department', selectedDept);
    if (selectedBatch) params.set('batch', selectedBatch);
    window.location.href = `/api/analytics/export/placement?${params.toString()}`;
  };

  const handleDownloadNoDuesReport = (format: 'csv' | 'xlsx') => {
    const params = new URLSearchParams({ format });
    if (selectedDept) params.set('department', selectedDept);
    if (selectedBatch) params.set('batch', selectedBatch);
    window.location.href = `/api/analytics/export/nodues?${params.toString()}`;
  };

  // Compute live unplaced list for preview
  const eligibleStudents = students.filter(s => 
    s.placementRegistered && 
    s.eligibleForPlacement &&
    (!selectedDept || s.department === selectedDept) &&
    (!selectedBatch || s.graduationBatch === selectedBatch)
  );

  const placedStudentIds = new Set(
    applications.filter(a => ['Selected', 'Offer Received', 'Joined'].includes(a.currentStage)).map(a => a.studentId)
  );

  const unplacedStudents = eligibleStudents.filter(s => !placedStudentIds.has(s.id));
  const pendingNoDuesStudents = students.filter(s => 
    !s.overallNoDuesCleared &&
    (!selectedDept || s.department === selectedDept) &&
    (!selectedBatch || s.graduationBatch === selectedBatch)
  );

  return (
    <div className="space-y-6">
      {/* Top Filter Selection */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Institutional Export & Reporting Center
          </h3>
          <p className="text-xs text-slate-500">
            Generate audited CSV and Excel (.xlsx) spreadsheets for statutory reporting and accreditation
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium"
          >
            <option value="">All Batches</option>
            {batches.map(b => (
              <option key={b} value={b}>Batch {b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Report 1: Student Placement Report */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Consolidated Student Placement Report
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Contains complete student profiles, eligibility status, total drives applied, offer letters, highest package (CTC), and individual company designations.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Includes: Roll No, Name, Dept, CGPA, Placed Status, CTC
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleDownloadPlacementReport('csv')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                <Download className="h-3.5 w-3.5" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadPlacementReport('xlsx')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Excel (.xlsx)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report 2: Department No-Dues Clearance Report */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Department No-Dues Clearance Status Report
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Detailed audit matrix showing student clearance status across Library, Labs, Accounts, Placement Cell, and Hostel, with remarks and outstanding dues.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Includes: Full category breakdown, pending fines, remarks
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleDownloadNoDuesReport('csv')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                <Download className="h-3.5 w-3.5" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadNoDuesReport('xlsx')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Excel (.xlsx)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Special Lists Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Unplaced Students List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Unplaced Eligible Students ({unplacedStudents.length})
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Requires career intervention</span>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {unplacedStudents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                All eligible registered students in this scope have secured offers!
              </div>
            ) : (
              unplacedStudents.map(s => (
                <div key={s.id} className="p-3 text-xs flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="text-slate-500 ml-2 font-mono">({s.rollNumber})</span>
                    <div className="text-[11px] text-slate-500">{s.department} • CGPA: {s.cgpa}</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Active in Drives
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending No-Dues Students List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-rose-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Students with Pending No-Dues ({pendingNoDuesStudents.length})
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Degrees held until cleared</span>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {pendingNoDuesStudents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                All students in selected filters are fully cleared!
              </div>
            ) : (
              pendingNoDuesStudents.map(s => {
                const pendingItems = s.noDuesChecklist.filter(c => c.status !== 'Cleared' && c.status !== 'Not Applicable');
                return (
                  <div key={s.id} className="p-3 text-xs flex justify-between items-center hover:bg-slate-50">
                    <div>
                      <span className="font-bold text-slate-900">{s.name}</span>
                      <span className="text-slate-500 ml-2 font-mono">({s.rollNumber})</span>
                      <div className="text-[11px] text-rose-700 font-medium">
                        Pending: {pendingItems.map(p => p.categoryName.split(' ')[0]).join(', ')}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      Incomplete
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
