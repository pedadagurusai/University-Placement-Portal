import React, { useState } from 'react';
import { X, Briefcase } from 'lucide-react';
import { Department, DriveStatus, RecruitmentDrive } from '../types/index.ts';
import { api } from '../services/api.ts';

interface CreateDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingDrive?: RecruitmentDrive | null;
}

const ALL_DEPARTMENTS: Department[] = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Information Technology',
  'Civil Engineering'
];

export const CreateDriveModal: React.FC<CreateDriveModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingDrive
}) => {
  const [companyName, setCompanyName] = useState(existingDrive?.companyName || '');
  const [jobRole, setJobRole] = useState(existingDrive?.jobRole || '');
  const [selectedDepts, setSelectedDepts] = useState<Department[]>(
    existingDrive?.eligibleDepartments || ['Computer Science & Engineering']
  );
  const [batchesStr, setBatchesStr] = useState(existingDrive?.eligibleBatches?.join(', ') || '2025, 2026');
  const [minCgpa, setMinCgpa] = useState<number>(existingDrive?.minCgpa || 7.0);
  const [maxBacklogs, setMaxBacklogs] = useState<number>(existingDrive?.maxBacklogs || 0);
  const [skillsStr, setSkillsStr] = useState(existingDrive?.requiredSkills?.join(', ') || 'Data Structures, Java, SQL');
  const [registrationDeadline, setRegistrationDeadline] = useState(existingDrive?.registrationDeadline || '2025-05-15');
  const [driveDate, setDriveDate] = useState(existingDrive?.driveDate || '2025-05-25');
  const [stagesStr, setStagesStr] = useState(
    existingDrive?.recruitmentStages?.join(', ') || 
    'Registration, Online Assessment, Technical Interview, HR Round, Offer Rollout'
  );
  const [jobLocation, setJobLocation] = useState(existingDrive?.jobLocation || 'Bengaluru / Hybrid');
  const [packageLPA, setPackageLPA] = useState<number>(existingDrive?.packageLPA || 12.0);
  const [status, setStatus] = useState<DriveStatus>(existingDrive?.status || 'Open');
  const [description, setDescription] = useState(existingDrive?.description || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDept = (dept: Department) => {
    if (selectedDepts.includes(dept)) {
      if (selectedDepts.length > 1) {
        setSelectedDepts(selectedDepts.filter(d => d !== dept));
      }
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const eligibleBatches = batchesStr.split(',').map(s => s.trim()).filter(Boolean);
      const requiredSkills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const recruitmentStages = stagesStr.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        companyName: companyName.trim(),
        jobRole: jobRole.trim(),
        eligibleDepartments: selectedDepts,
        eligibleBatches,
        minCgpa: Number(minCgpa),
        maxBacklogs: Number(maxBacklogs),
        requiredSkills,
        registrationDeadline,
        driveDate,
        recruitmentStages,
        jobLocation: jobLocation.trim(),
        packageLPA: Number(packageLPA),
        status,
        description: description.trim()
      };

      let res;
      if (existingDrive) {
        res = await api.updateDrive(existingDrive.id, payload);
      } else {
        res = await api.createDrive(payload);
      }

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to save drive details');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {existingDrive ? 'Edit Recruitment Drive' : 'Create New Recruitment Drive'}
              </h3>
              <p className="text-xs text-slate-500">Module 2: Manage company recruitment drive details and eligibility criteria</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Oracle, Cisco, Adobe"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job Role / Designation *</label>
              <input
                type="text"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Software Engineer / Systems Trainee"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Package CTC (LPA) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={packageLPA}
                onChange={(e) => setPackageLPA(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job Location</label>
              <input
                type="text"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Hyderabad"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Drive Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DriveStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Planned">Planned</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Eligible Departments */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Eligible Departments * (Select all applicable)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_DEPARTMENTS.map(d => (
                <label key={d} className="flex items-center space-x-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDepts.includes(d)}
                    onChange={() => toggleDept(d)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="text-slate-800 text-[11px] font-medium">{d}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Minimum CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Backlogs Allowed</label>
              <input
                type="number"
                min="0"
                value={maxBacklogs}
                onChange={(e) => setMaxBacklogs(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Eligible Batches</label>
              <input
                type="text"
                value={batchesStr}
                onChange={(e) => setBatchesStr(e.target.value)}
                placeholder="2025, 2026"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Registration Deadline *</label>
              <input
                type="date"
                required
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Drive Assessment Date</label>
              <input
                type="date"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Required Skills & Technologies</label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="e.g. C++, Java, React, Python, Cloud"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Recruitment Stages (Comma Separated)</label>
            <input
              type="text"
              value={stagesStr}
              onChange={(e) => setStagesStr(e.target.value)}
              placeholder="Registration, Online Test, Tech Interview 1, HR"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role Description & Special Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Team background, hiring overview, bonds or criteria..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : existingDrive ? 'Update Drive' : 'Create Recruitment Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
