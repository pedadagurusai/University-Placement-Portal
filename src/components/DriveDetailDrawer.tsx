import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Briefcase, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { RecruitmentDrive, PlacementApplication, Student, ApplicationStage } from '../types/index.ts';
import { api } from '../services/api.ts';

interface DriveDetailDrawerProps {
  drive: RecruitmentDrive | null;
  isOpen: boolean;
  onClose: () => void;
  applications: (PlacementApplication & { studentName?: string; rollNumber?: string; department?: string; cgpa?: number })[];
  allStudents: Student[];
  onRefresh: () => void;
}

const STAGES: ApplicationStage[] = [
  'Registered',
  'Eligibility Verified',
  'Shortlisted',
  'Assessment Completed',
  'Interview in Progress',
  'Selected',
  'Offer Received',
  'Joined',
  'Rejected',
  'Withdrawn'
];

export const DriveDetailDrawer: React.FC<DriveDetailDrawerProps> = ({
  drive,
  isOpen,
  onClose,
  applications,
  allStudents,
  onRefresh
}) => {
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState<string>('');
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [targetStage, setTargetStage] = useState<ApplicationStage>('Selected');
  const [packageOffered, setPackageOffered] = useState<number>(drive?.packageLPA || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !drive) return null;

  const driveApps = applications.filter(a => a.driveId === drive.id);
  const registeredStudentIds = new Set(driveApps.map(a => a.studentId));

  // Eligible students who haven't applied yet
  const eligibleNonApplicants = allStudents.filter(s => 
    !registeredStudentIds.has(s.id) && 
    drive.eligibleDepartments.includes(s.department) &&
    s.placementRegistered
  );

  const handleAddApplicant = async () => {
    if (!selectedStudentToAdd) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.createApplication({
        studentId: selectedStudentToAdd,
        driveId: drive.id,
        currentStage: 'Registered',
        packageOfferedLPA: drive.packageLPA
      });
      if (res.success) {
        setSelectedStudentToAdd('');
        onRefresh();
      } else {
        setErrorMsg(res.error || 'Failed to add student to drive');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStage = async (appId: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.updateApplicationStage(appId, {
        stage: targetStage,
        notes: notes || undefined,
        packageOfferedLPA: ['Selected', 'Offer Received', 'Joined'].includes(targetStage) ? Number(packageOffered) : undefined
      });
      if (res.success) {
        setUpdatingAppId(null);
        setNotes('');
        onRefresh();
      } else {
        setErrorMsg(res.error || 'Failed to update stage');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating stage');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-lg text-white font-bold text-base">
              {drive.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{drive.companyName}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                  drive.status === 'Open' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  drive.status === 'Completed' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                  drive.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  drive.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {drive.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">{drive.jobRole}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Drive Stats bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Compensation</span>
            <span className="font-bold text-emerald-700">{drive.packageLPA} LPA</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cutoff CGPA</span>
            <span className="font-semibold text-slate-700">{drive.minCgpa} (Max {drive.maxBacklogs} backlogs)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
            <span className="font-semibold text-slate-700 truncate block">{drive.jobLocation}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Applicants</span>
            <span className="font-bold text-indigo-700">{driveApps.length} students</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Enrolling a student */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center space-x-1.5">
              <UserPlus className="h-4 w-4 text-indigo-600" />
              <span>Enroll Registered Student to Drive</span>
            </h4>
            <div className="flex gap-2">
              <select
                value={selectedStudentToAdd}
                onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 bg-white rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select student from eligible pool...</option>
                {eligibleNonApplicants.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.rollNumber} - {s.name} ({s.department.includes('Computer') ? 'CSE' : s.department.includes('Electronics') ? 'ECE' : 'ME'}, CGPA {s.cgpa})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddApplicant}
                disabled={!selectedStudentToAdd || isSubmitting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors shrink-0"
              >
                Enroll
              </button>
            </div>
          </div>

          {/* Applicants & Stage Funnel */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recruitment Pipeline & Candidate Progress ({driveApps.length})
              </h4>
              <span className="text-[11px] text-slate-500">
                Click any candidate to advance stage or log offer
              </span>
            </div>

            {driveApps.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
                No students enrolled in this drive yet.
              </div>
            ) : (
              <div className="space-y-3">
                {driveApps.map(app => (
                  <div 
                    key={app.id} 
                    className="border border-slate-200 rounded-xl p-4 bg-white hover:border-indigo-300 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {app.rollNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {app.studentName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {app.department} • CGPA: {app.cgpa}
                        </p>
                      </div>

                      {/* Current Stage Pill */}
                      <div className="text-right">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          ['Offer Received', 'Joined'].includes(app.currentStage) ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          app.currentStage === 'Selected' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                          app.currentStage === 'Interview in Progress' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          app.currentStage === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          app.currentStage === 'Withdrawn' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          <span>{app.currentStage}</span>
                        </span>
                        {app.packageOfferedLPA && (
                          <span className="block text-[11px] font-bold text-emerald-700 mt-0.5">
                            Offer: {app.packageOfferedLPA} LPA
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stage History */}
                    {app.stageHistory && app.stageHistory.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                        {app.stageHistory.map((h, hi) => (
                          <span key={hi} className="inline-flex items-center bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            {h.stage} ({h.updatedAt})
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Stage Update Form Trigger */}
                    {updatingAppId !== app.id ? (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setUpdatingAppId(app.id);
                            setTargetStage(app.currentStage);
                            setPackageOffered(app.packageOfferedLPA || drive.packageLPA);
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center space-x-1"
                        >
                          <span>Update Stage / Log Offer</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-slate-200 bg-slate-50/70 p-3 rounded-lg space-y-3">
                        <div className="font-semibold text-xs text-slate-800">
                          Update Stage for {app.studentName}:
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">New Stage</label>
                            <select
                              value={targetStage}
                              onChange={(e) => setTargetStage(e.target.value as ApplicationStage)}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                            >
                              {STAGES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                          {['Selected', 'Offer Received', 'Joined'].includes(targetStage) && (
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Offered CTC (LPA)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={packageOffered}
                                onChange={(e) => setPackageOffered(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Stage Note / Remarks</label>
                          <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. Cleared technical interview with exceptional feedback"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex justify-end space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setUpdatingAppId(null)}
                            className="px-3 py-1 text-xs border border-slate-300 rounded text-slate-600 hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleUpdateStage(app.id)}
                            className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium disabled:opacity-50"
                          >
                            Save Stage
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
