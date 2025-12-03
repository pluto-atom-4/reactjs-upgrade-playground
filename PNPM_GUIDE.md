# PNPM Quick Reference Guide

This project uses **pnpm** instead of npm. Here are the common commands:

## Installation & Setup

```bash
# Install dependencies
pnpm install

# Install a specific package
pnpm add <package-name>

# Install a dev dependency
pnpm add -D <package-name>

# Install globally
pnpm add -g <package-name>
```

## Running Scripts

```bash
# Run dev server with migrations and database seed
pnpm dx

# Run dev server only (no migrations)
pnpm dev:nomigrate

# Run Next.js dev server
pnpm dx:next

# Run Prisma Studio
pnpm dx:prisma-studio
```

## Testing

```bash
# Run unit tests with Vitest
pnpm test-unit

# Run E2E tests with Playwright
pnpm test-e2e

# Run all tests
pnpm test-start

# Run E2E tests in CI mode
pnpm test-e2e:ci
```

## Building & Deployment

```bash
# Build the project
pnpm build

# Start production server
pnpm start

# Build with pre-generation steps
pnpm prebuild
```

## Database & Prisma

```bash
# Generate Prisma client
pnpm generate

# Open Prisma Studio (visual database editor)
pnpm prisma-studio

# Seed the database
pnpm db-seed

# Reset the database (deletes all data)
pnpm db-reset

# Run migrations in dev
pnpm migrate-dev

# Run migrations in production
pnpm migrate
```

## Code Quality

```bash
# Run linter
pnpm lint

# Fix linter issues
pnpm lint-fix

# TypeScript type checking
pnpm typecheck
```

## Key Differences from npm

| Task | npm | pnpm |
|------|-----|------|
| Install all | `npm install` | `pnpm install` |
| Add package | `npm install pkg` | `pnpm add pkg` |
| Dev package | `npm install -D pkg` | `pnpm add -D pkg` |
| Remove package | `npm uninstall pkg` | `pnpm remove pkg` |
| Run script | `npm run script` | `pnpm script` |
| Global install | `npm install -g pkg` | `pnpm add -g pkg` |

## pnpm Configuration

The `.npmrc` file contains pnpm-specific settings:

- `enable-pre-post-scripts=true` - Enables npm lifecycle hooks (pre/post scripts)
- `shamefully-hoist=true` - Flattens dependency tree for better compatibility
- `link-workspace-packages=true` - Links workspace packages
- `prefer-offline=false` - Won't use cached packages
- `frozen-lockfile=false` - Allows lock file updates

## Why pnpm?

✅ **Faster** - Efficient dependency resolution and installation
✅ **Disk efficient** - Uses content-addressable storage
✅ **Stricter** - Prevents phantom dependencies
✅ **Better monorepo support** - Workspaces are first-class
✅ **Secure** - Reduces attack surface

## Troubleshooting

### "command not found: pnpm"
Install pnpm globally:
```bash
npm install -g pnpm
```

### "pnpm-lock.yaml conflicts"
Always use `pnpm install` to update lock files, never manually edit them.

### Clear cache if having issues
```bash
pnpm store prune
```

### Remove node_modules and reinstall
```bash
pnpm install --force
```

## Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [pnpm vs npm vs yarn comparison](https://pnpm.io/en/comparison)
- [pnpm CLI reference](https://pnpm.io/cli/add)

