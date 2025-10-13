import { router } from './trpc';
import { healthRouter } from './routers/health';

export const appRouter = router({
  health: healthRouter,
});

// Export type for frontend inference
export type AppRouter = typeof appRouter;
