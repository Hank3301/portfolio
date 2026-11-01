'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative p-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
        aria-label="Toggle theme"
        disabled
      >
        <span className="sr-only">Toggle theme</span>
        <svg className="h-5 w-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>
    );
  }

  const themes = ['light', 'dark', 'system'] as const;
  const currentIndex = themes.indexOf(theme as typeof themes[number]);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  const icons = {
    light: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    dark: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    system: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  };

  const labels = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="relative p-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 group"
      aria-label={`Current theme: ${labels[theme as keyof typeof labels] || 'System'}. Click to switch to ${labels[nextTheme]}.`}
      title={`Theme: ${labels[theme as keyof typeof labels] || 'System'}`}
    >
      <span className="sr-only">Toggle theme</span>
      <span className="relative flex h-5 w-5 items-center justify-center">
        {Object.entries(icons).map(([key, icon]) => (
          <span
            key={key}
            className={`absolute transition-all duration-300 ease-out ${
              key === theme
                ? 'opacity-100 scale-100 rotate-0'
                : 'opacity-0 scale-50 -rotate-90'
            } group-hover:scale-110`}
          >
            {icon}
          </span>
        ))}
      </span>
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {labels[nextTheme]}
      </span>
    </button>
  );
}