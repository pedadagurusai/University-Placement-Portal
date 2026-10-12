import fs from 'fs';
import path from 'path';
import { 
  Student, 
  RecruitmentDrive, 
  PlacementApplication, 
  ClearanceCategory, 
  ClearanceStatus, 
  Department, 
  PlacementAnalytics, 
  NoDuesAnalytics,
  StudentClearanceItem
} from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

export const INITIAL_CATEGORIES: ClearanceCategory[] = [
  {
    id: 'cat-lib',
    name: 'Central University Library',
    code: 'LIB-01',
    departmentOrAuthority: 'Chief Librarian Office',
    isMandatory: true,
    description: 'Return all borrowed books, journals, research volumes, and settle library fines.'
  },
  {
    id: 'cat-lab',
    name: 'Department Laboratory & Equipment',
    code: 'LAB-02',
    departmentOrAuthority: 'Head of Department / Lab In-Charge',
    isMandatory: true,
    description: 'Return assigned lab kits, microcontrollers, test bench tools, and project components.'
  },
  {
    id: 'cat-dept',
    name: 'Academic Department Clearance',
    code: 'DEP-03',
    departmentOrAuthority: 'Department HOD Office',
    isMandatory: true,
    description: 'Submission of final project report, mentor clearance, and academic logbooks.'
  },
  {
    id: 'cat-place',
    name: 'Placement & Career Cell',
    code: 'PLC-04',
    departmentOrAuthority: 'Training & Placement Officer (TPO)',
    isMandatory: true,
    description: 'Verification of job offer letters, higher education documents, or placement exit survey.'
  },
  {
    id: 'cat-acc',
    name: 'Finance & Accounts Section',
    code: 'ACC-05',
    departmentOrAuthority: 'Chief Accounts Officer',
    isMandatory: true,
    description: 'Clearance of all tuition fees, examination dues, laboratory cautions, and hostel dues.'
  },
  {
    id: 'cat-hostel',
    name: 'University Hostel & Mess',
    code: 'HST-06',
    departmentOrAuthority: 'Chief Warden Office',
    isMandatory: false,
    description: 'Room handover, mess bill settlement, and key return (Day scholars marked Not Applicable).'
  },
  {
    id: 'cat-sports',
    name: 'Physical Education & Sports Dept',
    code: 'SPT-07',
    departmentOrAuthority: 'Director of Physical Education',
    isMandatory: false,
    description: 'Return of university sports equipment, gym locker keys, and athletic jerseys.'
  }
];

export const INITIAL_DRIVES: RecruitmentDrive[] = [
  {
    id: 'drv-google',
    companyName: 'Google',
    jobRole: 'Software Development Engineer I (Cloud Platforms)',
    eligibleDepartments: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
    eligibleBatches: ['2025', '2026'],
    minCgpa: 8.5,
    maxBacklogs: 0,
    requiredSkills: ['Algorithms', 'Distributed Systems', 'C++', 'Go', 'Python'],
    registrationDeadline: '2025-02-15',
    driveDate: '2025-02-28',
    recruitmentStages: ['Registration', 'Online Coding Assessment', 'Technical Interview 1', 'Technical Interview 2', 'System Design & Googliness', 'Offer Rollout'],
    jobLocation: 'Bengaluru / Hyderabad (Hybrid)',
    packageLPA: 32.5,
    status: 'Completed',
    description: 'Tier-1 Engineering hiring for Google Cloud and Core Systems Infrastructure teams.'
  },
  {
    id: 'drv-msft',
    companyName: 'Microsoft Corporation',
    jobRole: 'Software Engineer (Azure Core & Developer Division)',
    eligibleDepartments: ['Computer Science & Engineering', 'Electronics & Communication Engineering', 'Information Technology'],
    eligibleBatches: ['2025', '2026'],
    minCgpa: 8.0,
    maxBacklogs: 0,
    requiredSkills: ['Data Structures', 'C# / Java', 'Azure Fundamentals', 'Operating Systems'],
    registrationDeadline: '2025-03-05',
    driveDate: '2025-03-20',
    recruitmentStages: ['Registration', 'Online Test', 'Technical Round 1', 'Technical Round 2', 'AA Round', 'Offer Finalization'],
    jobLocation: 'Hyderabad / Noida',
    packageLPA: 28.0,
    status: 'Completed',
    description: 'Hiring for Azure Compute, Developer Division, and Microsoft 365 core teams.'
  },
  {
    id: 'drv-amazon',
    companyName: 'Amazon AWS',
    jobRole: 'Cloud Support Associate & Solutions Engineer',
    eligibleDepartments: ['Computer Science & Engineering', 'Electronics & Communication Engineering', 'Information Technology', 'Mechanical Engineering'],
    eligibleBatches: ['2025'],
    minCgpa: 7.5,
    maxBacklogs: 1,
    requiredSkills: ['Linux', 'Networking', 'Cloud Architecture', 'Python / Bash scripting'],
    registrationDeadline: '2025-03-10',
    driveDate: '2025-03-25',
    recruitmentStages: ['Registration', 'Online Aptitude & Code', 'Technical Discussion', 'Leadership Principles Interview', 'Managerial Round'],
    jobLocation: 'Bengaluru / Pune',
    packageLPA: 19.5,
    status: 'In Progress',
    description: 'Cloud Infrastructure and Enterprise customer architecture support role.'
  },
  {
    id: 'drv-lt',
    companyName: 'Larsen & Toubro Ltd. (L&T)',
    jobRole: 'Graduate Engineer Trainee (Robotics & Mechatronics)',
    eligibleDepartments: ['Mechanical Engineering', 'Electronics & Communication Engineering'],
    eligibleBatches: ['2025', '2026'],
    minCgpa: 7.0,
    maxBacklogs: 0,
    requiredSkills: ['CAD/CAM', 'Thermodynamics', 'Mechatronics', 'Embedded C', 'SolidWorks'],
    registrationDeadline: '2025-04-01',
    driveDate: '2025-04-15',
    recruitmentStages: ['Registration', 'Domain Technical Test', 'Group Discussion', 'Technical Interview', 'HR Interview'],
    jobLocation: 'Mumbai / Vadodara / Chennai',
    packageLPA: 9.8,
    status: 'In Progress',
    description: 'Core engineering hiring for Heavy Civil Infrastructure, Smart World, and Defense automation.'
  },
  {
    id: 'drv-tcs',
    companyName: 'Tata Consultancy Services (TCS Digital)',
    jobRole: 'Digital Systems Engineer & Full Stack Analyst',
    eligibleDepartments: ['Computer Science & Engineering', 'Electronics & Communication Engineering', 'Mechanical Engineering', 'Information Technology'],
    eligibleBatches: ['2025', '2026'],
    minCgpa: 6.5,
    maxBacklogs: 1,
    requiredSkills: ['Java', 'SQL', 'Web Technologies', 'Problem Solving'],
    registrationDeadline: '2025-04-10',
    driveDate: '2025-04-22',
    recruitmentStages: ['Registration', 'National Qualifier Test (NQT)', 'Technical Interview', 'Management Interview', 'HR'],
    jobLocation: 'Pan-India',
    packageLPA: 7.5,
    status: 'Open',
    description: 'Premier digital hiring track with accelerated learning and global tech delivery.'
  },
  {
    id: 'drv-qualcomm',
    companyName: 'Qualcomm',
    jobRole: 'Hardware & Silicon Design Trainee',
    eligibleDepartments: ['Electronics & Communication Engineering'],
    eligibleBatches: ['2025'],
    minCgpa: 8.0,
    maxBacklogs: 0,
    requiredSkills: ['VLSI', 'Verilog/VHDL', 'Digital Electronics', 'Signal Processing'],
    registrationDeadline: '2025-05-01',
    driveDate: '2025-05-18',
    recruitmentStages: ['Registration', 'Hardware Assessment', 'Technical Deep-dive', 'Architecture Review'],
    jobLocation: 'Bengaluru / Hyderabad',
    packageLPA: 22.0,
    status: 'Planned',
    description: 'High performance SOC design, 5G modem silicon engineering.'
  }
];

