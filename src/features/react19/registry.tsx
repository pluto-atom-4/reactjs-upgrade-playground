import type { JSX } from 'react';
import { UseActionStateDemo } from './demos/use-action-state-basic';
import { UseActionStateAdvancedDemo } from './demos/use-action-state-advanced';
import { UseOptimisticDemo } from './demos/use-optimistic';
import { UseStartTransitionDemo } from './demos/use-transition';
import { ActivityComponentDemo } from './demos/activity-component';
import { UseEffectEventDemo } from './demos/use-effect-event';
import { PartialPreRenderingDemo } from './demos/partial-pre-rendering';
import { ServerComponentsAwarenessDemo } from './demos/server-components-awareness';
import { CustomFormDemo } from './demos/custom-form';
import { UseApiPromiseResolverDemo } from './demos/use-api-promise-resolver';
import { ResourceLoadingMetadataDemo } from './demos/resource-loading-metadata';
export type DemoMeta = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  accent: {
    bg: string;
    border: string;
    text: string;
    tag: string;
  };
  Component: () => JSX.Element;
};

export const react19DemoRegistry: DemoMeta[] = [
  {
    slug: 'use-action-state-basic',
    title: 'useActionState Basics',
    category: 'Forms',
    summary: 'Use actions to handle simple form submissions with built-in pending states.',
    accent: {
      bg: 'from-blue-500/10 to-blue-500/5',
      border: 'border-blue-400/60',
      text: 'text-blue-300',
      tag: 'bg-blue-500/20 text-blue-100',
    },
    Component: UseActionStateDemo,
  },
  {
    slug: 'use-action-state-advanced',
    title: 'useActionState Advanced',
    category: 'Forms',
    summary: 'Add validation, error surfaces, and status-driven resets for complex flows.',
    accent: {
      bg: 'from-sky-500/10 to-sky-500/5',
      border: 'border-sky-400/60',
      text: 'text-sky-300',
      tag: 'bg-sky-500/20 text-sky-100',
    },
    Component: UseActionStateAdvancedDemo,
  },
  {
    slug: 'use-optimistic',
    title: 'useOptimistic Todos',
    category: 'Optimistic UI',
    summary: 'Instantly render pending todos while the real mutation resolves.',
    accent: {
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-400/60',
      text: 'text-purple-300',
      tag: 'bg-purple-500/20 text-purple-100',
    },
    Component: UseOptimisticDemo,
  },
  {
    slug: 'use-transition',
    title: 'useTransition Search',
    category: 'Concurrency',
    summary: 'Split urgent typing from heavy filtering with startTransition.',
    accent: {
      bg: 'from-cyan-500/10 to-cyan-500/5',
      border: 'border-cyan-400/60',
      text: 'text-cyan-300',
      tag: 'bg-cyan-500/20 text-cyan-100',
    },
    Component: UseStartTransitionDemo,
  },
  {
    slug: 'activity-component',
    title: 'Activity Feed Pattern',
    category: 'Patterns',
    summary: 'Stack toast-like notifications using a lightweight activity component.',
    accent: {
      bg: 'from-green-500/10 to-green-500/5',
      border: 'border-green-400/60',
      text: 'text-green-300',
      tag: 'bg-green-500/20 text-green-100',
    },
    Component: ActivityComponentDemo,
  },
  {
    slug: 'use-effect-event',
    title: 'useEffectEvent Logging',
    category: 'Patterns',
    summary: 'Decouple stable event handlers from effects to avoid stale closures.',
    accent: {
      bg: 'from-indigo-500/10 to-indigo-500/5',
      border: 'border-indigo-400/60',
      text: 'text-indigo-300',
      tag: 'bg-indigo-500/20 text-indigo-100',
    },
    Component: UseEffectEventDemo,
  },
  {
    slug: 'partial-pre-rendering',
    title: 'Partial Pre-rendering',
    category: 'Rendering',
    summary: 'Blend static shells with streamed dynamic bits in one experience.',
    accent: {
      bg: 'from-orange-500/10 to-orange-500/5',
      border: 'border-orange-400/60',
      text: 'text-orange-300',
      tag: 'bg-orange-500/20 text-orange-100',
    },
    Component: PartialPreRenderingDemo,
  },
  {
    slug: 'server-components-awareness',
    title: 'Server Components Awareness',
    category: 'Architecture',
    summary: 'Contrast responsibilities of server/client components with live data.',
    accent: {
      bg: 'from-pink-500/10 to-pink-500/5',
      border: 'border-pink-400/60',
      text: 'text-pink-300',
      tag: 'bg-pink-500/20 text-pink-100',
    },
    Component: ServerComponentsAwarenessDemo,
  },
  {
    slug: 'custom-form',
    title: 'Custom Form Component',
    category: 'Forms',
    summary: 'Reusable form wrapper with React 19 actions, validation, and error handling.',
    accent: {
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-400/60',
      text: 'text-emerald-300',
      tag: 'bg-emerald-500/20 text-emerald-100',
    },
    Component: CustomFormDemo,
  },
  {
    slug: 'use-api-promise-resolver',
    title: 'use() API - Promise Resolver',
    category: 'Data Fetching',
    summary: 'Unwrap promises with use() hook for cleaner async data handling with Suspense.',
    accent: {
      bg: 'from-teal-500/10 to-teal-500/5',
      border: 'border-teal-400/60',
      text: 'text-teal-300',
      tag: 'bg-teal-500/20 text-teal-100',
    },
    Component: UseApiPromiseResolverDemo,
  },
  {
    slug: 'resource-loading-metadata',
    title: 'Resource Loading & Metadata',
    category: 'Performance',
    summary: 'Demonstrates React 19 resource loading with precedence, async scripts, and prerender hints for optimizing performance.',
    accent: {
      bg: 'from-teal-500/10 to-teal-500/5',
      border: 'border-teal-400/60',
      text: 'text-teal-300',
      tag: 'bg-teal-500/20 text-teal-100',
    },
    Component: ResourceLoadingMetadataDemo,
  },
];

/**
 * Find a React 19 demo by its slug.
 * @param slug - The demo slug to look up
 * @returns The demo metadata and component, or undefined if not found
 */
export function getReact19Demo(slug: string | undefined): DemoMeta | undefined {
  if (!slug) return undefined;
  return react19DemoRegistry.find((demo) => demo.slug === slug);
}

