import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './index';

const app = express();
const PORT = 4000;

// Enable CORS for the frontend
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server default port
  credentials: true,
}));

// Set up tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