// Helper to calculate if student is fully cleared
export function computeStudentNoDuesStatus(checklist: StudentClearanceItem[], categories: ClearanceCategory[]): boolean {
  for (const cat of categories) {
    if (cat.isMandatory) {
      const item = checklist.find(c => c.categoryId === cat.id);
      if (!item) return false;
      // Mandatory must be 'Cleared' or 'Not Applicable'
      if (item.status !== 'Cleared' && item.status !== 'Not Applicable') {
        return false;
      }
    }
  }
  return true;
}

// Generate 32 realistic initial students across CSE, ECE, ME
export function generateInitialStudents(categories: ClearanceCategory[]): Student[] {
  const depts: { dept: Department; code: string; count: number }[] = [
    { dept: 'Computer Science & Engineering', code: 'CS', count: 14 },
    { dept: 'Electronics & Communication Engineering', code: 'EC', count: 10 },
    { dept: 'Mechanical Engineering', code: 'ME', count: 8 }
  ];

  const firstNames = [
    'Rahul', 'Ananya', 'Aditya', 'Sneha', 'Vikram', 'Pooja', 'Rohan', 'Kavya', 
    'Arjun', 'Divya', 'Siddharth', 'Meera', 'Karthik', 'Nisha', 'Aman', 'Priya',
    'Rishi', 'Ishita', 'Gaurav', 'Tanvi', 'Abhishek', 'Swati', 'Varun', 'Pallavi',
    'Manish', 'Shreya', 'Deepak', 'Anjali', 'Kunal', 'Rhea', 'Pranav', 'Sanjana'
  ];

  const lastNames = [
    'Sharma', 'Iyer', 'Verma', 'Patel', 'Nair', 'Reddy', 'Gupta', 'Sen',
    'Kulkarni', 'Joshi', 'Menon', 'Bose', 'Chopra', 'Mukherjee', 'Mehta', 'Rao'
  ];

  const students: Student[] = [];
  let nameIndex = 0;

  for (const d of depts) {
    for (let i = 1; i <= d.count; i++) {
      const rollNumber = `21${d.code}${i.toString().padStart(3, '0')}`;
      const firstName = firstNames[nameIndex % firstNames.length];
      const lastName = lastNames[(nameIndex * 3 + i) % lastNames.length];
      const name = `${firstName} ${lastName}`;
      nameIndex++;

      // Distribute CGPA realistically
      const cgpa = Number((6.8 + ((i * 13) % 31) * 0.1).toFixed(2));
      const backlogs = i % 7 === 0 ? 1 : 0;
      const placementRegistered = i !== 12; // 1 student unregistered
      const eligibleForPlacement = placementRegistered && cgpa >= 7.0 && backlogs === 0;

      // Create no-dues checklist with varied statuses
      const checklist: StudentClearanceItem[] = categories.map(cat => {
        let status: ClearanceStatus = 'Cleared';
        let remarks = 'Verified and approved by departmental authority.';
        let pendingRequirements = '';

        if (cat.id === 'cat-hostel') {
          // Some are day scholars
          if (i % 3 === 0) {
            status = 'Not Applicable';
            remarks = 'Day scholar verified via Dean of Student Welfare records.';
          } else if (i % 5 === 0) {
            status = 'Pending';
            remarks = 'Room clearance pending.';
            pendingRequirements = 'Hostel Room 314 key return & Mess dues ₹1,200';
          }
        } else if (cat.id === 'cat-lib') {
          if (i === 3 || i === 8 || i === 15) {
            status = 'Pending';
            remarks = 'Books overdue.';
            pendingRequirements = 'Return: Modern Operating Systems (Tanenbaum) & Late fine ₹180.';
          } else if (i === 19) {
            status = 'Rejected / Further Action Required';
            remarks = 'Reported lost book.';
            pendingRequirements = 'Replacement book or double replacement value compensation required.';
          }
        } else if (cat.id === 'cat-lab') {
          if (i === 5 || i === 11) {
            status = 'Pending';
            remarks = 'Hardware components pending.';
            pendingRequirements = 'Return Raspberry Pi 4 kit & FPGA breadboard to Digital Electronics Lab.';
          }
        } else if (cat.id === 'cat-acc') {
          if (i === 4 || i === 14) {
            status = 'Rejected / Further Action Required';
            remarks = 'Tuition fee balance.';
            pendingRequirements = '8th Semester tuition fee pending: ₹14,250.';
          }
        }

        return {
          categoryId: cat.id,
          categoryName: cat.name,
          status,
          remarks,
          pendingRequirements: pendingRequirements || undefined,
          updatedAt: '2025-05-10T10:00:00.000Z',
          updatedBy: cat.departmentOrAuthority
        };
      });

      const overallNoDuesCleared = computeStudentNoDuesStatus(checklist, categories);

      students.push({
        id: `std-${rollNumber.toLowerCase()}`,
        rollNumber,
        name,
        department: d.dept,
        program: 'B.Tech',
        year: 4,
        section: i % 2 === 0 ? 'B' : 'A',
        graduationBatch: '2025',
        email: `${firstName.toLowerCase()}.${rollNumber.toLowerCase()}@university.edu`,
        cgpa,
        backlogs,
        placementRegistered,
        eligibleForPlacement,
        skills: d.dept.includes('Computer') 
          ? ['React', 'TypeScript', 'Data Structures', 'Python', 'AWS']
          : d.dept.includes('Electronics')
          ? ['Embedded C', 'VLSI', 'Verilog', 'MATLAB', 'IoT']
          : ['SolidWorks', 'ANSYS', 'AutoCAD', 'Robotics', 'Thermodynamics'],
        createdAt: '2025-01-15T09:30:00.000Z',
        noDuesChecklist: checklist,
        overallNoDuesCleared
      });
    }
  }

  return students;
}

