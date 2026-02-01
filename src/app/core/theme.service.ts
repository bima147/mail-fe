import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'theme_mode';

  init() {
    const saved = localStorage.getItem(this.KEY) as ThemeMode | null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initial: ThemeMode = saved ?? (prefersDark ? 'dark' : 'light');
    this.setTheme(initial);
  }

  get current(): ThemeMode {
    return (
      (document.documentElement.getAttribute('data-theme') as ThemeMode) ||
      'dark'
    );
  }

  toggle() {
    this.setTheme(this.current === 'dark' ? 'light' : 'dark');
  }

  setTheme(mode: ThemeMode) {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(this.KEY, mode);
  }
}
