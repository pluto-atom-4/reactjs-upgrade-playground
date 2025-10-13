import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './index.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(PORT, () => {
  console.log(`🚀 tRPC server running at http://localhost:${PORT}/trpc`);
});