export function generateInitialApplications(students: Student[], drives: RecruitmentDrive[]): PlacementApplication[] {
  const apps: PlacementApplication[] = [];

  // Helper to find student by roll
  const findStd = (roll: string) => students.find(s => s.rollNumber === roll);
  const findDrive = (id: string) => drives.find(d => d.id === id);

  // Rahul Sharma (21CS001): MULTIPLE OFFERS (Google 32.5 LPA & Microsoft 28 LPA)
  const std1 = findStd('21CS001');
  const dGoogle = findDrive('drv-google');
  const dMsft = findDrive('drv-msft');

  if (std1 && dGoogle) {
    apps.push({
      id: 'app-001',
      studentId: std1.id,
      driveId: dGoogle.id,
      companyName: dGoogle.companyName,
      jobRole: dGoogle.jobRole,
      currentStage: 'Offer Received',
      appliedDate: '2025-02-16',
      packageOfferedLPA: 32.5,
      offerDate: '2025-03-01',
      offerLetterRef: 'GGL-2025-IND-8841',
      isOfferAccepted: true,
      stageHistory: [
        { stage: 'Registered', updatedAt: '2025-02-16' },
        { stage: 'Eligibility Verified', updatedAt: '2025-02-18' },
        { stage: 'Shortlisted', updatedAt: '2025-02-20' },
        { stage: 'Assessment Completed', updatedAt: '2025-02-22' },
        { stage: 'Interview in Progress', updatedAt: '2025-02-25' },
        { stage: 'Selected', updatedAt: '2025-02-28' },
        { stage: 'Offer Received', updatedAt: '2025-03-01', notes: 'Offer rolled out: 32.5 LPA' }
      ]
    });
  }

  if (std1 && dMsft) {
    apps.push({
      id: 'app-002',
      studentId: std1.id,
      driveId: dMsft.id,
      companyName: dMsft.companyName,
      jobRole: dMsft.jobRole,
      currentStage: 'Offer Received',
      appliedDate: '2025-03-06',
      packageOfferedLPA: 28.0,
      offerDate: '2025-03-22',
      offerLetterRef: 'MSFT-IND-FY25-3921',
      isOfferAccepted: false,
      stageHistory: [
        { stage: 'Registered', updatedAt: '2025-03-06' },
        { stage: 'Eligibility Verified', updatedAt: '2025-03-08' },
        { stage: 'Shortlisted', updatedAt: '2025-03-12' },
        { stage: 'Assessment Completed', updatedAt: '2025-03-15' },
        { stage: 'Interview in Progress', updatedAt: '2025-03-18' },
        { stage: 'Selected', updatedAt: '2025-03-21' },
        { stage: 'Offer Received', updatedAt: '2025-03-22', notes: 'Second offer rolled out: 28 LPA' }
      ]
    });
  }

  // Ananya Iyer (21EC001): MULTIPLE OFFERS (Amazon 19.5 LPA & TCS Digital 7.5 LPA)
  const std2 = findStd('21EC001');
  const dAmazon = findDrive('drv-amazon');
  const dTcs = findDrive('drv-tcs');

  if (std2 && dAmazon) {
    apps.push({
      id: 'app-003',
      studentId: std2.id,
      driveId: dAmazon.id,
      companyName: dAmazon.companyName,
      jobRole: dAmazon.jobRole,
      currentStage: 'Offer Received',
      appliedDate: '2025-03-11',
      packageOfferedLPA: 19.5,
      offerDate: '2025-03-27',
      offerLetterRef: 'AMZN-AWS-SDE-1049',
      isOfferAccepted: true,
      stageHistory: [
        { stage: 'Registered', updatedAt: '2025-03-11' },
        { stage: 'Eligibility Verified', updatedAt: '2025-03-14' },
        { stage: 'Shortlisted', updatedAt: '2025-03-18' },
        { stage: 'Assessment Completed', updatedAt: '2025-03-21' },
        { stage: 'Interview in Progress', updatedAt: '2025-03-24' },
        { stage: 'Selected', updatedAt: '2025-03-26' },
        { stage: 'Offer Received', updatedAt: '2025-03-27' }
      ]
    });
  }

  if (std2 && dTcs) {
    apps.push({
      id: 'app-004',
      studentId: std2.id,
      driveId: dTcs.id,
      companyName: dTcs.companyName,
      jobRole: dTcs.jobRole,
      currentStage: 'Offer Received',
      appliedDate: '2025-04-11',
      packageOfferedLPA: 7.5,
      offerDate: '2025-04-25',
      offerLetterRef: 'TCS-DIG-2025-901',
      isOfferAccepted: false,
      stageHistory: [
        { stage: 'Registered', updatedAt: '2025-04-11' },
        { stage: 'Eligibility Verified', updatedAt: '2025-04-15' },
        { stage: 'Shortlisted', updatedAt: '2025-04-18' },
        { stage: 'Selected', updatedAt: '2025-04-23' },
        { stage: 'Offer Received', updatedAt: '2025-04-25' }
      ]
    });
  }

  // Aditya Verma (21CS002): Microsoft Joined
  const std3 = findStd('21CS002');
  if (std3 && dMsft) {
    apps.push({
      id: 'app-005',
      studentId: std3.id,
      driveId: dMsft.id,
      companyName: dMsft.companyName,
      jobRole: dMsft.jobRole,
      currentStage: 'Joined',
      appliedDate: '2025-03-06',
      packageOfferedLPA: 28.0,
      offerDate: '2025-03-22',
      offerLetterRef: 'MSFT-IND-FY25-3922',
      isOfferAccepted: true,
      stageHistory: [
        { stage: 'Registered', updatedAt: '2025-03-06' },
        { stage: 'Selected', updatedAt: '2025-03-21' },
        { stage: 'Offer Received', updatedAt: '2025-03-22' },
        { stage: 'Joined', updatedAt: '2025-05-01' }
      ]
    });
  }

  // Sneha Patel (21CS003): Google Selected
  const std4 = findStd('21CS003');
  if (std4 && dGoogle) {
    apps.push({
      id: 'app-006',
      studentId: std4.id,
      driveId: dGoogle.id,
      companyName: dGoogle.companyName,
      jobRole: dGoogle.jobRole,
      currentStage: 'Selected',
      appliedDate: '2025-02-16',
      packageOfferedLPA: 32.5,
      stageHistory: [
        { stage: 'Registered', updatedAt: '2025-02-16' },
        { stage: 'Assessment Completed', updatedAt: '2025-02-22' },
        { stage: 'Selected', updatedAt: '2025-02-28' }
      ]
    });
  }

  // Vikram Nair (21ME001): L&T Offer Received
  const std5 = findStd('21ME001');
  const dLt = findDrive('drv-lt');
  if (std5 && dLt) {
    apps.push({
      id: 'app-007',
      studentId: std5.id,
      driveId: dLt.id,
      companyName: dLt.companyName,
      jobRole: dLt.jobRole,
      currentStage: 'Offer Received',
      appliedDate: '2025-04-02',
      packageOfferedLPA: 9.8,
      offerDate: '2025-04-18',
      offerLetterRef: 'LT-GET-2025-312',
      isOfferAccepted: true,
      stageHistory: [
        { stage: 'Registered', updatedAt: '2025-04-02' },
        { stage: 'Eligibility Verified', updatedAt: '2025-04-05' },
        { stage: 'Shortlisted', updatedAt: '2025-04-10' },
        { stage: 'Assessment Completed', updatedAt: '2025-04-12' },
        { stage: 'Interview in Progress', updatedAt: '2025-04-15' },
        { stage: 'Selected', updatedAt: '2025-04-16' },
        { stage: 'Offer Received', updatedAt: '2025-04-18' }
      ]
    });
  }

  // Rohan Gupta (21ME002): L&T Selected
  const std6 = findStd('21ME002');
  if (std6 && dLt) {
    apps.push({
      id: 'app-008',
      studentId: std6.id,
      driveId: dLt.id,
      companyName: dLt.companyName,
      jobRole: dLt.jobRole,
      currentStage: 'Selected',
      appliedDate: '2025-04-02',
      packageOfferedLPA: 9.8,
      stageHistory: [
        { stage: 'Registered', updatedAt: '2025-04-02' },
        { stage: 'Interview in Progress', updatedAt: '2025-04-15' },
        { stage: 'Selected', updatedAt: '2025-04-16' }
      ]
    });
  }

  // Additional applications in various stages
  let appCounter = 9;
  for (const s of students) {
    // Skip if already has primary apps
    if (['21CS001', '21EC001', '21CS002', '21CS003', '21ME001', '21ME002'].includes(s.rollNumber)) {
      continue;
    }

    if (!s.eligibleForPlacement) continue;

    // Distribute across drives
    if (s.department === 'Computer Science & Engineering') {
      if (s.cgpa >= 8.5 && dGoogle) {
        apps.push({
          id: `app-0${appCounter++}`,
          studentId: s.id,
          driveId: dGoogle.id,
          companyName: dGoogle.companyName,
          jobRole: dGoogle.jobRole,
          currentStage: 'Interview in Progress',
          appliedDate: '2025-02-16',
          stageHistory: [
            { stage: 'Registered', updatedAt: '2025-02-16' },
            { stage: 'Shortlisted', updatedAt: '2025-02-20' },
            { stage: 'Interview in Progress', updatedAt: '2025-02-25' }
          ]
        });
      }
      if (s.cgpa >= 7.5 && dMsft) {
        apps.push({
          id: `app-0${appCounter++}`,
          studentId: s.id,
          driveId: dMsft.id,
          companyName: dMsft.companyName,
          jobRole: dMsft.jobRole,
          currentStage: 'Assessment Completed',
          appliedDate: '2025-03-07',
          stageHistory: [
            { stage: 'Registered', updatedAt: '2025-03-07' },
            { stage: 'Shortlisted', updatedAt: '2025-03-12' },
            { stage: 'Assessment Completed', updatedAt: '2025-03-16' }
          ]
        });
      }
      if (dTcs) {
        apps.push({
          id: `app-0${appCounter++}`,
          studentId: s.id,
          driveId: dTcs.id,
          companyName: dTcs.companyName,
          jobRole: dTcs.jobRole,
          currentStage: 'Shortlisted',
          appliedDate: '2025-04-12',
          stageHistory: [
            { stage: 'Registered', updatedAt: '2025-04-12' },
            { stage: 'Shortlisted', updatedAt: '2025-04-16' }
          ]
        });
      }
    } else if (s.department === 'Electronics & Communication Engineering') {
      if (s.cgpa >= 7.8 && dAmazon) {
        apps.push({
          id: `app-0${appCounter++}`,
          studentId: s.id,
          driveId: dAmazon.id,
          companyName: dAmazon.companyName,
          jobRole: dAmazon.jobRole,
          currentStage: 'Offer Received',
          appliedDate: '2025-03-12',
          packageOfferedLPA: 19.5,
          offerDate: '2025-03-29',
          offerLetterRef: `AMZN-2025-${s.rollNumber}`,
          isOfferAccepted: true,
          stageHistory: [
            { stage: 'Registered', updatedAt: '2025-03-12' },
            { stage: 'Shortlisted', updatedAt: '2025-03-16' },
            { stage: 'Selected', updatedAt: '2025-03-24' },
            { stage: 'Offer Received', updatedAt: '2025-03-29' }
          ]
        });
      } else if (dLt) {
        apps.push({
          id: `app-0${appCounter++}`,
          studentId: s.id,
          driveId: dLt.id,
          companyName: dLt.companyName,
          jobRole: dLt.jobRole,
          currentStage: 'Rejected',
          appliedDate: '2025-04-03',
          stageHistory: [
            { stage: 'Registered', updatedAt: '2025-04-03' },
            { stage: 'Assessment Completed', updatedAt: '2025-04-12' },
            { stage: 'Rejected', updatedAt: '2025-04-14', notes: 'Did not clear hardware aptitude test cutoff' }
          ]
        });
      }
    } else if (s.department === 'Mechanical Engineering') {
      if (dLt && s.cgpa >= 7.2) {
        apps.push({
          id: `app-0${appCounter++}`,
          studentId: s.id,
          driveId: dLt.id,
          companyName: dLt.companyName,
          jobRole: dLt.jobRole,
          currentStage: 'Interview in Progress',
          appliedDate: '2025-04-02',
          stageHistory: [
            { stage: 'Registered', updatedAt: '2025-04-02' },
            { stage: 'Shortlisted', updatedAt: '2025-04-08' },
            { stage: 'Interview in Progress', updatedAt: '2025-04-15' }
          ]
        });
      } else if (dTcs) {
        apps.push({
          id: `app-0${appCounter++}`,
          studentId: s.id,
          driveId: dTcs.id,
          companyName: dTcs.companyName,
          jobRole: dTcs.jobRole,
          currentStage: 'Registered',
          appliedDate: '2025-04-11',
          stageHistory: [
            { stage: 'Registered', updatedAt: '2025-04-11' }
          ]
        });
      }
    }
  }

  return apps;
}

