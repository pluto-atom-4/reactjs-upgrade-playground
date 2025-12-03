import { createContext, useState, type JSX, useContext } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

/**
 * React 19: Context as a Provider
 *
 * In React 19, Context objects can now be used directly as providers.
 * Previously, you had to create a separate provider component.
 * Now you can use `<Context>` instead of `<Context.Provider>`.
 *
 * Benefits:
 * - Simpler, more intuitive API
 * - Less boilerplate code
 * - Cleaner component hierarchies
 * - Reduced cognitive overhead
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Custom hook to access the theme context.
 * Throws if used outside of the context provider.
 */
const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContext provider');
  }
  return context;
};

/**
 * A component that consumes the theme context.
 * Demonstrates how Context.Provider is now used directly.
 */
const ThemedCard = (): JSX.Element => {
  const { theme } = useTheme();

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200 text-gray-900'
          : 'bg-gray-800 border-gray-600 text-white'
      }`}
    >
      <h4 className="font-semibold mb-2">Themed Content</h4>
      <p className="text-sm">This component's styling is driven by context.</p>
      <p className="text-xs mt-2 opacity-75">Current theme: {theme}</p>
    </div>
  );
};

/**
 * Nested consumer to show context propagation
 */
const ThemeIndicator = (): JSX.Element => {
  const { theme } = useTheme();

  return (
    <div
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
        theme === 'light'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-blue-900 text-blue-100'
      }`}
    >
      ● {theme.toUpperCase()}
    </div>
  );
};

export const ContextAsProviderDemo = (): JSX.Element => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    // React 19: Context used directly as a provider
    // Previously: <ThemeContext.Provider value={{ theme, setTheme }}>
    <ThemeContext value={{ theme, setTheme }}>
      <div
        className={`border-2 rounded-lg p-6 space-y-4 transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-900 border-slate-700'
        }`}
      >
        <div>
          <h3
            className={`text-xl font-bold ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            Context as Provider - React 19
          </h3>
          <p
            className={`text-sm ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            Demonstrates React 19's simplified Context API where Context objects
            can be used directly as providers
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-sm font-medium ${
                theme === 'light' ? 'text-slate-700' : 'text-slate-200'
              }`}
            >
              Theme Mode:
            </span>
            <ThemeIndicator />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors ${
                theme === 'light'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                    : ''
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : theme === 'light'
                    ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                    : ''
              }`}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h4
            className={`text-sm font-semibold ${
              theme === 'light' ? 'text-slate-700' : 'text-slate-200'
            }`}
          >
            Context-Aware Components:
          </h4>
          <ThemedCard />
        </div>

        <div
          className={`p-3 rounded-md text-xs ${
            theme === 'light'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-blue-900/30 text-blue-200 border border-blue-700'
          }`}
        >
          <strong>Key Benefit:</strong> In React 19, you can use{' '}
          <code className="font-mono">&lt;ThemeContext value=&#123;&#123;...&#125;&#125; &gt;</code>{' '}
          directly instead of{' '}
          <code className="font-mono">&lt;ThemeContext.Provider value=&#123;&#123;...&#125;&#125; &gt;</code>
          . This makes the API simpler and more intuitive!
        </div>
      </div>
    </ThemeContext>
  );
};

