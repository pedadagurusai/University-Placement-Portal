export type Department = 'Computer Science & Engineering' | 'Electronics & Communication Engineering' | 'Mechanical Engineering' | 'Information Technology' | 'Civil Engineering';

export type DriveStatus = 'Planned' | 'Open' | 'In Progress' | 'Completed' | 'Cancelled';

export type ApplicationStage = 
  | 'Registered'
  | 'Eligibility Verified'
  | 'Shortlisted'
  | 'Assessment Completed'
  | 'Interview in Progress'
  | 'Selected'
  | 'Offer Received'
  | 'Joined'
  | 'Rejected'
  | 'Withdrawn';

export type ClearanceStatus = 'Pending' | 'Cleared' | 'Not Applicable' | 'Rejected / Further Action Required';

export interface ClearanceCategory {
  id: string;
  name: string;
  code: string;
  departmentOrAuthority: string;
  isMandatory: boolean;
  description: string;
}

export interface StudentClearanceItem {
  categoryId: string;
  categoryName: string;
  status: ClearanceStatus;
  remarks?: string;
  pendingRequirements?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  department: Department;
  program: string;
  year: number; // 1, 2, 3, 4
  section: string; // A, B, C
  graduationBatch: string; // e.g. "2025" or "2026"
  email: string;
  cgpa: number;
  backlogs: number;
  placementRegistered: boolean;
  eligibleForPlacement: boolean;
  skills: string[];
  createdAt: string;
  noDuesChecklist: StudentClearanceItem[];
  overallNoDuesCleared: boolean;
}

export interface RecruitmentDrive {
  id: string;
  companyName: string;
  jobRole: string;
  eligibleDepartments: Department[];
  eligibleBatches: string[];
  minCgpa: number;
  maxBacklogs: number;
  requiredSkills: string[];
  registrationDeadline: string;
  driveDate: string;
  recruitmentStages: string[];
  jobLocation: string;
  packageLPA: number; // in Lakhs Per Annum (CTC)
  status: DriveStatus;
  description?: string;
}

export interface PlacementApplication {
  id: string;
  studentId: string;
  driveId: string;
  companyName: string;
  jobRole: string;
  currentStage: ApplicationStage;
  appliedDate: string;
  stageHistory: {
    stage: ApplicationStage;
    updatedAt: string;
    notes?: string;
  }[];
  packageOfferedLPA?: number;
  offerDate?: string;
  offerLetterRef?: string;
  isOfferAccepted?: boolean;
}

export interface PlacementAnalytics {
  totalRegistered: number;
  totalEligible: number;
  participatingStudents: number;
  uniqueStudentsPlaced: number;
  totalOffers: number;
  unplacedStudents: number;
  overallPlacementPercentage: number;
  highestPackageLPA: number;
  averagePackageLPA: number;
  departmentStats: {
    department: Department;
    totalRegistered: number;
    eligibleStudents: number;
    uniquePlaced: number;
    totalOffers: number;
    unplaced: number;
    placementPercentage: number;
    avgPackageLPA: number;
    highestPackageLPA: number;
  }[];
  companyStats: {
    driveId: string;
    companyName: string;
    jobRole: string;
    applicantsCount: number;
    shortlistedCount: number;
    selectedCount: number;
    offersCount: number;
    packageLPA: number;
  }[];
  batchTrends: {
    batch: string;
    uniquePlaced: number;
    totalOffers: number;
    placementPercentage: number;
  }[];
}

export interface NoDuesAnalytics {
  totalStudents: number;
  fullyClearedStudents: number;
  pendingClearances: number;
  rejectedRequests: number;
  clearanceRate: number;
  departmentClearance: {
    department: Department;
    total: number;
    cleared: number;
    pending: number;
    rejected: number;
    clearedPercentage: number;
  }[];
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    clearedCount: number;
    pendingCount: number;
    rejectedCount: number;
  }[];
}