// In-Memory Database store with disk persistence
class Database {
  private categories: ClearanceCategory[] = [];
  private drives: RecruitmentDrive[] = [];
  private students: Student[] = [];
  private applications: PlacementApplication[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.categories = data.categories || INITIAL_CATEGORIES;
        this.drives = data.drives || INITIAL_DRIVES;
        this.students = data.students || [];
        this.applications = data.applications || [];
        if (this.students.length > 0) {
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to read db.json, falling back to seed data', err);
    }

    this.resetToDefaults();
  }

  public resetToDefaults() {
    this.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    this.drives = JSON.parse(JSON.stringify(INITIAL_DRIVES));
    this.students = generateInitialStudents(this.categories);
    this.applications = generateInitialApplications(this.students, this.drives);
    this.persist();
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify({
        categories: this.categories,
        drives: this.drives,
        students: this.students,
        applications: this.applications
      }, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json', err);
    }
  }

  // Categories
  public getCategories(): ClearanceCategory[] {
    return this.categories;
  }

  public addCategory(cat: Omit<ClearanceCategory, 'id'>): ClearanceCategory {
    const newCat: ClearanceCategory = {
      ...cat,
      id: `cat-${Date.now()}`
    };
    this.categories.push(newCat);

    // Sync newly added category to all students
    for (const s of this.students) {
      s.noDuesChecklist.push({
        categoryId: newCat.id,
        categoryName: newCat.name,
        status: 'Pending',
        remarks: 'New clearance category configured.',
        updatedAt: new Date().toISOString(),
        updatedBy: newCat.departmentOrAuthority
      });
      s.overallNoDuesCleared = computeStudentNoDuesStatus(s.noDuesChecklist, this.categories);
    }

    this.persist();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<ClearanceCategory>): ClearanceCategory | null {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...updates };

