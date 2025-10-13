import { publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const healthRouter = router({
  status: publicProcedure
    .input(z.void())
    .query(() => {
      return { status: 'OK' };
    }),
});
