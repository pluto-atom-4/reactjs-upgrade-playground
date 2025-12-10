import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma 7 configuration file.
 * Defines datasource URLs for CLI operations (migrate, validate, generate).
 * Runtime client configuration is handled in src/server/prisma.ts via adapter.
 *
 * @see https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/schema.prisma",
  },
  datasource: {
    url: env('DATABASE_URL'),
    shadowDatabaseUrl: env('SHADOW_DATABASE_URL')
  },
});
