import { healthRouter } from './routers/health';
import { todosRouter } from "./routers/todos";
import { router } from './trpc';

export const appRouter = router({
  health: healthRouter,
  todos: todosRouter
});

// Export type for frontend inference
export type AppRouter = typeof appRouter;
