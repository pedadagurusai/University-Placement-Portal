import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Edit3, 
  Trash2, 
  FileCheck,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { Student, Department } from '../types/index.ts';
import { api } from '../services/api.ts';

interface StudentsListViewProps {
  students: Student[];
  departments: Department[];
  batches: string[];
  onOpenAddModal: (student?: Student) => void;
  onOpenImportModal: () => void;
  onOpenClearanceDrawer: (student: Student) => void;
  onRefresh: () => void;
}

export const StudentsListView: React.FC<StudentsListViewProps> = ({
  students,
  departments,
  batches,
  onOpenAddModal,
  onOpenImportModal,
  onOpenClearanceDrawer,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterReg, setFilterReg] = useState('');
  const [filterEligible, setFilterEligible] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Client-side quick filter matching
  const filteredStudents = students.filter(s => {
    if (filterDept && s.department !== filterDept) return false;
    if (filterBatch && s.graduationBatch !== filterBatch) return false;
    if (filterReg !== '') {
      const isReg = filterReg === 'true';
      if (s.placementRegistered !== isReg) return false;
    }
    if (filterEligible !== '') {
      const isEligible = filterEligible === 'true';
      if (s.eligibleForPlacement !== isEligible) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = s.rollNumber.toLowerCase().includes(q) ||
                    s.name.toLowerCase().includes(q) ||
                    s.email.toLowerCase().includes(q) ||
                    s.department.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this student record? This will also remove any related application records.')) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteStudent(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    window.location.href = '/api/analytics/export/placement?format=csv';
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter & Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[260px] relative">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Roll Number, Student Name, or Email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department */}
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Batch */}
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="">All Batches</option>
            {batches.map(b => (
              <option key={b} value={b}>Batch {b}</option>
            ))}
          </select>

          {/* Placement Registered */}
          <select
            value={filterReg}
            onChange={(e) => setFilterReg(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="">Registration: All</option>
            <option value="true">Registered</option>
            <option value="false">Unregistered</option>
          </select>

          {/* Clear Filters */}
          {(filterDept || filterBatch || filterReg || filterEligible || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setFilterDept('');
                setFilterBatch('');
                setFilterReg('');
                setFilterEligible('');
                setSearchTerm('');
              }}
              className="px-2 py-1 text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Main Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onOpenImportModal}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Import Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAddModal()}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Student Records Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of{' '}
          <strong className="text-slate-800">{students.length}</strong> registered student profiles
        </span>
        <button
          type="button"
          onClick={handleExportCSV}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center space-x-1"
        >
          <Download className="h-3 w-3" />
          <span>Export Filtered Table (CSV)</span>
        </button>
      </div>

      {/* Main Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Department & Program</th>
                <th className="py-3 px-4 text-center">Batch / Class</th>
                <th className="py-3 px-4 text-center">CGPA / Backlogs</th>
                <th className="py-3 px-4 text-center">Placement Registration</th>
                <th className="py-3 px-4 text-center">Eligibility</th>
                <th className="py-3 px-4 text-center">No-Dues Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    No student records match the active filters or search terms.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Roll Number */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {student.rollNumber}
                    </td>

                    {/* Student Name & Email */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="text-[11px] text-slate-500">{student.email}</div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{student.department}</div>
                      <div className="text-[11px] text-slate-500">{student.program}</div>
                    </td>

                    {/* Batch / Year / Sec */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-slate-700">Batch {student.graduationBatch}</span>
                      <div className="text-[11px] text-slate-500">Yr {student.year} • Sec {student.section}</div>
                    </td>

                    {/* CGPA & Backlogs */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-900">{student.cgpa}</span>
                      <div className="text-[11px]">
                        {student.backlogs === 0 ? (
                          <span className="text-emerald-600 font-medium">0 Backlogs</span>
                        ) : (
                          <span className="text-rose-600 font-bold">{student.backlogs} Backlog</span>
                        )}
                      </div>
                    </td>

                    {/* Placement Registered */}
                    <td className="py-3 px-4 text-center">
                      {student.placementRegistered ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Registered</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                          <span>Unregistered</span>
                        </span>
                      )}
                    </td>

                    {/* Eligibility */}
                    <td className="py-3 px-4 text-center">
                      {student.eligibleForPlacement ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800">
                          <span>Eligible</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800" title="Requires CGPA >= 7.0 and 0 backlogs">
                          <span>Ineligible</span>
                        </span>
                      )}
                    </td>

                    {/* No-Dues Clearance Status */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenClearanceDrawer(student)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-transform hover:scale-105 ${
                          student.overallNoDuesCleared
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to review or manage departmental clearance"
                      >
                        {student.overallNoDuesCleared ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Cleared</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => onOpenClearanceDrawer(student)}
                          title="Manage Department Clearances"
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenAddModal(student)}
                          title="Edit Student Profile"
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(student.id)}
                          disabled={deletingId === student.id}
                          title="Delete Student"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
