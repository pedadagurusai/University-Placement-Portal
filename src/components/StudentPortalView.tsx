import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  Printer, 
  FileCheck, 
  ExternalLink, 
  Building2, 
  DollarSign, 
  Trophy,
  ShieldCheck,
  User
} from 'lucide-react';
import { Student, PlacementApplication, ClearanceCategory } from '../types/index.ts';

interface StudentPortalViewProps {
  student: Student | null;
  applications: PlacementApplication[];
  categories: ClearanceCategory[];
  onOpenCertificate: (student: Student) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  student,
  applications,
  categories,
  onOpenCertificate
}) => {
  if (!student) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-xl border border-slate-200">
        Please select a student profile in the header dropdown to view the student portal.
      </div>
    );
  }

  // Strict isolation: only applications for this student
  const studentApps = applications.filter(a => a.studentId === student.id);
  const offerApps = studentApps.filter(a => ['Selected', 'Offer Received', 'Joined'].includes(a.currentStage));

  const mandatoryPendingItems = student.noDuesChecklist.filter(c => {
    const cat = categories.find(cat => cat.id === c.categoryId);
    return cat?.isMandatory && c.status !== 'Cleared' && c.status !== 'Not Applicable';
  });

  return (
    <div className="space-y-6">
      {/* Student Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-sm ring-2 ring-indigo-400/40">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white tracking-tight">{student.name}</h2>
                <span className="font-mono text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30">
                  {student.rollNumber}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {student.program} in {student.department} • Batch {student.graduationBatch} (Year {student.year}, Section {student.section})
              </p>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1.5 font-mono">
                <span>{student.email}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold font-sans">CGPA: {student.cgpa}</span>
                <span>•</span>
                <span className="text-slate-300 font-sans">{student.backlogs} Backlogs</span>
              </div>
            </div>
          </div>

          {/* Overall No-Dues Badge & Certificate Action */}
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/15 flex flex-col items-end">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mb-1">
              No-Dues Clearance Status
            </span>
            {student.overallNoDuesCleared ? (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>FULLY CLEARED</span>
                </span>
                <button
                  type="button"
                  onClick={() => onOpenCertificate(student)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  View Certificate
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>CLEARANCE INCOMPLETE</span>
              </span>
            )}
            <span className="text-[10px] text-slate-300 mt-1.5">
              Strict Isolation: Only your private academic records are accessible
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Placement Status vs No-Dues Clearance Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: Personal Placement Hub */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-indigo-600" />
              <span>Personal Placement Hub & Recruitment Drives</span>
            </h3>
            <span className="text-xs text-slate-500">{studentApps.length} drives registered</span>
          </div>

          {/* Eligibility Card */}
          <div className={`p-4 rounded-xl border ${
            student.eligibleForPlacement
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-amber-50/60 border-amber-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block ${
                  student.eligibleForPlacement ? 'text-emerald-800' : 'text-amber-800'
                }`}>
                  {student.eligibleForPlacement ? 'Placement Eligibility: Confirmed' : 'Placement Ineligible'}
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  {student.eligibleForPlacement
                    ? 'You meet university placement criteria (CGPA >= 7.0 and 0 active backlogs). You are eligible to apply for on-campus drives.'
                    : 'Current academic standing does not satisfy threshold criteria. Contact the Placement Cell for counseling.'}
                </p>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                student.placementRegistered ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {student.placementRegistered ? 'Registered with TPO' : 'Registration Pending'}
              </span>
            </div>
          </div>

          {/* Offers Extended Banner */}
          {offerApps.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Official Job Offers Received ({offerApps.length})
              </span>
              {offerApps.map(app => (
                <div key={app.id} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-amber-300" />
                      <h4 className="text-base font-bold">{app.companyName}</h4>
                    </div>
                    <p className="text-xs text-emerald-100">{app.jobRole}</p>
                    {app.offerLetterRef && (
                      <p className="text-[10px] font-mono text-emerald-200">
                        Ref: {app.offerLetterRef}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold block">{app.packageOfferedLPA} LPA</span>
                    <span className="text-[10px] uppercase font-semibold bg-white/20 px-2 py-0.5 rounded">
                      {app.currentStage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Registered Applications List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-xs text-slate-700">
              Registered Companies & Interview Stages
            </div>

            {studentApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                You have not registered for any recruitment drives yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {studentApps.map(app => (
                  <div key={app.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{app.companyName}</h4>
                        <p className="text-[11px] text-slate-500">{app.jobRole}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        ['Offer Received', 'Joined'].includes(app.currentStage) ? 'bg-emerald-100 text-emerald-800' :
                        app.currentStage === 'Selected' ? 'bg-teal-100 text-teal-800' :
                        app.currentStage === 'Interview in Progress' ? 'bg-amber-100 text-amber-800' :
                        app.currentStage === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-indigo-50 text-indigo-700'
                      }`}>
                        {app.currentStage}
                      </span>
                    </div>

                    {/* Timeline stepper */}
                    {app.stageHistory && app.stageHistory.length > 0 && (
                      <div className="pt-2 text-[10px] text-slate-500 space-y-1">
                        <div className="font-semibold text-slate-700">Stage Updates:</div>
                        {app.stageHistory.map((h, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <span className="font-medium text-slate-800">{h.stage}</span>
                            <span>({h.updatedAt})</span>
                            {h.notes && <span className="text-slate-600 italic">- "{h.notes}"</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Personal No-Dues Checklist & Clearance Hub */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span>Department No-Dues Clearance Checklist</span>
            </h3>
            {student.overallNoDuesCleared && (
              <button
                type="button"
                onClick={() => onOpenCertificate(student)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center space-x-1"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Certificate</span>
              </button>
            )}
          </div>

          {/* Pending Requirements Summary Alert if incomplete */}
          {!student.overallNoDuesCleared && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Outstanding Clearances ({mandatoryPendingItems.length} Pending)</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Clearance certificates and degrees are released strictly once all mandatory items are verified. Please complete the tasks below and contact the respective department officers. Students cannot self-approve clearances.
              </p>
              <ul className="list-disc list-inside text-xs text-amber-950 font-medium space-y-1 pt-1">
                {mandatoryPendingItems.map((item, i) => (
                  <li key={i}>
                    <strong>{item.categoryName}:</strong> {item.pendingRequirements || item.remarks || 'Pending officer review'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clearance Items List */}
          <div className="space-y-3">
            {categories.map(cat => {
              const item = student.noDuesChecklist.find(c => c.categoryId === cat.id);
              const status = item?.status || 'Pending';
              const isCleared = status === 'Cleared' || status === 'Not Applicable';

              return (
                <div
                  key={cat.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                    isCleared ? 'border-emerald-200 bg-emerald-50/10' :
                    status === 'Rejected / Further Action Required' ? 'border-rose-200 bg-rose-50/20' :
                    'border-amber-200 bg-amber-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                        {cat.isMandatory ? (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        In-Charge: <strong className="text-slate-700">{cat.departmentOrAuthority}</strong>
                      </p>
                    </div>

                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                      status === 'Cleared' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      status === 'Not Applicable' ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                      status === 'Rejected / Further Action Required' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {status === 'Cleared' && <CheckCircle2 className="h-3 w-3" />}
                      {status === 'Pending' && <Clock className="h-3 w-3" />}
                      {status === 'Rejected / Further Action Required' && <AlertCircle className="h-3 w-3" />}
                      <span>{status}</span>
                    </span>
                  </div>

                  {/* Remarks & Requirements */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                    {item?.remarks && (
                      <p className="text-[11px]">
                        <span className="font-semibold text-slate-700">Remarks:</span> {item.remarks}
                      </p>
                    )}
                    {item?.pendingRequirements && (
                      <p className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-1.5 rounded border border-rose-200">
                        Action Required: {item.pendingRequirements}
                      </p>
                    )}
                    {item?.updatedAt && (
                      <p className="text-[10px] text-slate-400">
                        Last assessed on {new Date(item.updatedAt).toLocaleDateString()} by {item.updatedBy || cat.departmentOrAuthority}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
