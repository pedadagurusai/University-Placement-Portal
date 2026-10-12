import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Award, 
  ChevronRight, 
  Edit3, 
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { RecruitmentDrive, DriveStatus } from '../types/index.ts';
import { api } from '../services/api.ts';

interface DrivesListViewProps {
  drives: (RecruitmentDrive & { 
    totalApplicants?: number; 
    selectedCount?: number; 
    offersCount?: number;
    stageCounts?: Record<string, number>;
  })[];
  onOpenCreateDriveModal: (drive?: RecruitmentDrive) => void;
  onOpenDriveDetail: (drive: RecruitmentDrive) => void;
  onRefresh: () => void;
}

export const DrivesListView: React.FC<DrivesListViewProps> = ({
  drives,
  onOpenCreateDriveModal,
  onOpenDriveDetail,
  onRefresh
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredDrives = drives.filter(d => {
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!d.companyName.toLowerCase().includes(q) && !d.jobRole.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this recruitment drive and associated student applications?')) return;
    setDeletingId(id);
    try {
      await api.deleteDrive(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company or job designation..."
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg w-64 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs">
            {['All', 'Open', 'In Progress', 'Completed', 'Planned', 'Cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenCreateDriveModal()}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Recruitment Drive</span>
        </button>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrives.map(drive => {
          const isCancelled = drive.status === 'Cancelled';

          return (
            <div 
              key={drive.id}
              className={`bg-white rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden ${
                isCancelled ? 'opacity-75 bg-slate-50/50' : ''
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Top Info: Company Name, Role, Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {drive.companyName}
                    </h3>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">
                      {drive.jobRole}
                    </p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider ${
                    drive.status === 'Open' ? 'bg-emerald-100 text-emerald-800' :
                    drive.status === 'Completed' ? 'bg-indigo-100 text-indigo-800' :
                    drive.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                    drive.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {drive.status}
                  </span>
                </div>

                {/* Package & Location */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Package CTC</span>
                      <span className="font-bold text-slate-900">{drive.packageLPA} LPA</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Location</span>
                      <span className="font-medium truncate block">{drive.jobLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Eligibility criteria summary */}
                <div className="text-xs space-y-1 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-700">Criteria:</span> Min CGPA {drive.minCgpa} • Max {drive.maxBacklogs} backlogs
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-slate-700">Batches:</span> {drive.eligibleBatches.join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    <span className="font-semibold text-slate-700">Depts:</span> {drive.eligibleDepartments.map(d => d.includes('Computer') ? 'CSE' : d.includes('Electronics') ? 'ECE' : 'ME').join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Deadline:</span> {drive.registrationDeadline}
                  </div>
                </div>

                {/* Applicant metrics */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-slate-700">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-bold text-indigo-700">{drive.totalApplicants || 0}</span>
                    <span className="text-slate-500">enrolled</span>
                  </div>
                  <div className="flex items-center space-x-2 font-semibold">
                    <span className="text-emerald-700">{drive.offersCount || 0} Offers</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onOpenCreateDriveModal(drive)}
                    title="Edit Drive Settings"
                    className="p-1 text-slate-500 hover:text-slate-800 rounded"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(drive.id)}
                    disabled={deletingId === drive.id}
                    title="Delete Drive"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenDriveDetail(drive)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Manage Applicants & Pipeline</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
