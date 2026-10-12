import { Router, Request, Response } from 'express';
import { db } from '../db.ts';

const router = Router();

// GET all drives
router.get('/', (_req: Request, res: Response) => {
  try {
    const drives = db.getDrives();
    const apps = db.getApplications();

    // Attach summary metrics to each drive
    const drivesWithStats = drives.map(drive => {
      const driveApps = apps.filter(a => a.driveId === drive.id);
      const stageCounts: Record<string, number> = {};
      driveApps.forEach(a => {
        stageCounts[a.currentStage] = (stageCounts[a.currentStage] || 0) + 1;
      });

      return {
        ...drive,
        totalApplicants: driveApps.length,
        selectedCount: driveApps.filter(a => ['Selected', 'Offer Received', 'Joined'].includes(a.currentStage)).length,
        offersCount: driveApps.filter(a => ['Offer Received', 'Joined'].includes(a.currentStage)).length,
        stageCounts
      };
    });

    res.json({ success: true, count: drivesWithStats.length, data: drivesWithStats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single drive
router.get('/:id', (req: Request, res: Response) => {
  try {
    const drive = db.getDriveById(req.params.id);
    if (!drive) {
      return res.status(404).json({ success: false, error: 'Drive not found' });
    }
    const apps = db.getApplications({ driveId: drive.id });
    const students = db.getStudents();

    // Merge applicant student details
    const applicants = apps.map(app => {
      const student = students.find(s => s.id === app.studentId);
      return {
        ...app,
        studentName: student?.name,
        rollNumber: student?.rollNumber,
        department: student?.department,
        cgpa: student?.cgpa,
        studentEmail: student?.email
      };
    });

    res.json({ success: true, data: { ...drive, applicants } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create drive
router.post('/', (req: Request, res: Response) => {
  try {
    const { 
      companyName, jobRole, eligibleDepartments, eligibleBatches, minCgpa, 
      maxBacklogs, requiredSkills, registrationDeadline, driveDate, 
      recruitmentStages, jobLocation, packageLPA, status, description 
    } = req.body;

    if (!companyName || !jobRole || !registrationDeadline) {
      return res.status(400).json({ success: false, error: 'Company Name, Job Role, and Registration Deadline are mandatory.' });
    }

    const drive = db.createDrive({
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      eligibleDepartments: Array.isArray(eligibleDepartments) ? eligibleDepartments : ['Computer Science & Engineering'],
      eligibleBatches: Array.isArray(eligibleBatches) ? eligibleBatches : ['2025'],
      minCgpa: Number(minCgpa) || 0,
      maxBacklogs: Number(maxBacklogs) || 0,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      registrationDeadline,
      driveDate: driveDate || registrationDeadline,
      recruitmentStages: Array.isArray(recruitmentStages) && recruitmentStages.length > 0 
        ? recruitmentStages 
        : ['Registration', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Final Offer'],
      jobLocation: jobLocation || 'TBD',
      packageLPA: Number(packageLPA) || 0,
      status: status || 'Planned',
      description: description || ''
    });

    res.status(201).json({ success: true, data: drive });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update drive
router.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateDrive(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Drive not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE drive
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteDrive(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Drive not found' });
    }
    res.json({ success: true, message: 'Drive deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
