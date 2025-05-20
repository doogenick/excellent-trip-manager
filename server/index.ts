import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import supplierRoutes from './routes/supplierRoutes'; // Import supplier routes
import propertyActivityRoutes from './routes/propertyActivityRoutes'; // Import property/activity routes
import rateRoutes from './routes/rateRoutes'; // Import rate routes

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running!');
});

// We will add supplier routes here later
app.use('/api/suppliers', supplierRoutes); // Use supplier routes
app.use('/api/properties-activities', propertyActivityRoutes); // Use property/activity routes
app.use('/api/rates', rateRoutes); // Use rate routes

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app; // Optional: export app for testing or other purposes
