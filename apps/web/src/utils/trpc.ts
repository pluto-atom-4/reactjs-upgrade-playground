import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, type TRPCClient } from "@trpc/client";
import type { AppRouter } from '@api/index';
import type { CreateTRPCReact } from '@trpc/react-query';

export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();

export const trpcClient: TRPCClient<AppRouter> = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/trpc',
    }),
  ],
});
