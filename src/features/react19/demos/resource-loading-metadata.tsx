import { useCallback, useState } from 'react';
import type { JSX } from 'react';

type ResourceLoadingDemoState = {
  activeTab: 'precedence' | 'async-script' | 'prerender';
  resourceStatus: Record<string, 'pending' | 'loaded' | 'failed'>;
  fontLoadingMessage: string;
  scriptExecutionLog: string[];
  prerenderStatus: 'idle' | 'preparing' | 'prerendered' | 'rendered';
};

/**
 * ResourceLoadingMetadataDemo - Demonstrates React 19's Resource Loading and Metadata Features
 *
 * 1. PRECEDENCE
 *    - React 19 allows developers to declare resource loading order
 *    - Styles, fonts, and scripts can be marked with precedence levels
 *    - default precedence: 'default' | 'high' | 'low'
 *    - Higher precedence resources load and apply before lower precedence ones
 *    - Prevents layout shifts and FOUT (Flash of Unstyled Text)
 *    - Example: Critical fonts get 'high', analytics gets 'low'
 *
 * 2. ASYNC SCRIPTS
 *    - React 19 supports async script loading without blocking rendering
 *    - Multiple async scripts can load in parallel
 *    - Scripts with async=true execute when loaded, not in order
 *    - Use cases: Analytics, third-party widgets, non-critical enhancements
 *    - Improves Core Web Vitals (LCP - Largest Contentful Paint)
 *    - Scripts can communicate back via postMessage or global events
 *
 * 3. PRERENDER
 *    - React 19 introduces hints for server-side prerendering decisions
 *    - prerender prop indicates which components/routes should be pre-rendered
 *    - Helps Next.js and other metaframeworks optimize build time
 *    - Reduces Time to First Byte (TTFB) for commonly visited pages
 *    - Useful for ecommerce product listings, blog archives
 *    - Server can skip prerendering low-priority dynamic content
 *
 * KEY INTEGRATION POINTS:
 * - Resource declarations typically happen via JSX or head helpers
 * - Suspense boundaries can wrap resource-dependent content
 * - Resource loading status can be observed via load/error events
 * - Works seamlessly with Next.js 14+ and other React 19 metaframeworks
 */

