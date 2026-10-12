import { 
  Student, 
  RecruitmentDrive, 
  PlacementApplication, 
  ClearanceCategory, 
  PlacementAnalytics, 
  NoDuesAnalytics,
  ClearanceStatus,
  ApplicationStage
} from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // Students
  async getStudents(filters?: {
    department?: string;
    batch?: string;
    year?: number;
    registrationStatus?: string;
    search?: string;
  }): Promise<{ success: boolean; data: Student[]; count: number }> {
    const params = new URLSearchParams();
    if (filters?.department) params.set('department', filters.department);
    if (filters?.batch) params.set('batch', filters.batch);
    if (filters?.year) params.set('year', filters.year.toString());
    if (filters?.registrationStatus) params.set('registrationStatus', filters.registrationStatus);
    if (filters?.search) params.set('search', filters.search);

    const res = await fetch(`${API_BASE}/students?${params.toString()}`);
    return res.json();
  },

  async getStudent(id: string): Promise<{ success: boolean; data: Student }> {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(id)}`);
    return res.json();
  },

  async createStudent(student: Partial<Student>): Promise<{ success: boolean; data?: Student; error?: string }> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return res.json();
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<{ success: boolean; data?: Student; error?: string }> {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteStudent(id: string): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async importStudents(rows: any[], previewOnly = false): Promise<{
    success: boolean;
    preview?: boolean;
    summary?: any;
    results?: any[];
    importedStudents?: Student[];
    skippedRows?: any[];
    error?: string;
  }> {
    const res = await fetch(`${API_BASE}/students/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows, previewOnly })
    });
    return res.json();
  },

  // Drives
  async getDrives(): Promise<{ success: boolean; data: (RecruitmentDrive & { totalApplicants?: number; selectedCount?: number; offersCount?: number; stageCounts?: Record<string, number> })[] }> {
    const res = await fetch(`${API_BASE}/drives`);
    return res.json();
  },

  async getDrive(id: string): Promise<{ success: boolean; data: RecruitmentDrive & { applicants?: any[] } }> {
    const res = await fetch(`${API_BASE}/drives/${encodeURIComponent(id)}`);
    return res.json();
  },

  async createDrive(drive: Partial<RecruitmentDrive>): Promise<{ success: boolean; data?: RecruitmentDrive; error?: string }> {
    const res = await fetch(`${API_BASE}/drives`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drive)
    });
    return res.json();
  },

  async updateDrive(id: string, updates: Partial<RecruitmentDrive>): Promise<{ success: boolean; data?: RecruitmentDrive; error?: string }> {
    const res = await fetch(`${API_BASE}/drives/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteDrive(id: string): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`${API_BASE}/drives/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Applications
  async getApplications(filters?: {
    driveId?: string;
    studentId?: string;
    stage?: string;
  }): Promise<{ success: boolean; data: (PlacementApplication & { studentName?: string; rollNumber?: string; department?: string; cgpa?: number; studentEmail?: string })[] }> {
    const params = new URLSearchParams();
    if (filters?.driveId) params.set('driveId', filters.driveId);
    if (filters?.studentId) params.set('studentId', filters.studentId);
    if (filters?.stage) params.set('stage', filters.stage);

    const res = await fetch(`${API_BASE}/applications?${params.toString()}`);
    return res.json();
  },

  async createApplication(data: {
    studentId: string;
    driveId: string;
    currentStage?: ApplicationStage;
    packageOfferedLPA?: number;
  }): Promise<{ success: boolean; data?: PlacementApplication; error?: string }> {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateApplicationStage(id: string, data: {
    stage: ApplicationStage;
    notes?: string;
    packageOfferedLPA?: number;
    offerLetterRef?: string;
    isOfferAccepted?: boolean;
  }): Promise<{ success: boolean; data?: PlacementApplication; error?: string }> {
    const res = await fetch(`${API_BASE}/applications/${encodeURIComponent(id)}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteApplication(id: string): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`${API_BASE}/applications/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // No-Dues Categories & Updates
  async getCategories(): Promise<{ success: boolean; data: ClearanceCategory[] }> {
    const res = await fetch(`${API_BASE}/nodues/categories`);
    return res.json();
  },

  async createCategory(cat: Partial<ClearanceCategory>): Promise<{ success: boolean; data?: ClearanceCategory; error?: string }> {
    const res = await fetch(`${API_BASE}/nodues/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    return res.json();
  },

  async updateCategory(id: string, updates: Partial<ClearanceCategory>): Promise<{ success: boolean; data?: ClearanceCategory; error?: string }> {
    const res = await fetch(`${API_BASE}/nodues/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`${API_BASE}/nodues/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async updateStudentClearance(studentId: string, categoryId: string, data: {
    status: ClearanceStatus;
    remarks?: string;
    pendingRequirements?: string;
    updatedBy?: string;
  }): Promise<{ success: boolean; overallNoDuesCleared?: boolean; student?: Student; error?: string }> {
    const res = await fetch(`${API_BASE}/nodues/students/${encodeURIComponent(studentId)}/categories/${encodeURIComponent(categoryId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async bulkUpdateClearance(data: {
    studentIds: string[];
    categoryId: string;
    status: ClearanceStatus;
    remarks?: string;
    updatedBy?: string;
  }): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
    const res = await fetch(`${API_BASE}/nodues/bulk-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Analytics
  async getPlacementAnalytics(filters?: { department?: string; batch?: string }): Promise<{ success: boolean; data: PlacementAnalytics }> {
    const params = new URLSearchParams();
    if (filters?.department) params.set('department', filters.department);
    if (filters?.batch) params.set('batch', filters.batch);

    const res = await fetch(`${API_BASE}/analytics/placement?${params.toString()}`);
    return res.json();
  },

  async getNoDuesAnalytics(filters?: { department?: string; batch?: string }): Promise<{ success: boolean; data: NoDuesAnalytics }> {
    const params = new URLSearchParams();
    if (filters?.department) params.set('department', filters.department);
    if (filters?.batch) params.set('batch', filters.batch);

    const res = await fetch(`${API_BASE}/analytics/nodues?${params.toString()}`);
    return res.json();
  },

  async resetData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/analytics/reset`, { method: 'POST' });
    return res.json();
  }
};
