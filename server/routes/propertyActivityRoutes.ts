// server/routes/propertyActivityRoutes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET all property/activities
router.get('/', async (req: Request, res: Response) => {
  try {
    const propertyActivities = await prisma.propertyActivity.findMany({
      include: { Supplier: true }, // Optionally include related Supplier info
    });
    res.json(propertyActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch property/activities' });
  }
});

// POST a new property/activity
router.post('/', async (req: Request, res: Response) => {
  try {
    const newPropertyActivity = await prisma.propertyActivity.create({
      data: req.body,
    });
    res.status(201).json(newPropertyActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create property/activity' });
  }
});

// GET a single property/activity by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const propertyActivity = await prisma.propertyActivity.findUnique({
      where: { PropertyActivityID: parseInt(id) },
      include: { Supplier: true, Rates: true }, // Optionally include related info
    });
    if (propertyActivity) {
      res.json(propertyActivity);
    } else {
      res.status(404).json({ error: 'Property/Activity not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch property/activity with id ${id}` });
  }
});

// PUT update a property/activity by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedPropertyActivity = await prisma.propertyActivity.update({
      where: { PropertyActivityID: parseInt(id) },
      data: req.body,
    });
    res.json(updatedPropertyActivity);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') { // Prisma's record not found error
      res.status(404).json({ error: 'Property/Activity not found' });
    } else {
      res.status(500).json({ error: `Failed to update property/activity with id ${id}` });
    }
  }
});

// DELETE a property/activity by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.propertyActivity.delete({
      where: { PropertyActivityID: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') { // Prisma's record not found error
      res.status(404).json({ error: 'Property/Activity not found' });
    } else {
      res.status(500).json({ error: `Failed to delete property/activity with id ${id}` });
    }
  }
});

export default router;
