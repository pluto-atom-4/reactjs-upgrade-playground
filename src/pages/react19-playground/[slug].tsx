import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';
import { getReact19Demo } from '~/features/react19/demos';

const React19DemoDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const slug = router.isReady && typeof router.query.slug === 'string' ? router.query.slug : undefined;

  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <Head>
          <title>Loading demo • React 19 Playground</title>
        </Head>
        <p className="text-slate-300 animate-pulse">Loading playground demo…</p>
      </div>
    );
  }

  const demo = getReact19Demo(slug);

  if (!demo) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-6">
        <Head>
          <title>Demo not found • React 19 Playground</title>
        </Head>
        <h1 className="text-3xl font-bold">Demo not found</h1>
        <p className="text-slate-300">We couldn't find the requested playground lab.</p>
        <Link href="/react19-playground" className="px-6 py-3 bg-blue-600 rounded-lg font-semibold">
          ← Back to playground
        </Link>
      </div>
    );
  }

  const DemoComponent = demo.Component;

  return (
    <>
      <Head>
        <title>{demo.title} • React 19 Playground</title>
        <meta name="description" content={demo.summary} />
      </Head>
      <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">{demo.category}</p>
              <h1 className="text-4xl font-bold mt-1">{demo.title}</h1>
              <p className="text-slate-300 mt-2 max-w-2xl">{demo.summary}</p>
            </div>
            <Link href="/react19-playground" className="px-6 py-2 bg-slate-800 border border-slate-600 rounded-lg font-semibold hover:bg-slate-700 transition" data-testid="react19-back-link">
              ← All demos
            </Link>
          </div>

          <div className={`rounded-3xl border ${demo.accent.border} bg-slate-900/60 p-6 shadow-2xl`}>
            <DemoComponent />
          </div>
        </div>
      </div>
    </>
  );
};

React19DemoDetailPage.getLayout = (page: ReactElement) => page;

export default React19DemoDetailPage;
