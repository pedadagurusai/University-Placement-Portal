import { Router, Request, Response } from 'express';
import { db } from '../db.ts';
import { Department } from '../../src/types/index.ts';

const router = Router();

// GET students with filters
router.get('/', (req: Request, res: Response) => {
  try {
    const { department, batch, year, registrationStatus, search } = req.query;
    const students = db.getStudents({
      department: department as string,
      batch: batch as string,
      year: year ? Number(year) : undefined,
      registrationStatus: registrationStatus as string,
      search: search as string
    });
    res.json({ success: true, count: students.length, data: students });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single student
router.get('/:id', (req: Request, res: Response) => {
  try {
    const student = db.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create student
router.post('/', (req: Request, res: Response) => {
  try {
    const { 
      rollNumber, name, department, program, year, section, graduationBatch, 
      email, cgpa, backlogs, placementRegistered, eligibleForPlacement, skills 
    } = req.body;

    if (!rollNumber || !name || !department || !email) {
      return res.status(400).json({ success: false, error: 'Roll number, Name, Department and Email are mandatory fields.' });
    }

    const student = db.createStudent({
      rollNumber: rollNumber.trim().toUpperCase(),
      name: name.trim(),
      department: department as Department,
      program: program || 'B.Tech',
      year: Number(year) || 4,
      section: section || 'A',
      graduationBatch: graduationBatch || '2025',
      email: email.trim().toLowerCase(),
      cgpa: Number(cgpa) || 0,
      backlogs: Number(backlogs) || 0,
      placementRegistered: placementRegistered !== undefined ? Boolean(placementRegistered) : true,
      eligibleForPlacement: eligibleForPlacement !== undefined ? Boolean(eligibleForPlacement) : ((Number(cgpa) || 0) >= 7.0 && (Number(backlogs) || 0) === 0),
      skills: Array.isArray(skills) ? skills : []
    });

    res.status(201).json({ success: true, data: student });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update student
router.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateStudent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE student
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteStudent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, message: 'Student removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET downloadable sample template CSV
router.get('/template/download', (_req: Request, res: Response) => {
  const csvHeader = 'Roll Number,Full Name,Department,Program,Year,Section,Graduation Batch,Email,CGPA,Backlogs,Placement Registered (Yes/No),Skills (Comma Separated)\n';
  const sampleRows = [
    '21CS099,Aravind Swaminathan,Computer Science & Engineering,B.Tech,4,A,2025,aravind.21cs099@university.edu,8.75,0,Yes,"Python, React, Algorithms"',
    '21EC099,Divya Natarajan,Electronics & Communication Engineering,B.Tech,4,B,2025,divya.21ec099@university.edu,7.90,0,Yes,"Embedded C, VLSI, IoT"',
    '21ME099,Mohan Lal,Mechanical Engineering,B.Tech,4,A,2025,mohan.21me099@university.edu,7.20,0,No,"AutoCAD, SolidWorks, Robotics"'
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="student_import_template.csv"');
  res.send(csvHeader + sampleRows);
});

// POST import validation & commit
// Supports preview mode ({ previewOnly: true }) and commit mode
router.post('/import', (req: Request, res: Response) => {
  try {
    const { rows, previewOnly } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No rows provided for import. Please upload a valid CSV or Excel file.' 
      });
    }

    const validDepartments: Department[] = [
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Mechanical Engineering',
      'Information Technology',
      'Civil Engineering'
    ];

    interface RowValidationResult {
      rowNumber: number;
      raw: any;
      isValid: boolean;
      errors: string[];
      parsedStudent?: any;
      isDuplicate: boolean;
    }

    const validationResults: RowValidationResult[] = [];
    const rollNumbersSeenInFile = new Set<string>();
    const existingStudents = db.getStudents();
    const existingRolls = new Set(existingStudents.map(s => s.rollNumber.toUpperCase()));

    let successCount = 0;
    let duplicateCount = 0;
    let failedCount = 0;

    rows.forEach((row: any, idx: number) => {
      const rowNum = idx + 2; // header is row 1
      const errors: string[] = [];

      // Flexible column key matching
      const rollNumber = (row['Roll Number'] || row['rollNumber'] || row['Roll No'] || row['roll_no'] || row['Roll'] || '')?.toString().trim().toUpperCase();
      const name = (row['Full Name'] || row['Student Name'] || row['name'] || row['Name'] || '')?.toString().trim();
      let department = (row['Department'] || row['department'] || row['Dept'] || '')?.toString().trim();
      const program = (row['Program'] || row['program'] || 'B.Tech')?.toString().trim();
      const year = Number(row['Year'] || row['year'] || 4);
      const section = (row['Section'] || row['section'] || 'A')?.toString().trim();
      const batch = (row['Graduation Batch'] || row['Batch'] || row['graduationBatch'] || '2025')?.toString().trim();
      const email = (row['Email'] || row['email'] || row['University Email'] || '')?.toString().trim().toLowerCase();
      const cgpa = Number(row['CGPA'] || row['cgpa'] || 0);
      const backlogs = Number(row['Backlogs'] || row['backlogs'] || 0);
      const regRaw = (row['Placement Registered (Yes/No)'] || row['placementRegistered'] || row['Registered'] || 'Yes')?.toString().trim().toLowerCase();
      const placementRegistered = ['yes', 'true', '1', 'y'].includes(regRaw);
      const skillsRaw = (row['Skills (Comma Separated)'] || row['skills'] || row['Skills'] || '')?.toString().trim();
      const skills = skillsRaw ? skillsRaw.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

      // Validations
      if (!rollNumber) {
        errors.push('Roll Number is missing.');
      } else if (!/^[0-9]{2}[A-Za-z]{2,3}[0-9]{3,4}$/.test(rollNumber) && rollNumber.length < 5) {
        errors.push(`Invalid roll number format '${rollNumber}'. Expected format e.g. '21CS001'.`);
      }

      if (!name || name.length < 2) {
        errors.push('Full Name is missing or too short.');
      }

      // Department normalization
      const matchedDept = validDepartments.find(vd => 
        vd.toLowerCase() === department.toLowerCase() ||
        (department.toLowerCase().includes('cs') && vd.includes('Computer')) ||
        (department.toLowerCase().includes('ec') && vd.includes('Electronics')) ||
        (department.toLowerCase().includes('mech') && vd.includes('Mechanical')) ||
        (department.toLowerCase().includes('it') && vd.includes('Information'))
      );

      if (!matchedDept) {
        errors.push(`Invalid department '${department}'. Accepted: ${validDepartments.join(', ')}.`);
      } else {
        department = matchedDept;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        errors.push(`Invalid university email '${email}'.`);
      }

      // CGPA validation
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        errors.push(`CGPA must be a decimal between 0.0 and 10.0 (received '${row['CGPA']}').`);
      }

      // Backlogs validation
      if (isNaN(backlogs) || backlogs < 0) {
        errors.push(`Backlogs count must be a non-negative integer (received '${row['Backlogs']}').`);
      }

      // Duplicate detection
      let isDuplicate = false;
      if (rollNumber) {
        if (existingRolls.has(rollNumber)) {
          errors.push(`Duplicate roll number '${rollNumber}' already exists in database.`);
          isDuplicate = true;
          duplicateCount++;
        } else if (rollNumbersSeenInFile.has(rollNumber)) {
          errors.push(`Duplicate roll number '${rollNumber}' appears multiple times in this import file.`);
          isDuplicate = true;
          duplicateCount++;
        } else {
          rollNumbersSeenInFile.add(rollNumber);
        }
      }

      const isValid = errors.length === 0;
      if (isValid) {
        successCount++;
      } else {
        failedCount++;
      }

      const parsedStudent = isValid ? {
        rollNumber,
        name,
        department,
        program,
        year,
        section,
        graduationBatch: batch,
        email,
        cgpa,
        backlogs,
        placementRegistered,
        eligibleForPlacement: placementRegistered && cgpa >= 7.0 && backlogs === 0,
        skills
      } : undefined;

      validationResults.push({
        rowNumber: rowNum,
        raw: row,
        isValid,
        errors,
        parsedStudent,
        isDuplicate
      });
    });

    // If previewOnly is requested, return preview analysis without committing
    if (previewOnly) {
      return res.json({
        success: true,
        preview: true,
        summary: {
          totalRows: rows.length,
          validRows: successCount,
          invalidRows: failedCount,
          duplicates: duplicateCount
        },
        results: validationResults
      });
    }

    // In commit mode: insert all valid rows (never silently overwrite existing)
    const importedStudents = [];
    const skippedRows = [];

    for (const item of validationResults) {
      if (item.isValid && item.parsedStudent) {
        try {
          const created = db.createStudent(item.parsedStudent);
          importedStudents.push(created);
        } catch (err: any) {
          skippedRows.push({
            rowNumber: item.rowNumber,
            rollNumber: item.parsedStudent.rollNumber,
            reason: err.message
          });
        }
      } else {
        skippedRows.push({
          rowNumber: item.rowNumber,
          rollNumber: item.raw?.['Roll Number'] || 'Unknown',
          reason: item.errors.join('; ')
        });
      }
    }

    res.json({
      success: true,
      summary: {
        totalProcessed: rows.length,
        successful: importedStudents.length,
        skippedOrFailed: skippedRows.length,
        duplicateCount
      },
      importedStudents,
      skippedRows
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
