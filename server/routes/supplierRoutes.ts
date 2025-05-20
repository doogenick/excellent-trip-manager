// server/routes/supplierRoutes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET all suppliers
router.get('/', async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// POST a new supplier
router.post('/', async (req: Request, res: Response) => {
  try {
    const newSupplier = await prisma.supplier.create({
      data: req.body,
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// GET a single supplier by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { SupplierID: parseInt(id) },
    });
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ error: 'Supplier not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch supplier with id ${id}` });
  }
});

// PUT update a supplier by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedSupplier = await prisma.supplier.update({
      where: { SupplierID: parseInt(id) },
      data: req.body,
    });
    res.json(updatedSupplier);
  } catch (error) {
    console.error(error);
    // Check for Prisma's record not found error
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Supplier not found' });
    } else {
      res.status(500).json({ error: `Failed to update supplier with id ${id}` });
    }
  }
});

// DELETE a supplier by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.supplier.delete({
      where: { SupplierID: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    // Check for Prisma's record not found error
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Supplier not found' });
    } else {
      res.status(500).json({ error: `Failed to delete supplier with id ${id}` });
    }
  }
});

export default router;
