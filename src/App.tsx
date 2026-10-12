import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  Student, 
  RecruitmentDrive, 
  PlacementApplication, 
  ClearanceCategory, 
  Department, 
  PlacementAnalytics, 
  NoDuesAnalytics 
} from './types/index.ts';
import { api } from './services/api.ts';
import { Header } from './components/Header.tsx';
import { PlacementDashboardView } from './components/PlacementDashboardView.tsx';
import { StudentsListView } from './components/StudentsListView.tsx';
import { DrivesListView } from './components/DrivesListView.tsx';
import { PlacementTrackingView } from './components/PlacementTrackingView.tsx';
import { NoDuesManagementView } from './components/NoDuesManagementView.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { StudentPortalView } from './components/StudentPortalView.tsx';
import { ImportStudentsModal } from './components/ImportStudentsModal.tsx';
import { AddStudentModal } from './components/AddStudentModal.tsx';
import { CreateDriveModal } from './components/CreateDriveModal.tsx';
import { DriveDetailDrawer } from './components/DriveDetailDrawer.tsx';
import { StudentClearanceDrawer } from './components/StudentClearanceDrawer.tsx';
import { NoDuesCertificateModal } from './components/NoDuesCertificateModal.tsx';

type AdminTab = 'analytics' | 'students' | 'drives' | 'tracking' | 'nodues' | 'reports';

const DEPARTMENTS: Department[] = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering'
];

