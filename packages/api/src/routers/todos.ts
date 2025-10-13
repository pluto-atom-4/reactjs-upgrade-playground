// packages/api/src/routers/todos.ts
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../prisma';

export const todosRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.todo.findMany();
  }),

  add: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(({ input }) => {
      return prisma.todo.create({
        data: { text: input.text },
      });
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const todo = await prisma.todo.findUnique({ where: { id: input.id } });
      if (!todo) return null;
      return prisma.todo.update({
        where: { id: input.id },
        data: { done: !todo.done },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.todo.delete({ where: { id: input.id } });
    }),
});
