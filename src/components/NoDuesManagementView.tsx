import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  FileCheck, 
  Download, 
  Plus, 
  Settings, 
  Users, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';
import { 
  Student, 
  ClearanceCategory, 
  Department, 
  NoDuesAnalytics, 
  ClearanceStatus 
} from '../types/index.ts';
import { api } from '../services/api.ts';

interface NoDuesManagementViewProps {
  students: Student[];
  categories: ClearanceCategory[];
  analytics: NoDuesAnalytics | null;
  departments: Department[];
  batches: string[];
  onOpenClearanceDrawer: (student: Student) => void;
  onOpenCertificate: (student: Student) => void;
  onRefresh: () => void;
}

export const NoDuesManagementView: React.FC<NoDuesManagementViewProps> = ({
  students,
  categories,
  analytics,
  departments,
  batches,
  onOpenClearanceDrawer,
  onOpenCertificate,
  onRefresh
}) => {
  const [filterDept, setFilterDept] = useState<string>('');
  const [filterBatch, setFilterBatch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCategorySettings, setShowCategorySettings] = useState(false);

  // New category modal state
  const [newCatName, setNewCatName] = useState('');
  const [newCatAuthority, setNewCatAuthority] = useState('');
  const [newCatMandatory, setNewCatMandatory] = useState(true);
  const [newCatDesc, setNewCatDesc] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  // Bulk clearance state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [bulkCategoryId, setBulkCategoryId] = useState<string>(categories[0]?.id || '');
  const [bulkStatus, setBulkStatus] = useState<ClearanceStatus>('Cleared');
  const [bulkRemarks, setBulkRemarks] = useState('Bulk clearance approved by authorized in-charge.');
  const [isBulkExecuting, setIsBulkExecuting] = useState(false);

  const filteredStudents = students.filter(s => {
    if (filterDept && s.department !== filterDept) return false;
    if (filterBatch && s.graduationBatch !== filterBatch) return false;
    if (filterStatus === 'Cleared' && !s.overallNoDuesCleared) return false;
    if (filterStatus === 'Incomplete' && s.overallNoDuesCleared) return false;
    if (filterStatus === 'Rejected') {
      const hasRejected = s.noDuesChecklist.some(c => c.status === 'Rejected / Further Action Required');
      if (!hasRejected) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = s.rollNumber.toLowerCase().includes(q) ||
                    s.name.toLowerCase().includes(q) ||
                    s.department.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const toggleSelectStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(x => x !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const selectAllFiltered = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleExecuteBulkUpdate = async () => {
    if (selectedStudentIds.length === 0 || !bulkCategoryId) return;
    setIsBulkExecuting(true);
    try {
      await api.bulkUpdateClearance({
        studentIds: selectedStudentIds,
        categoryId: bulkCategoryId,
        status: bulkStatus,
        remarks: bulkRemarks
      });
      setSelectedStudentIds([]);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsBulkExecuting(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatAuthority) return;
    setSavingCat(true);
    try {
      await api.createCategory({
        name: newCatName.trim(),
        departmentOrAuthority: newCatAuthority.trim(),
        isMandatory: newCatMandatory,
        description: newCatDesc.trim()
      });
      setNewCatName('');
      setNewCatAuthority('');
      setNewCatDesc('');
      setShowCategorySettings(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCat(false);
    }
  };

  const handleExportNoDues = () => {
    window.location.href = '/api/analytics/export/nodues?format=csv';
  };

  return (
    <div className="space-y-5">
      {/* Analytics KPI Summary Row */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Assessed</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{analytics.totalStudents}</div>
            <span className="text-xs text-slate-500">Degree candidate students</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-xs">
            <span className="text-xs text-emerald-800 uppercase font-semibold">Fully Cleared</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-emerald-900">{analytics.fullyClearedStudents}</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-200/70 px-1.5 py-0.5 rounded">
                {analytics.clearanceRate}% Rate
              </span>
            </div>
            <span className="text-xs text-emerald-700">Eligible for certificates</span>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-xs">
            <span className="text-xs text-amber-800 uppercase font-semibold">Pending Clearances</span>
            <div className="text-2xl font-bold text-amber-900 mt-1">{analytics.pendingClearances}</div>
            <span className="text-xs text-amber-700">Missing 1+ mandatory items</span>
          </div>
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 shadow-xs">
            <span className="text-xs text-rose-800 uppercase font-semibold">Action Required / Rejected</span>
            <div className="text-2xl font-bold text-rose-900 mt-1">{analytics.rejectedRequests}</div>
            <span className="text-xs text-rose-700">Unsettled fees or lost equipment</span>
          </div>
        </div>
      )}

      {/* Rules Notice */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-950 flex items-start space-x-2.5">
        <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-indigo-900">Mandatory Clearance Evaluation Policy:</span> A student is marked <strong>FULLY CLEARED</strong> if and only if <em>every</em> mandatory clearance category is in <strong>Cleared</strong> or <strong>Not Applicable</strong> state. If any single mandatory category is marked Pending or Rejected, overall clearance is denied and certificate generation is blocked.
        </div>
      </div>

      {/* Search, Filter & Bulk Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or roll number..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="All">All Clearance Outcomes</option>
              <option value="Cleared">Fully Cleared Only</option>
              <option value="Incomplete">Incomplete / Pending Only</option>
              <option value="Rejected">Rejected / Action Required Only</option>
            </select>

            <button
              type="button"
              onClick={() => setShowCategorySettings(!showCategorySettings)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Configure Categories</span>
            </button>

            <button
              type="button"
              onClick={handleExportNoDues}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export No-Dues Report</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Bar (when rows selected) */}
        {selectedStudentIds.length > 0 && (
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-indigo-900 font-medium">
              <Check className="h-4 w-4 text-indigo-600" />
              <span><strong>{selectedStudentIds.length}</strong> students selected for batch clearance</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bulkCategoryId}
                onChange={(e) => setBulkCategoryId(e.target.value)}
                className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as ClearanceStatus)}
                className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded"
              >
                <option value="Cleared">Mark Cleared</option>
                <option value="Pending">Mark Pending</option>
                <option value="Not Applicable">Mark Not Applicable</option>
              </select>

              <button
                type="button"
                disabled={isBulkExecuting}
                onClick={handleExecuteBulkUpdate}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs disabled:opacity-50"
              >
                Apply to Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Settings Configurator Drawer/Panel */}
      {showCategorySettings && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Active Clearance Checklist Categories ({categories.length})
              </h4>
              <p className="text-[11px] text-slate-500">
                Define the mandatory and optional clearances required prior to degree release
              </p>
            </div>
            <button
              onClick={() => setShowCategorySettings(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map(c => (
              <div key={c.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900">{c.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    c.isMandatory ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.isMandatory ? 'Mandatory' : 'Optional'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">[{c.code}] • {c.departmentOrAuthority}</div>
                <p className="text-[11px] text-slate-600 line-clamp-2">{c.description}</p>
              </div>
            ))}
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-3">
            <span className="font-bold text-slate-900 block">Add New Clearance Category:</span>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Alumini Cell Clearance)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="text"
                required
                placeholder="Authority (e.g. Dean of Alumni Relations)"
                value={newCatAuthority}
                onChange={(e) => setNewCatAuthority(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
              />
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCatMandatory}
                  onChange={(e) => setNewCatMandatory(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700 font-medium">Mandatory for No-Dues Certificate</span>
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingCat}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium disabled:opacity-50"
              >
                {savingCat ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Consolidated Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={selectAllFiltered}
                    className="rounded text-indigo-600"
                  />
                </th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Overall Clearance</th>
                {categories.map(c => (
                  <th key={c.id} className="py-3 px-3 text-center font-medium">
                    <span className="truncate max-w-[100px] block" title={c.name}>
                      {c.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-normal">
                      {c.isMandatory ? '(M)' : '(O)'}
                    </span>
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5 + categories.length} className="text-center py-8 text-slate-500">
                    No student records match the filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.id)}
                        onChange={() => toggleSelectStudent(student.id)}
                        className="rounded text-indigo-600"
                      />
                    </td>

                    {/* Student */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="font-mono text-[11px] text-slate-500">{student.rollNumber}</div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-slate-700">
                      {student.department.includes('Computer') ? 'CSE' : student.department.includes('Electronics') ? 'ECE' : 'ME'}
                    </td>

                    {/* Overall Status */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        student.overallNoDuesCleared
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {student.overallNoDuesCleared ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>CLEARED</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            <span>INCOMPLETE</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Category statuses */}
                    {categories.map(c => {
                      const item = student.noDuesChecklist.find(x => x.categoryId === c.id);
                      const st = item?.status || 'Pending';

                      return (
                        <td key={c.id} className="py-3 px-3 text-center">
                          <span 
                            title={`${c.name}: ${st}${item?.pendingRequirements ? ` - ${item.pendingRequirements}` : ''}`}
                            className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-[10px] font-bold cursor-default ${
                              st === 'Cleared' ? 'bg-emerald-100 text-emerald-800' :
                              st === 'Not Applicable' ? 'bg-slate-100 text-slate-600' :
                              st === 'Rejected / Further Action Required' ? 'bg-rose-100 text-rose-800 font-extrabold' :
                              'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {st === 'Cleared' ? '✓' : st === 'Not Applicable' ? '—' : st === 'Rejected / Further Action Required' ? '✕' : '•'}
                          </span>
                        </td>
                      );
                    })}

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => onOpenClearanceDrawer(student)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          Review
                        </button>
                        {student.overallNoDuesCleared && (
                          <button
                            type="button"
                            onClick={() => onOpenCertificate(student)}
                            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center space-x-0.5"
                            title="Generate Certificate"
                          >
                            <FileCheck className="h-3 w-3" />
                            <span>Certificate</span>
                          </button>
                        )}
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