export const ResourceLoadingMetadataDemo = (): JSX.Element => {
  const [state, setState] = useState<ResourceLoadingDemoState>({
    activeTab: 'precedence',
    resourceStatus: {
      googleFont: 'pending',
      segoeUIFont: 'pending',
      analyticsScript: 'pending',
      thirdPartyWidget: 'pending',
    },
    fontLoadingMessage: 'Waiting for font resources...',
    scriptExecutionLog: [],
    prerenderStatus: 'idle',
  });

  const simulateFontLoading = useCallback(() => {
    setState((prev) => ({
      ...prev,
      fontLoadingMessage: 'Loading fonts with precedence priority...',
      resourceStatus: {
        ...prev.resourceStatus,
        googleFont: 'pending',
        segoeUIFont: 'pending',
      },
    }));

    // Simulate precedence: high-priority font loads first
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        resourceStatus: {
          ...prev.resourceStatus,
          googleFont: 'loaded',
        },
        fontLoadingMessage: 'High-precedence Google Font loaded (Critical for text rendering)',
      }));
    }, 600);

    // Lower-precedence font loads after
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        resourceStatus: {
          ...prev.resourceStatus,
          segoeUIFont: 'loaded',
        },
        fontLoadingMessage: 'Low-precedence system font loaded (Secondary styling)',
      }));
    }, 1200);
  }, []);

  const simulateAsyncScriptLoading = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scriptExecutionLog: [
        '📋 Initiating async script loading...',
        '⚡ Non-blocking parallel load started',
      ],
      resourceStatus: {
        ...prev.resourceStatus,
        analyticsScript: 'pending',
        thirdPartyWidget: 'pending',
      },
    }));

    // Simulate async script 1 - analytics (can fail independently)
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        resourceStatus: {
          ...prev.resourceStatus,
          analyticsScript: 'loaded',
        },
        scriptExecutionLog: [
          ...prev.scriptExecutionLog,
          '✓ Analytics script loaded asynchronously (non-blocking)',
          '  → Tracking events to backend',
          '  → Core Web Vitals: LCP not affected',
        ],
      }));
    }, 800);

    // Simulate async script 2 - third party widget
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        resourceStatus: {
          ...prev.resourceStatus,
          thirdPartyWidget: 'loaded',
        },
        scriptExecutionLog: [
          ...prev.scriptExecutionLog,
          '✓ Third-party widget loaded asynchronously',
          '  → Interactive elements enhanced',
          '  → FID (First Input Delay) optimized',
        ],
      }));
    }, 1100);
  }, []);

  const simulatePrerenderFlow = useCallback(() => {
    setState((prev) => ({
      ...prev,
      prerenderStatus: 'preparing',
      scriptExecutionLog: [
        '🔧 Prerender preparation started...',
        '📊 Analyzing route priority...',
      ],
    }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        prerenderStatus: 'prerendered',
        scriptExecutionLog: [
          ...prev.scriptExecutionLog,
          '✓ High-priority routes prerendered:',
          '  → /product-listing (ecommerce category)',
          '  → /blog (popular blog posts)',
          '  → /pricing (conversion page)',
          '⏭️ Low-priority routes deferred:',
          '  → /user-dashboard (personalized)',
          '  → /admin-panel (authenticated only)',
        ],
      }));
    }, 1500);

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        prerenderStatus: 'rendered',
        scriptExecutionLog: [
          ...prev.scriptExecutionLog,
          '✨ Build complete!',
          '  → Prerendered pages: 45',
          '  → Build time: 18.5s',
          '  → Total size: 2.3MB',
        ],
      }));
    }, 2800);
  }, []);

  const resetState = useCallback(() => {
    setState({
      activeTab: 'precedence',
      resourceStatus: {
        googleFont: 'pending',
        segoeUIFont: 'pending',
        analyticsScript: 'pending',
        thirdPartyWidget: 'pending',
      },
      fontLoadingMessage: 'Waiting for font resources...',
      scriptExecutionLog: [],
      prerenderStatus: 'idle',
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Resource Loading & Metadata</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Demonstrates React 19 resource loading with precedence, async scripts, and prerender hints
          for optimizing performance and build efficiency.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {(['precedence', 'async-script', 'prerender'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setState((prev) => ({ ...prev, activeTab: tab }))}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              state.activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab === 'precedence' && '⚖️ Precedence'}
            {tab === 'async-script' && '⚡ Async Scripts'}
            {tab === 'prerender' && '✨ Prerender'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        {/* Precedence Tab */}
        {state.activeTab === 'precedence' && (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Resource Precedence Control</h3>
              <p className="text-gray-400 text-sm">
                React 19 allows declaring resource loading order to prevent layout shifts and FOUT. Higher precedence resources load first.
              </p>
            </div>

            {/* Precedence Visualization */}
            <div className="space-y-3">
              {/* High Precedence */}
              <div className="border border-blue-400 rounded-lg p-4 bg-blue-900/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded ${state.resourceStatus.googleFont === 'loaded' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="font-mono text-sm text-blue-300">precedence: "high"</span>
                </div>
                <p className="text-sm text-gray-300">Google Font (Critical Typography)</p>
                <div className="text-xs text-gray-400 mt-1">Status: {state.resourceStatus.googleFont}</div>
              </div>

              {/* Low Precedence */}
              <div className="border border-yellow-400 rounded-lg p-4 bg-yellow-900/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded ${state.resourceStatus.segoeUIFont === 'loaded' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="font-mono text-sm text-yellow-300">precedence: "low"</span>
                </div>
                <p className="text-sm text-gray-300">System Font (Fallback Styling)</p>
                <div className="text-xs text-gray-400 mt-1">Status: {state.resourceStatus.segoeUIFont}</div>
              </div>
            </div>

            {/* Message Display */}
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 min-h-12 flex items-center">
              <p className="text-gray-300">{state.fontLoadingMessage}</p>
            </div>

            {/* Action Button */}
            <div className="flex gap-2">
              <button
                onClick={simulateFontLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Simulate Loading
              </button>
              <button
                onClick={resetState}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition"
              >
                Reset
              </button>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 mt-4">
              <p className="text-xs font-mono text-gray-400 mb-2">JSX Example:</p>
              <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap break-words">
{`<link
  rel="preload"
  href="https://fonts.googleapis.com/css2?family=Roboto"
  as="style"
  precedence="high"
/>
<link
  rel="preload"
  href="system-font.css"
  as="style"
  precedence="low"
/>`}
              </pre>
            </div>
          </div>
        )}

        {/* Async Scripts Tab */}
        {state.activeTab === 'async-script' && (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Async Script Loading</h3>
              <p className="text-gray-400 text-sm">
                React 19 supports parallel async script loading without blocking page rendering. Improves Core Web Vitals like LCP.
              </p>
            </div>

            {/* Script Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Analytics Script */}
              <div className="border border-purple-400 rounded-lg p-4 bg-purple-900/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded ${state.resourceStatus.analyticsScript === 'loaded' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="font-mono text-sm text-purple-300">async</span>
                </div>
                <p className="text-sm text-gray-300">Analytics Script</p>
                <p className="text-xs text-gray-400 mt-1">Non-blocking, loads in parallel</p>
                <div className="text-xs text-gray-500 mt-2">Status: {state.resourceStatus.analyticsScript}</div>
              </div>

              {/* Third-party Widget */}
              <div className="border border-pink-400 rounded-lg p-4 bg-pink-900/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded ${state.resourceStatus.thirdPartyWidget === 'loaded' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="font-mono text-sm text-pink-300">async</span>
                </div>
                <p className="text-sm text-gray-300">Third-party Widget</p>
                <p className="text-xs text-gray-400 mt-1">Independent execution, fails gracefully</p>
                <div className="text-xs text-gray-500 mt-2">Status: {state.resourceStatus.thirdPartyWidget}</div>
              </div>
            </div>

            {/* Execution Log */}
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 min-h-32">
              <p className="text-xs font-mono text-gray-400 mb-2">Execution Log:</p>
              <div className="space-y-1">
                {state.scriptExecutionLog.length > 0 ? (
                  state.scriptExecutionLog.map((log, idx) => (
                    <p key={idx} className="text-xs text-gray-300 font-mono">
                      {log}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Click "Simulate Loading" to see execution details...</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={simulateAsyncScriptLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
              >
                Simulate Async Loading
              </button>
              <button
                onClick={resetState}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition"
              >
                Reset
              </button>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 mt-4">
              <p className="text-xs font-mono text-gray-400 mb-2">JSX Example:</p>
              <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap break-words">
{`<script
  src="https://analytics.example.com/track.js"
  async
/>
<script
  src="https://widget.example.com/embed.js"
  async
  onLoad={() => console.log('Widget ready')}
/>`}
              </pre>
            </div>
          </div>
        )}

        {/* Prerender Tab */}
        {state.activeTab === 'prerender' && (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Prerender Hints</h3>
              <p className="text-gray-400 text-sm">
                React 19 introduces prerender hints to help metaframeworks optimize server-side prerendering decisions.
              </p>
            </div>

            {/* Prerender Status */}
            <div className="space-y-3">
              {(['idle', 'preparing', 'prerendered', 'rendered'] as const).map((status) => (
                <div
                  key={status}
                  className={`border rounded-lg p-4 transition ${
                    state.prerenderStatus === status
                      ? 'border-green-400 bg-green-900/20'
                      : state.prerenderStatus === 'rendered' ||
                          (['idle', 'preparing', 'prerendered'].includes(status) &&
                            (['prerendered', 'rendered'].includes(state.prerenderStatus)))
                        ? 'border-gray-500 bg-gray-900/20'
                        : 'border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        state.prerenderStatus === status || ['prerendered', 'rendered'].includes(state.prerenderStatus)
                          ? 'bg-green-500'
                          : 'bg-gray-500'
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-300 capitalize">{status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Build Statistics */}
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
              <p className="text-xs font-mono text-gray-400 mb-3">Build Output:</p>
              <div className="space-y-1">
                {state.scriptExecutionLog.length > 0 ? (
                  state.scriptExecutionLog.map((log, idx) => (
                    <p key={idx} className="text-xs text-gray-300 font-mono">
                      {log}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Click "Start Prerender Simulation" to see build process...</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={simulatePrerenderFlow}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                disabled={state.prerenderStatus !== 'idle'}
              >
                Start Prerender Simulation
              </button>
              <button
                onClick={resetState}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition"
              >
                Reset
              </button>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 mt-4">
              <p className="text-xs font-mono text-gray-400 mb-2">JSX Example (Next.js):</p>
              <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap break-words">
{`// High priority - prerender these pages
export const PrerenderedProductListing = () => (
  <PrerenderedRoute>
    {/* Product listing component */}
  </PrerenderedRoute>
);

// Low priority - skip prerendering
export const UserDashboard = ({ userId }) => (
  <DynamicRoute prerender={false}>
    {/* Personalized dashboard */}
  </DynamicRoute>
);`}
              </pre>
            </div>

            {/* Benefits Section */}
            <div className="bg-green-900/30 border border-green-400 rounded-lg p-4">
              <p className="text-sm font-medium text-green-300 mb-2">Benefits of Prerender Hints:</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Faster Time to First Byte (TTFB)</li>
                <li>• Reduced server load by precomputing pages</li>
                <li>• Better SEO for static-friendly content</li>
                <li>• Selective prerendering of high-value routes</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Reference Notes */}
      <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📚 Resource Loading Key Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-blue-300">Precedence Benefits</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Prevents FOUT (Flash of Unstyled Text)</li>
              <li>• Avoids layout shifts during load</li>
              <li>• Improves perceived performance</li>
              <li>• Better CLS (Cumulative Layout Shift)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-purple-300">Async Scripts Benefits</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Non-blocking page rendering</li>
              <li>• Better LCP scores</li>
              <li>• Parallel script execution</li>
              <li>• Independent failure handling</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-green-300">Prerender Benefits</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Reduced server CPU at runtime</li>
              <li>• Faster TTFB for common pages</li>
              <li>• Better for ecommerce listings</li>
              <li>• Efficient build time management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

