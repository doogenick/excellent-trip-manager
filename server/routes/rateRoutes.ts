// server/routes/rateRoutes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET all rates (optionally filter by PropertyActivityID)
router.get('/', async (req: Request, res: Response) => {
  const { propertyActivityId } = req.query;
  try {
    const rates = await prisma.rate.findMany({
      where: propertyActivityId
        ? { PropertyActivityID: parseInt(propertyActivityId as string) }
        : {},
      include: { PropertyActivity: true }, // Optionally include related PropertyActivity info
    });
    res.json(rates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch rates' });
  }
});

// POST a new rate
router.post('/', async (req: Request, res: Response) => {
  try {
    // Convert date strings to Date objects if necessary
    const { ValidityStartDate, ValidityEndDate, ...restOfBody } = req.body;
    const newRate = await prisma.rate.create({
      data: {
        ...restOfBody,
        ValidityStartDate: new Date(ValidityStartDate),
        ValidityEndDate: new Date(ValidityEndDate),
      },
    });
    res.status(201).json(newRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create rate' });
  }
});

// GET a single rate by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const rate = await prisma.rate.findUnique({
      where: { RateID: parseInt(id) },
      include: { PropertyActivity: true }, // Optionally include related info
    });
    if (rate) {
      res.json(rate);
    } else {
      res.status(404).json({ error: 'Rate not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch rate with id ${id}` });
  }
});

// PUT update a rate by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { ValidityStartDate, ValidityEndDate, ...restOfBody } = req.body;
    const dataToUpdate: any = { ...restOfBody };
    if (ValidityStartDate) {
      dataToUpdate.ValidityStartDate = new Date(ValidityStartDate);
    }
    if (ValidityEndDate) {
      dataToUpdate.ValidityEndDate = new Date(ValidityEndDate);
    }

    const updatedRate = await prisma.rate.update({
      where: { RateID: parseInt(id) },
      data: dataToUpdate,
    });
    res.json(updatedRate);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') { // Prisma's record not found error
      res.status(404).json({ error: 'Rate not found' });
    } else {
      res.status(500).json({ error: `Failed to update rate with id ${id}` });
    }
  }
});

// DELETE a rate by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.rate.delete({
      where: { RateID: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') { // Prisma's record not found error
      res.status(404).json({ error: 'Rate not found' });
    } else {
      res.status(500).json({ error: `Failed to delete rate with id ${id}` });
    }
  }
});

export default router;
