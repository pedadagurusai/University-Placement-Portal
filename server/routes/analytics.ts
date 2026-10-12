import { Router, Request, Response } from 'express';
import { db } from '../db.ts';
import * as XLSX from 'xlsx';

const router = Router();

// GET placement analytics
router.get('/placement', (req: Request, res: Response) => {
  try {
    const { department, batch } = req.query;
    const analytics = db.getPlacementAnalytics({
      department: department as string,
      batch: batch as string
    });
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET no-dues analytics
router.get('/nodues', (req: Request, res: Response) => {
  try {
    const { department, batch } = req.query;
    const analytics = db.getNoDuesAnalytics({
      department: department as string,
      batch: batch as string
    });
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET export student placement report (CSV or XLSX)
router.get('/export/placement', (req: Request, res: Response) => {
  try {
    const { format = 'csv', department, batch } = req.query;
    const students = db.getStudents({
      department: department as string,
      batch: batch as string
    });
    const apps = db.getApplications();
    const drives = db.getDrives();

    // Flatten into rows: 1 row per student or 1 row per offer
    const rows = students.map(s => {
      const studentApps = apps.filter(a => a.studentId === s.id);
      const offerApps = studentApps.filter(a => ['Selected', 'Offer Received', 'Joined'].includes(a.currentStage));
      const offersCompanies = offerApps.map(a => `${a.companyName} (${a.packageOfferedLPA || 'N/A'} LPA)`).join('; ');

      return {
        'Roll Number': s.rollNumber,
        'Student Name': s.name,
        'Department': s.department,
        'Program': s.program,
        'Year & Section': `${s.year}-${s.section}`,
        'Batch': s.graduationBatch,
        'CGPA': s.cgpa,
        'Placement Registered': s.placementRegistered ? 'Yes' : 'No',
        'Eligible': s.eligibleForPlacement ? 'Yes' : 'No',
        'Total Applications': studentApps.length,
        'Total Offers': offerApps.length,
        'Placement Status': offerApps.length > 0 ? 'Placed' : (s.eligibleForPlacement ? 'Unplaced' : 'Not Eligible'),
        'Offers & Packages': offersCompanies || 'None',
        'Highest Package (LPA)': offerApps.length > 0 ? Math.max(...offerApps.map(a => a.packageOfferedLPA || 0)) : 0
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Placement_Report');

    if (format === 'xlsx') {
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="university_placement_report.xlsx"');
      return res.send(buffer);
    } else {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="university_placement_report.csv"');
      return res.send(csv);
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET export No-Dues clearance report (CSV or XLSX)
router.get('/export/nodues', (req: Request, res: Response) => {
  try {
    const { format = 'csv', department, batch } = req.query;
    const students = db.getStudents({
      department: department as string,
      batch: batch as string
    });
    const categories = db.getCategories();

    const rows = students.map(s => {
      const row: Record<string, any> = {
        'Roll Number': s.rollNumber,
        'Student Name': s.name,
        'Department': s.department,
        'Batch': s.graduationBatch,
        'Overall Status': s.overallNoDuesCleared ? 'FULLY CLEARED' : 'INCOMPLETE / PENDING'
      };

      // Add each category status
      categories.forEach(cat => {
        const item = s.noDuesChecklist.find(c => c.categoryId === cat.id);
        row[cat.name] = item ? `${item.status}${item.pendingRequirements ? ` (${item.pendingRequirements})` : ''}` : 'Not Assessed';
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'No_Dues_Status');

    if (format === 'xlsx') {
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="department_nodues_report.xlsx"');
      return res.send(buffer);
    } else {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="department_nodues_report.csv"');
      return res.send(csv);
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST reset data to defaults
router.post('/reset', (_req: Request, res: Response) => {
  try {
    db.resetToDefaults();
    res.json({ success: true, message: 'Database reset to default seed data successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
