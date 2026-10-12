import { Router, Request, Response } from 'express';
import { db } from '../db.ts';
import { ApplicationStage } from '../../src/types/index.ts';

const router = Router();

// GET applications
router.get('/', (req: Request, res: Response) => {
  try {
    const { driveId, studentId, stage } = req.query;
    const apps = db.getApplications({
      driveId: driveId as string,
      studentId: studentId as string,
      stage: stage as string
    });

    const students = db.getStudents();
    const drives = db.getDrives();

    const enriched = apps.map(app => {
      const student = students.find(s => s.id === app.studentId);
      const drive = drives.find(d => d.id === app.driveId);
      return {
        ...app,
        studentName: student?.name || 'Unknown',
        rollNumber: student?.rollNumber || '',
        department: student?.department,
        cgpa: student?.cgpa,
        studentEmail: student?.email,
        driveStatus: drive?.status,
        driveDate: drive?.driveDate
      };
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST new application
router.post('/', (req: Request, res: Response) => {
  try {
    const { studentId, driveId, currentStage, packageOfferedLPA } = req.body;

    if (!studentId || !driveId) {
      return res.status(400).json({ success: false, error: 'studentId and driveId are required' });
    }

    const drive = db.getDriveById(driveId);
    if (!drive) {
      return res.status(404).json({ success: false, error: 'Drive not found' });
    }

    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const app = db.createApplication({
      studentId,
      driveId,
      companyName: drive.companyName,
      jobRole: drive.jobRole,
      currentStage: (currentStage as ApplicationStage) || 'Registered',
      packageOfferedLPA: packageOfferedLPA !== undefined ? Number(packageOfferedLPA) : drive.packageLPA
    });

    res.status(201).json({ success: true, data: app });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update stage
router.put('/:id/stage', (req: Request, res: Response) => {
  try {
    const { stage, notes, packageOfferedLPA, offerLetterRef, isOfferAccepted } = req.body;
    if (!stage) {
      return res.status(400).json({ success: false, error: 'stage is required' });
    }

    const updated = db.updateApplicationStage(req.params.id, {
      stage,
      notes,
      packageOfferedLPA: packageOfferedLPA !== undefined ? Number(packageOfferedLPA) : undefined,
      offerLetterRef,
      isOfferAccepted
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE application
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteApplication(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, message: 'Application deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
