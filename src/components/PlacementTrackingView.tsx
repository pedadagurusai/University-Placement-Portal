import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Award, 
  Clock, 
  DollarSign, 
  Users,
  Trophy
} from 'lucide-react';
import { PlacementApplication, ApplicationStage, RecruitmentDrive, Student } from '../types/index.ts';
import { api } from '../services/api.ts';

interface PlacementTrackingViewProps {
  applications: (PlacementApplication & { 
    studentName?: string; 
    rollNumber?: string; 
    department?: string; 
    cgpa?: number;
    studentEmail?: string;
  })[];
  drives: RecruitmentDrive[];
  students: Student[];
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

export const PlacementTrackingView: React.FC<PlacementTrackingViewProps> = ({
  applications,
  drives,
  students,
  onRefresh
}) => {
  const [filterDrive, setFilterDrive] = useState<string>('');
  const [filterStage, setFilterStage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [targetStage, setTargetStage] = useState<ApplicationStage>('Selected');
  const [notes, setNotes] = useState<string>('');
  const [packageOffered, setPackageOffered] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Identify students with multiple offers
  const offersCountByStudent: Record<string, number> = {};
  applications.forEach(a => {
    if (['Selected', 'Offer Received', 'Joined'].includes(a.currentStage)) {
      offersCountByStudent[a.studentId] = (offersCountByStudent[a.studentId] || 0) + 1;
    }
  });

  const multiOfferStudentIds = new Set(
    Object.keys(offersCountByStudent).filter(sid => offersCountByStudent[sid] > 1)
  );

  const filteredApps = applications.filter(a => {
    if (filterDrive && a.driveId !== filterDrive) return false;
    if (filterStage && a.currentStage !== filterStage) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = (a.studentName?.toLowerCase() || '').includes(q) ||
                    (a.rollNumber?.toLowerCase() || '').includes(q) ||
                    a.companyName.toLowerCase().includes(q) ||
                    a.jobRole.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleUpdateStage = async (appId: string) => {
    setIsSubmitting(true);
    try {
      await api.updateApplicationStage(appId, {
        stage: targetStage,
        notes: notes || undefined,
        packageOfferedLPA: ['Selected', 'Offer Received', 'Joined'].includes(targetStage) ? Number(packageOffered) : undefined
      });
      setEditingAppId(null);
      setNotes('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Multi-Offer Alert Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, roll number, or company..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Drive Filter */}
          <select
            value={filterDrive}
            onChange={(e) => setFilterDrive(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="">All Recruitment Drives</option>
            {drives.map(d => (
              <option key={d.id} value={d.id}>{d.companyName} ({d.jobRole})</option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="">All Recruitment Stages</option>
            {STAGES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {(filterDrive || filterStage || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setFilterDrive('');
                setFilterStage('');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 font-semibold px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Multi-Offer Highlight Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            <strong>Multi-Offer Tracking:</strong> Currently <strong>{multiOfferStudentIds.size} unique students</strong> hold 2 or more job offers. Each individual offer is recorded with separate CTC details without duplicating student profiles.
          </span>
        </div>
        <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
          Distinct from Unique Placed
        </span>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Student Candidate</th>
                <th className="py-3 px-4">Recruitment Drive & Role</th>
                <th className="py-3 px-4 text-center">Applied Date</th>
                <th className="py-3 px-4 text-center">Current Stage</th>
                <th className="py-3 px-4 text-right">Offered Package</th>
                <th className="py-3 px-4 text-center">Multi-Offer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No application records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => {
                  const isMulti = multiOfferStudentIds.has(app.studentId);
                  const isEditing = editingAppId === app.id;

                  return (
                    <React.Fragment key={app.id}>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        {/* Student */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{app.studentName}</div>
                          <div className="font-mono text-[11px] text-slate-500">{app.rollNumber} • {app.department}</div>
                        </td>

                        {/* Company & Role */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{app.companyName}</div>
                          <div className="text-[11px] text-slate-500">{app.jobRole}</div>
                        </td>

                        {/* Applied Date */}
                        <td className="py-3 px-4 text-center text-slate-600 font-mono">
                          {app.appliedDate}
                        </td>

                        {/* Stage */}
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                            ['Offer Received', 'Joined'].includes(app.currentStage) ? 'bg-emerald-100 text-emerald-800' :
                            app.currentStage === 'Selected' ? 'bg-teal-100 text-teal-800' :
                            app.currentStage === 'Interview in Progress' ? 'bg-amber-100 text-amber-800' :
                            app.currentStage === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                            app.currentStage === 'Withdrawn' ? 'bg-slate-100 text-slate-700' :
                            'bg-indigo-50 text-indigo-700'
                          }`}>
                            <span>{app.currentStage}</span>
                          </span>
                        </td>

                        {/* Package */}
                        <td className="py-3 px-4 text-right font-bold">
                          {app.packageOfferedLPA ? (
                            <span className="text-emerald-700">{app.packageOfferedLPA} LPA</span>
                          ) : (
                            <span className="text-slate-400 font-normal">—</span>
                          )}
                        </td>

                        {/* Multi Offer Badge */}
                        <td className="py-3 px-4 text-center">
                          {isMulti ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              <Trophy className="h-3 w-3" />
                              <span>{offersCountByStudent[app.studentId]} Offers</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditing) {
                                setEditingAppId(null);
                              } else {
                                setEditingAppId(app.id);
                                setTargetStage(app.currentStage);
                                setPackageOffered(app.packageOfferedLPA || 0);
                              }
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            {isEditing ? 'Close' : 'Update Stage'}
                          </button>
                        </td>
                      </tr>

                      {/* Inline Stage Editor */}
                      {isEditing && (
                        <tr className="bg-slate-50/90">
                          <td colSpan={7} className="p-4 border-b border-slate-200">
                            <div className="flex flex-wrap items-center gap-3">
                              <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                                  Advance Stage
                                </label>
                                <select
                                  value={targetStage}
                                  onChange={(e) => setTargetStage(e.target.value as ApplicationStage)}
                                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                                >
                                  {STAGES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>

                              {['Selected', 'Offer Received', 'Joined'].includes(targetStage) && (
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                                    Offered CTC (LPA)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={packageOffered}
                                    onChange={(e) => setPackageOffered(Number(e.target.value))}
                                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded w-28 focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                              )}

                              <div className="flex-1 min-w-[200px]">
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                                  Stage Update Notes
                                </label>
                                <input
                                  type="text"
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  placeholder="e.g. Assessment passed with 94% score, scheduled for round 2"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>

                              <div className="pt-4 flex space-x-2">
                                <button
                                  type="button"
                                  disabled={isSubmitting}
                                  onClick={() => handleUpdateStage(app.id)}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold disabled:opacity-50"
                                >
                                  Save Stage
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingAppId(null)}
                                  className="px-3 py-1.5 border border-slate-300 bg-white rounded text-xs text-slate-700 hover:bg-slate-100"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
