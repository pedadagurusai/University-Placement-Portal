import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  FileCheck, 
  User, 
  Building2,
  Calendar,
  Save,
  Check
} from 'lucide-react';
import { Student, ClearanceCategory, ClearanceStatus, StudentClearanceItem } from '../types/index.ts';
import { api } from '../services/api.ts';

interface StudentClearanceDrawerProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  categories: ClearanceCategory[];
  onRefresh: () => void;
  onOpenCertificate: (student: Student) => void;
}

export const StudentClearanceDrawer: React.FC<StudentClearanceDrawerProps> = ({
  student,
  isOpen,
  onClose,
  categories,
  onRefresh,
  onOpenCertificate
}) => {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [status, setStatus] = useState<ClearanceStatus>('Cleared');
  const [remarks, setRemarks] = useState<string>('');
  const [pendingReqs, setPendingReqs] = useState<string>('');
  const [officerName, setOfficerName] = useState<string>('Prof. K. Ramesh (HOD / Officer)');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const startEdit = (catId: string, currentItem?: StudentClearanceItem) => {
    setEditingCategoryId(catId);
    setStatus(currentItem?.status || 'Cleared');
    setRemarks(currentItem?.remarks || '');
    setPendingReqs(currentItem?.pendingRequirements || '');
    setErrorMsg(null);
  };

  const handleSaveClearance = async (categoryId: string) => {
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await api.updateStudentClearance(student.id, categoryId, {
        status,
        remarks: remarks.trim() || undefined,
        pendingRequirements: pendingReqs.trim() || undefined,
        updatedBy: officerName
      });

      if (res.success && res.student) {
        setEditingCategoryId(null);
        onRefresh();
      } else {
        setErrorMsg(res.error || 'Failed to update clearance');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating clearance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-lg text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{student.name}</h3>
                <span className="font-mono text-xs text-indigo-300 font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/50">
                  {student.rollNumber}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {student.department} • Batch {student.graduationBatch}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Overall Status Banner */}
        <div className={`px-6 py-3.5 border-b flex items-center justify-between text-xs ${
          student.overallNoDuesCleared
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center space-x-2">
            {student.overallNoDuesCleared ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {student.overallNoDuesCleared
                  ? 'OFFICIAL STATUS: FULLY CLEARED'
                  : 'OFFICIAL STATUS: INCOMPLETE / PENDING REQUIREMENTS'}
              </span>
              <span className="text-[11px] text-slate-600">
                {student.overallNoDuesCleared
                  ? 'All mandatory departmental clearances verified. Eligible for graduation degree and transfer certificates.'
                  : 'Requires full clearance across all mandatory categories before certificate issuance.'}
              </span>
            </div>
          </div>

          {student.overallNoDuesCleared && (
            <button
              type="button"
              onClick={() => onOpenCertificate(student)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-colors shrink-0 shadow-xs"
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>View Certificate</span>
            </button>
          )}
        </div>

        {/* Authority Setting */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Signing Authority / In-Charge:</span>
          <input
            type="text"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
            className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 w-64 text-slate-700 font-medium"
          />
        </div>

        {/* Checklist Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Department Clearance Checklist ({categories.length} Categories)
            </h4>
            <span className="text-[11px] text-slate-500">
              Mandatory items require Cleared or N/A
            </span>
          </div>

          <div className="space-y-3">
            {categories.map(cat => {
              const item = student.noDuesChecklist.find(c => c.categoryId === cat.id);
              const isEditing = editingCategoryId === cat.id;
              const currentStatus: ClearanceStatus = item?.status || 'Pending';

              return (
                <div
                  key={cat.id}
                  className={`border rounded-xl p-4 transition-all ${
                    isEditing ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white' :
                    currentStatus === 'Cleared' ? 'border-emerald-200 bg-emerald-50/20' :
                    currentStatus === 'Rejected / Further Action Required' ? 'border-rose-200 bg-rose-50/20' :
                    currentStatus === 'Not Applicable' ? 'border-slate-200 bg-slate-50/40' :
                    'border-amber-200 bg-amber-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-slate-900">
                          {cat.name}
                        </span>
                        {cat.isMandatory ? (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            Optional
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-slate-400">
                          [{cat.code}]
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Authority: <span className="text-slate-700 font-medium">{cat.departmentOrAuthority}</span>
                      </p>
                    </div>

                    {/* Status Pill */}
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      currentStatus === 'Cleared' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      currentStatus === 'Not Applicable' ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                      currentStatus === 'Rejected / Further Action Required' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {currentStatus === 'Cleared' && <CheckCircle2 className="h-3 w-3" />}
                      {currentStatus === 'Rejected / Further Action Required' && <AlertCircle className="h-3 w-3" />}
                      {currentStatus === 'Pending' && <Clock className="h-3 w-3" />}
                      <span>{currentStatus}</span>
                    </span>
                  </div>

                  {/* Remarks & Pending Reqs */}
                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    {item?.remarks && (
                      <p className="text-[11px]">
                        <span className="font-semibold text-slate-700">Remarks:</span> {item.remarks}
                      </p>
                    )}
                    {item?.pendingRequirements && (
                      <p className="text-[11px] text-rose-700 font-medium bg-rose-50 p-2 rounded border border-rose-200">
                        <span className="font-bold">Pending Requirements:</span> {item.pendingRequirements}
                      </p>
                    )}
                    {item?.updatedAt && (
                      <p className="text-[10px] text-slate-400">
                        Verified by {item.updatedBy || cat.departmentOrAuthority} on {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions / Editing Form */}
                  {!isEditing ? (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => startEdit(cat.id, item)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center space-x-1"
                      >
                        <span>Update Category Status</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-slate-200 bg-slate-50 p-3 rounded-lg space-y-3">
                      <div className="font-semibold text-xs text-slate-800">
                        Update clearance decision for {cat.name}:
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                            Status *
                          </label>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ClearanceStatus)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="Cleared">Cleared</option>
                            <option value="Pending">Pending</option>
                            <option value="Not Applicable">Not Applicable</option>
                            <option value="Rejected / Further Action Required">Rejected / Further Action Required</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                            Pending Requirements (if any)
                          </label>
                          <input
                            type="text"
                            value={pendingReqs}
                            onChange={(e) => setPendingReqs(e.target.value)}
                            placeholder="e.g. Fine ₹250 or Return Lab Multimeter"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                          Official Remarks / Clearance Notes
                        </label>
                        <input
                          type="text"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="e.g. All books verified in Koha catalog. No fine pending."
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCategoryId(null)}
                          className="px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-600 hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleSaveClearance(cat.id)}
                          className="px-3.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium disabled:opacity-50 inline-flex items-center space-x-1"
                        >
                          <Save className="h-3 w-3" />
                          <span>Save Clearance</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