export default function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<'admin' | 'student'>('admin');
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('analytics');
  
  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [drives, setDrives] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [categories, setCategories] = useState<ClearanceCategory[]>([]);
  const [placementAnalytics, setPlacementAnalytics] = useState<PlacementAnalytics | null>(null);
  const [noDuesAnalytics, setNoDuesAnalytics] = useState<NoDuesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active filters for analytics
  const [analyticsDept, setAnalyticsDept] = useState<string>('');
  const [analyticsBatch, setAnalyticsBatch] = useState<string>('');

  // Selected student for student portal view
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Modal / Drawer States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isCreateDriveModalOpen, setIsCreateDriveModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState<RecruitmentDrive | null>(null);
  const [selectedDriveForDetail, setSelectedDriveForDetail] = useState<RecruitmentDrive | null>(null);

  const [clearanceStudent, setClearanceStudent] = useState<Student | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);

  // Load all initial data from REST backend
  const loadData = useCallback(async () => {
    try {
      const [
        studentsRes,
        drivesRes,
        appsRes,
        catsRes,
        placementAnRes,
        noDuesAnRes
      ] = await Promise.all([
        api.getStudents(),
        api.getDrives(),
        api.getApplications(),
        api.getCategories(),
        api.getPlacementAnalytics({ department: analyticsDept, batch: analyticsBatch }),
        api.getNoDuesAnalytics({ department: analyticsDept, batch: analyticsBatch })
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data);
        // Sync selected student if currently selected
        setSelectedStudent(prev => {
          if (!prev && studentsRes.data.length > 0) return studentsRes.data[0];
          if (prev) {
            const found = studentsRes.data.find(s => s.id === prev.id);
            return found || studentsRes.data[0];
          }
          return null;
        });
      }

      if (drivesRes.success) setDrives(drivesRes.data);
      if (appsRes.success) setApplications(appsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
      if (placementAnRes.success) setPlacementAnalytics(placementAnRes.data);
      if (noDuesAnRes.success) setNoDuesAnalytics(noDuesAnRes.data);

      setErrorMsg(null);
    } catch (err: any) {
      console.error('Data load error:', err);
      setErrorMsg('Failed to connect to backend server. Make sure the API is responsive.');
    } finally {
      setLoading(false);
    }
  }, [analyticsDept, analyticsBatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetData = async () => {
    if (!window.confirm('Reset database back to standard sample seed data? All custom additions will be replaced.')) {
      return;
    }
    setIsResetting(true);
    try {
      await api.resetData();
      await loadData();
    } catch (err: any) {
      alert('Reset failed: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const batches = ['2025', '2026', '2024'];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Universal Top Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        students={students}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification if backend connection issues */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-rose-600 text-white rounded font-medium hover:bg-rose-700"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* ADMIN VIEW: PLACEMENT IN-CHARGE */}
        {currentRole === 'admin' ? (
          <div className="space-y-6">
            {/* Admin Section Tabs Navigation */}
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setActiveAdminTab('analytics')}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeAdminTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Placement Analytics</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('students')}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeAdminTab === 'students'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Student Directory & Import</span>
                <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded-full">
                  {students.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('drives')}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeAdminTab === 'drives'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Recruitment Drives</span>
                <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded-full">
                  {drives.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('tracking')}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeAdminTab === 'tracking'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Placement Tracking</span>
                <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded-full">
                  {applications.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('nodues')}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeAdminTab === 'nodues'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Department No-Dues</span>
                {noDuesAnalytics && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                    {noDuesAnalytics.fullyClearedStudents}/{noDuesAnalytics.totalStudents}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('reports')}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeAdminTab === 'reports'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Statements & Exports</span>
              </button>
            </div>

            {/* Admin Active Tab Content */}
            {activeAdminTab === 'analytics' && (
              <PlacementDashboardView
                analytics={placementAnalytics}
                selectedDept={analyticsDept}
                setSelectedDept={setAnalyticsDept}
                selectedBatch={analyticsBatch}
                setSelectedBatch={setAnalyticsBatch}
                departments={DEPARTMENTS}
                batches={batches}
              />
            )}

            {activeAdminTab === 'students' && (
              <StudentsListView
                students={students}
                departments={DEPARTMENTS}
                batches={batches}
                onOpenAddModal={(st) => {
                  setEditingStudent(st || null);
                  setIsAddStudentModalOpen(true);
                }}
                onOpenImportModal={() => setIsImportModalOpen(true)}
                onOpenClearanceDrawer={(st) => setClearanceStudent(st)}
                onRefresh={loadData}
              />
            )}

            {activeAdminTab === 'drives' && (
              <DrivesListView
                drives={drives}
                onOpenCreateDriveModal={(drv) => {
                  setEditingDrive(drv || null);
                  setIsCreateDriveModalOpen(true);
                }}
                onOpenDriveDetail={(drv) => setSelectedDriveDriveModal(drv)}
                onRefresh={loadData}
              />
            )}

            {activeAdminTab === 'tracking' && (
              <PlacementTrackingView
                applications={applications}
                drives={drives}
                students={students}
                onRefresh={loadData}
              />
            )}

            {activeAdminTab === 'nodues' && (
              <NoDuesManagementView
                students={students}
                categories={categories}
                analytics={noDuesAnalytics}
                departments={DEPARTMENTS}
                batches={batches}
                onOpenClearanceDrawer={(st) => setClearanceStudent(st)}
                onOpenCertificate={(st) => setCertificateStudent(st)}
                onRefresh={loadData}
              />
            )}

            {activeAdminTab === 'reports' && (
              <ReportsView
                students={students}
                drives={drives}
                applications={applications}
                departments={DEPARTMENTS}
                batches={batches}
              />
            )}
          </div>
        ) : (
          /* STUDENT VIEW: PERSONAL DASHBOARD */
          <StudentPortalView
            student={selectedStudent}
            applications={applications}
            categories={categories}
            onOpenCertificate={(st) => setCertificateStudent(st)}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ImportStudentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        existingStudent={editingStudent}
        onClose={() => {
          setIsAddStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSuccess={() => {
          loadData();
        }}
      />

      <CreateDriveModal
        isOpen={isCreateDriveModalOpen}
        existingDrive={editingDrive}
        onClose={() => {
          setIsCreateDriveModalOpen(false);
          setEditingDrive(null);
        }}
        onSuccess={() => {
          loadData();
        }}
      />

      <DriveDetailDrawer
        drive={selectedDriveForDetail}
        isOpen={Boolean(selectedDriveForDetail)}
        onClose={() => setSelectedDriveForDetail(null)}
        applications={applications}
        allStudents={students}
        onRefresh={loadData}
      />

      <StudentClearanceDrawer
        student={clearanceStudent}
        isOpen={Boolean(clearanceStudent)}
        onClose={() => setClearanceStudent(null)}
        categories={categories}
        onRefresh={loadData}
        onOpenCertificate={(st) => {
          setClearanceStudent(null);
          setCertificateStudent(st);
        }}
      />

      <NoDuesCertificateModal
        student={certificateStudent}
        isOpen={Boolean(certificateStudent)}
        onClose={() => setCertificateStudent(null)}
        categories={categories}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <span>
            Apex Institute of Technology • Training & Placement Cell and Dean of Academic Affairs
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Node / Express Backend Active • Port 3000
          </span>
        </div>
      </footer>
    </div>
  );

  function setSelectedDriveDriveModal(drv: RecruitmentDrive) {
    setSelectedDriveForDetail(drv);
  }
}