    // Recompute all student statuses if mandatory flag changed
    for (const s of this.students) {
      s.overallNoDuesCleared = computeStudentNoDuesStatus(s.noDuesChecklist, this.categories);
    }

    this.persist();
    return this.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.categories.splice(idx, 1);

    for (const s of this.students) {
      s.noDuesChecklist = s.noDuesChecklist.filter(c => c.categoryId !== id);
      s.overallNoDuesCleared = computeStudentNoDuesStatus(s.noDuesChecklist, this.categories);
    }

    this.persist();
    return true;
  }

  // Students
  public getStudents(filters?: {
    department?: string;
    batch?: string;
    year?: number;
    registrationStatus?: string;
    search?: string;
  }): Student[] {
    let list = this.students;

    if (filters?.department) {
      list = list.filter(s => s.department === filters.department);
    }
    if (filters?.batch) {
      list = list.filter(s => s.graduationBatch === filters.batch);
    }
    if (filters?.year) {
      list = list.filter(s => s.year === Number(filters.year));
    }
    if (filters?.registrationStatus !== undefined && filters.registrationStatus !== '') {
      const isReg = filters.registrationStatus === 'registered' || filters.registrationStatus === 'true';
      list = list.filter(s => s.placementRegistered === isReg);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(s => 
        s.rollNumber.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getStudentById(idOrRoll: string): Student | undefined {
    return this.students.find(s => s.id === idOrRoll || s.rollNumber.toUpperCase() === idOrRoll.toUpperCase());
  }

  public createStudent(data: Omit<Student, 'id' | 'createdAt' | 'noDuesChecklist' | 'overallNoDuesCleared'>): Student {
    // Check duplicate roll number
    if (this.students.some(s => s.rollNumber.toUpperCase() === data.rollNumber.toUpperCase())) {
      throw new Error(`Duplicate roll number: '${data.rollNumber}' already exists.`);
    }

    const checklist: StudentClearanceItem[] = this.categories.map(c => ({
      categoryId: c.id,
      categoryName: c.name,
      status: 'Pending',
      remarks: 'Pending clearance review.',
      updatedAt: new Date().toISOString(),
      updatedBy: c.departmentOrAuthority
    }));

    const student: Student = {
      ...data,
      id: `std-${data.rollNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      createdAt: new Date().toISOString(),
      noDuesChecklist: checklist,
      overallNoDuesCleared: computeStudentNoDuesStatus(checklist, this.categories)
    };

    this.students.push(student);
    this.persist();
    return student;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return null;

    if (updates.rollNumber && updates.rollNumber.toUpperCase() !== this.students[idx].rollNumber.toUpperCase()) {
      if (this.students.some(s => s.id !== id && s.rollNumber.toUpperCase() === updates.rollNumber!.toUpperCase())) {
        throw new Error(`Duplicate roll number: '${updates.rollNumber}' already exists.`);
      }
    }

    const updated = { ...this.students[idx], ...updates };
    updated.overallNoDuesCleared = computeStudentNoDuesStatus(updated.noDuesChecklist, this.categories);
    this.students[idx] = updated;
    this.persist();
    return updated;
  }

  public deleteStudent(id: string): boolean {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.students.splice(idx, 1);
    this.applications = this.applications.filter(a => a.studentId !== id);
    this.persist();
    return true;
  }

  // Update No-Dues for Student
  public updateStudentClearance(studentId: string, categoryId: string, clearance: {
    status: ClearanceStatus;
    remarks?: string;
    pendingRequirements?: string;
    updatedBy?: string;
  }): Student | null {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return null;

    let item = student.noDuesChecklist.find(c => c.categoryId === categoryId);
    if (!item) {
      const cat = this.categories.find(c => c.id === categoryId);
      if (!cat) return null;
      item = {
        categoryId,
        categoryName: cat.name,
        status: clearance.status,
        remarks: clearance.remarks,
        pendingRequirements: clearance.pendingRequirements,
        updatedAt: new Date().toISOString(),
        updatedBy: clearance.updatedBy || cat.departmentOrAuthority
      };
      student.noDuesChecklist.push(item);
    } else {
      item.status = clearance.status;
      if (clearance.remarks !== undefined) item.remarks = clearance.remarks;
      if (clearance.pendingRequirements !== undefined) item.pendingRequirements = clearance.pendingRequirements;
      item.updatedAt = new Date().toISOString();
      if (clearance.updatedBy) item.updatedBy = clearance.updatedBy;
    }

    student.overallNoDuesCleared = computeStudentNoDuesStatus(student.noDuesChecklist, this.categories);
    this.persist();
    return student;
  }

  public bulkUpdateClearance(studentIds: string[], categoryId: string, status: ClearanceStatus, remarks?: string, updatedBy?: string): number {
    let count = 0;
    for (const sid of studentIds) {
      const res = this.updateStudentClearance(sid, categoryId, { status, remarks, updatedBy });
      if (res) count++;
    }
    return count;
  }

  // Recruitment Drives
  public getDrives(): RecruitmentDrive[] {
    return this.drives;
  }

  public getDriveById(id: string): RecruitmentDrive | undefined {
    return this.drives.find(d => d.id === id);
  }

  public createDrive(data: Omit<RecruitmentDrive, 'id'>): RecruitmentDrive {
    const drive: RecruitmentDrive = {
      ...data,
      id: `drv-${Date.now()}`
    };
    this.drives.push(drive);
    this.persist();
    return drive;
  }

  public updateDrive(id: string, updates: Partial<RecruitmentDrive>): RecruitmentDrive | null {
    const idx = this.drives.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.drives[idx] = { ...this.drives[idx], ...updates };
    this.persist();
    return this.drives[idx];
  }

  public deleteDrive(id: string): boolean {
    const idx = this.drives.findIndex(d => d.id === id);
    if (idx === -1) return false;
    this.drives.splice(idx, 1);
    this.applications = this.applications.filter(a => a.driveId !== id);
    this.persist();
    return true;
  }

  // Applications
  public getApplications(filters?: {
    driveId?: string;
    studentId?: string;
    stage?: string;
  }): PlacementApplication[] {
    let list = this.applications;
    if (filters?.driveId) {
      list = list.filter(a => a.driveId === filters.driveId);
    }
    if (filters?.studentId) {
      list = list.filter(a => a.studentId === filters.studentId);
    }
    if (filters?.stage) {
      list = list.filter(a => a.currentStage === filters.stage);
    }
    return list;
  }

  public createApplication(data: Omit<PlacementApplication, 'id' | 'appliedDate' | 'stageHistory'>): PlacementApplication {
    // Check if application already exists for this student & drive
    const exists = this.applications.find(a => a.studentId === data.studentId && a.driveId === data.driveId);
    if (exists) {
      throw new Error('Student has already applied to this recruitment drive.');
    }

    const app: PlacementApplication = {
      ...data,
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      stageHistory: [
        {
          stage: data.currentStage || 'Registered',
          updatedAt: new Date().toISOString().split('T')[0],
          notes: 'Application registered'
        }
      ]
    };
    this.applications.push(app);
    this.persist();
    return app;
  }

  public updateApplicationStage(id: string, update: {
    stage: PlacementApplication['currentStage'];
    notes?: string;
    packageOfferedLPA?: number;
    offerLetterRef?: string;
    isOfferAccepted?: boolean;
  }): PlacementApplication | null {
    const app = this.applications.find(a => a.id === id);
    if (!app) return null;

    app.currentStage = update.stage;
    if (update.packageOfferedLPA !== undefined) app.packageOfferedLPA = update.packageOfferedLPA;
    if (update.offerLetterRef !== undefined) app.offerLetterRef = update.offerLetterRef;
    if (update.isOfferAccepted !== undefined) app.isOfferAccepted = update.isOfferAccepted;

    if (['Selected', 'Offer Received', 'Joined'].includes(update.stage) && !app.offerDate) {
      app.offerDate = new Date().toISOString().split('T')[0];
    }

    app.stageHistory.push({
      stage: update.stage,
      updatedAt: new Date().toISOString().split('T')[0],
      notes: update.notes
    });

    this.persist();
    return app;
  }

  public deleteApplication(id: string): boolean {
    const idx = this.applications.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.applications.splice(idx, 1);
    this.persist();
    return true;
  }

  // Placement Analytics Computation (Dynamic, never hardcoded)
  public getPlacementAnalytics(filters?: { department?: string; batch?: string }): PlacementAnalytics {
    let students = this.students;
    if (filters?.department) {
      students = students.filter(s => s.department === filters.department);
    }
    if (filters?.batch) {
      students = students.filter(s => s.graduationBatch === filters.batch);
    }

    const studentIdSet = new Set(students.map(s => s.id));
    // Filter applications belonging to eligible students in the active scope
    const apps = this.applications.filter(a => studentIdSet.has(a.studentId));

    const totalRegistered = students.filter(s => s.placementRegistered).length;
    const totalEligible = students.filter(s => s.placementRegistered && s.eligibleForPlacement).length;

    // Participating students: students with at least 1 application
    const participatingStudentIds = new Set(apps.map(a => a.studentId));
    const participatingStudents = participatingStudentIds.size;

    // Valid placement stages (offers / selections)
    // Note: Cancelled drives or withdrawn/rejected applications are explicitly NOT successful placements
    const placedStages = ['Selected', 'Offer Received', 'Joined'];
    
    // Check drive status: drive must not be cancelled
    const activeDriveIds = new Set(this.drives.filter(d => d.status !== 'Cancelled').map(d => d.id));
    
    const validOfferApps = apps.filter(a => 
      placedStages.includes(a.currentStage) && 
      activeDriveIds.has(a.driveId)
    );

    const placedStudentIds = new Set(validOfferApps.map(a => a.studentId));
    const uniqueStudentsPlaced = placedStudentIds.size;
    const totalOffers = validOfferApps.length;
    const unplacedStudents = Math.max(0, totalEligible - uniqueStudentsPlaced);

    // Placement percentage formula: (Unique Students Placed / Eligible Students) * 100
    const overallPlacementPercentage = totalEligible > 0 
      ? Number(((uniqueStudentsPlaced / totalEligible) * 100).toFixed(1))
      : 0;

    // Package calculations from valid offers
    const packages: number[] = [];
    for (const a of validOfferApps) {
      const drive = this.drives.find(d => d.id === a.driveId);
      const pkg = a.packageOfferedLPA || drive?.packageLPA;
      if (pkg && pkg > 0) {
        packages.push(pkg);
      }
    }

    const highestPackageLPA = packages.length > 0 ? Math.max(...packages) : 0;
    const averagePackageLPA = packages.length > 0 
      ? Number((packages.reduce((sum, p) => sum + p, 0) / packages.length).toFixed(2))
      : 0;

    // Department-wise breakdown
    const depts: Department[] = [
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Mechanical Engineering'
    ];
    
    // Add any other departments found in students
    for (const s of this.students) {
      if (!depts.includes(s.department)) {
        depts.push(s.department);
      }
    }

    const departmentStats = depts.map(dept => {
      const deptStudents = this.students.filter(s => s.department === dept && (!filters?.batch || s.graduationBatch === filters.batch));
      const deptStudentIds = new Set(deptStudents.map(s => s.id));
      const deptTotalReg = deptStudents.filter(s => s.placementRegistered).length;
      const deptEligible = deptStudents.filter(s => s.placementRegistered && s.eligibleForPlacement).length;

      const deptOfferApps = this.applications.filter(a => 
        deptStudentIds.has(a.studentId) && 
        placedStages.includes(a.currentStage) && 
        activeDriveIds.has(a.driveId)
      );

      const deptPlacedIds = new Set(deptOfferApps.map(a => a.studentId));
      const deptUniquePlaced = deptPlacedIds.size;
      const deptTotalOffers = deptOfferApps.length;
      const deptUnplaced = Math.max(0, deptEligible - deptUniquePlaced);
      const deptPerc = deptEligible > 0 ? Number(((deptUniquePlaced / deptEligible) * 100).toFixed(1)) : 0;

      const deptPkgs: number[] = [];
      for (const a of deptOfferApps) {
        const drive = this.drives.find(d => d.id === a.driveId);
        const pkg = a.packageOfferedLPA || drive?.packageLPA;
        if (pkg && pkg > 0) deptPkgs.push(pkg);
      }

      return {
        department: dept,
        totalRegistered: deptTotalReg,
        eligibleStudents: deptEligible,
        uniquePlaced: deptUniquePlaced,
        totalOffers: deptTotalOffers,
        unplaced: deptUnplaced,
        placementPercentage: deptPerc,
        avgPackageLPA: deptPkgs.length > 0 ? Number((deptPkgs.reduce((acc, p) => acc + p, 0) / deptPkgs.length).toFixed(2)) : 0,
        highestPackageLPA: deptPkgs.length > 0 ? Math.max(...deptPkgs) : 0
      };
    });

    // Company stats
    const companyStats = this.drives.map(drive => {
      const driveApps = apps.filter(a => a.driveId === drive.id);
      const shortlisted = driveApps.filter(a => !['Registered', 'Eligibility Verified', 'Rejected', 'Withdrawn'].includes(a.currentStage)).length;
      const selected = driveApps.filter(a => ['Selected', 'Offer Received', 'Joined'].includes(a.currentStage)).length;
      const offers = driveApps.filter(a => ['Offer Received', 'Joined'].includes(a.currentStage)).length;

      return {
        driveId: drive.id,
        companyName: drive.companyName,
        jobRole: drive.jobRole,
        applicantsCount: driveApps.length,
        shortlistedCount: shortlisted,
        selectedCount: selected,
        offersCount: offers,
        packageLPA: drive.packageLPA
      };
    });

    // Batch trends (simulated historical comparison)
    const batchTrends = [
      { batch: '2023', uniquePlaced: 24, totalOffers: 29, placementPercentage: 82.5 },
      { batch: '2024', uniquePlaced: 27, totalOffers: 34, placementPercentage: 86.8 },
      { batch: '2025', uniquePlaced: uniqueStudentsPlaced, totalOffers, placementPercentage: overallPlacementPercentage }
    ];

    return {
      totalRegistered,
      totalEligible,
      participatingStudents,
      uniqueStudentsPlaced,
      totalOffers,
      unplacedStudents,
      overallPlacementPercentage,
      highestPackageLPA,
      averagePackageLPA,
      departmentStats,
      companyStats,
      batchTrends
    };
  }

  // No-Dues Analytics
  public getNoDuesAnalytics(filters?: { department?: string; batch?: string }): NoDuesAnalytics {
    let students = this.students;
    if (filters?.department) {
      students = students.filter(s => s.department === filters.department);
    }
    if (filters?.batch) {
      students = students.filter(s => s.graduationBatch === filters.batch);
    }

    const totalStudents = students.length;
    const fullyClearedStudents = students.filter(s => s.overallNoDuesCleared).length;
    const pendingClearances = totalStudents - fullyClearedStudents;
    
    // Count how many students have at least one rejected clearance
    const rejectedRequests = students.filter(s => 
      s.noDuesChecklist.some(c => c.status === 'Rejected / Further Action Required')
    ).length;

    const clearanceRate = totalStudents > 0 
      ? Number(((fullyClearedStudents / totalStudents) * 100).toFixed(1))
      : 0;

    // Dept clearance breakdown
    const depts: Department[] = [
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Mechanical Engineering'
    ];
    for (const s of this.students) {
      if (!depts.includes(s.department)) depts.push(s.department);
    }

    const departmentClearance = depts.map(dept => {
      const deptStudents = this.students.filter(s => s.department === dept && (!filters?.batch || s.graduationBatch === filters.batch));
      const total = deptStudents.length;
      const cleared = deptStudents.filter(s => s.overallNoDuesCleared).length;
      const pending = total - cleared;
      const rejected = deptStudents.filter(s => s.noDuesChecklist.some(c => c.status === 'Rejected / Further Action Required')).length;
      const clearedPercentage = total > 0 ? Number(((cleared / total) * 100).toFixed(1)) : 0;

      return {
        department: dept,
        total,
        cleared,
        pending,
        rejected,
        clearedPercentage
      };
    });

    // Category breakdown
    const categoryBreakdown = this.categories.map(cat => {
      let clearedCount = 0;
      let pendingCount = 0;
      let rejectedCount = 0;

      for (const s of students) {
        const item = s.noDuesChecklist.find(c => c.categoryId === cat.id);
        if (item?.status === 'Cleared' || item?.status === 'Not Applicable') {
          clearedCount++;
        } else if (item?.status === 'Rejected / Further Action Required') {
          rejectedCount++;
        } else {
          pendingCount++;
        }
      }

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        clearedCount,
        pendingCount,
        rejectedCount
      };
    });

    return {
      totalStudents,
      fullyClearedStudents,
      pendingClearances,
      rejectedRequests,
      clearanceRate,
      departmentClearance,
      categoryBreakdown
    };
  }
}

export const db = new Database();
