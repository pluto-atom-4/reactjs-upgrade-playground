// packages/api/src/routers/todos.ts
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

// In-memory storage for todos (replace with database in production)
let todos: { id: string; text: string; completed: boolean; createdAt: Date }[] = [];

export const todosRouter = router({
  getAll: publicProcedure.query(async () => {
    return todos;
  }),

  add: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const newTodo = {
        id: Math.random().toString(36).substr(2, 9),
        text: input.text,
        completed: false,
        createdAt: new Date(),
      };
      todos.push(newTodo);
      return newTodo;
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const todo = todos.find(t => t.id === input.id);
      if (todo) {
        todo.completed = !todo.completed;
      }
      return todo;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const index = todos.findIndex(t => t.id === input.id);
      if (index > -1) {
        const deleted = todos.splice(index, 1)[0];
        return deleted;
      }
      return null;
    }),
});
