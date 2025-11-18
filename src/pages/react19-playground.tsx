import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { NextPageWithLayout } from './_app';
import { react19DemoRegistry } from '~/features/react19/demos';

const DemoCard = ({ demo }: { demo: (typeof react19DemoRegistry)[number] }) => (
  <Link
    href={`/react19-playground/${demo.slug}`}
    className={`relative block rounded-2xl border ${demo.accent.border} bg-gradient-to-br ${demo.accent.bg} p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400`}
    aria-label={`Open ${demo.title}`}
    data-testid="react19-demo-card"
    data-demo-slug={demo.slug}
  >
    <div className="flex items-center justify-between mb-4">
      <p className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${demo.accent.tag}`}>
        {demo.category}
      </p>
      <span className={`text-sm font-medium ${demo.accent.text}`}>Explore →</span>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{demo.title}</h2>
    <p className="text-sm text-slate-200/90 leading-relaxed">{demo.summary}</p>
    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
      <span>Open demo</span>
      <span aria-hidden="true">↗</span>
    </div>
  </Link>
);

const React19PlaygroundPage: NextPageWithLayout = () => (
  <>
    <Head>
      <title>React 19.2 Features Playground</title>
      <meta name="description" content="Interactive playground for React 19.2 features" />
    </Head>

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">React 19.2 Features Playground</h1>
          <p className="text-xl text-gray-300 mb-6">Explore each feature-focused demo as its own dedicated lab.</p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              ← Back to Home
            </Link>
            <a
              href="https://react.dev/blog/2024/12/19/react-19-2-is-now-available"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Official Blog →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" data-testid="react19-demo-grid">
          {react19DemoRegistry.map((demo) => (
            <DemoCard key={demo.slug} demo={demo} />
          ))}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">How to use this playground</h2>
          <p className="text-gray-300 mb-6">
            Click any card to open a focused subpage dedicated to that feature. Each lab keeps the same layout, so you can
            share deep links with your team or use them while presenting React 19.2 concepts.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['useActionState', 'useActionState Advanced', 'useOptimistic', 'useTransition', 'startTransition', 'Activity Component', 'useEffectEvent', 'PPR Concepts', 'RSC Awareness'].map((chip) => (
              <span key={chip} className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

React19PlaygroundPage.getLayout = (page: ReactElement) => page;

export default React19PlaygroundPage;
