import { Router, Request, Response } from 'express';
import { db } from '../db.ts';
import { ClearanceStatus } from '../../src/types/index.ts';

const router = Router();

// GET all categories
router.get('/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST add new category
router.post('/categories', (req: Request, res: Response) => {
  try {
    const { name, code, departmentOrAuthority, isMandatory, description } = req.body;
    if (!name || !departmentOrAuthority) {
      return res.status(400).json({ success: false, error: 'Category Name and Department/Authority are mandatory.' });
    }

    const created = db.addCategory({
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : `CAT-${Date.now().toString().slice(-4)}`,
      departmentOrAuthority: departmentOrAuthority.trim(),
      isMandatory: isMandatory !== undefined ? Boolean(isMandatory) : true,
      description: description || ''
    });

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update category
router.put('/categories/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE category
router.delete('/categories/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, message: 'Category removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update individual student clearance category
router.put('/students/:studentId/categories/:categoryId', (req: Request, res: Response) => {
  try {
    const { studentId, categoryId } = req.params;
    const { status, remarks, pendingRequirements, updatedBy } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Clearance status is required' });
    }

    const student = db.updateStudentClearance(studentId, categoryId, {
      status: status as ClearanceStatus,
      remarks,
      pendingRequirements,
      updatedBy: updatedBy || 'Placement / Department Authority'
    });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student or Category not found' });
    }

    res.json({ 
      success: true, 
      overallNoDuesCleared: student.overallNoDuesCleared,
      student 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST bulk update student clearance
router.post('/bulk-update', (req: Request, res: Response) => {
  try {
    const { studentIds, categoryId, status, remarks, updatedBy } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0 || !categoryId || !status) {
      return res.status(400).json({ 
        success: false, 
        error: 'studentIds array, categoryId, and status are required' 
      });
    }

    const count = db.bulkUpdateClearance(
      studentIds, 
      categoryId, 
      status as ClearanceStatus, 
      remarks, 
      updatedBy || 'Central Clearance Officer'
    );

    res.json({ success: true, updatedCount: count });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
