// prisma.config.cjs
// CommonJS Prisma config — Prisma can parse this without TypeScript runtime.

// Ensure environment variables are loaded when Prisma CLI loads this config.
// Prisma skips automatic .env loading if a config file is present, so we must load it here.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch (e) {
  // ignore if dotenv is not available
}

module.exports = {
  seed: 'tsx prisma/seed.ts',
};
