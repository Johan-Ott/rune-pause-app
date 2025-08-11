import { writable } from 'svelte/store';
import type { Language } from './translations.js';
import { getTranslations } from './translations.js';

// Default to Swedish
export const currentLanguage = writable<Language>('sv');
export const t = writable(getTranslations('sv'));

// Update translations when language changes
currentLanguage.subscribe(lang => {
  t.set(getTranslations(lang));
});

export function setLanguage(language: Language) {
  currentLanguage.set(language);
  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('mexro-language', language);
  }
}

// Load language from localStorage on startup
export function initializeLanguage() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mexro-language') as Language;
    if (saved && ['sv', 'en', 'pl', 'de', 'es'].includes(saved)) {
      setLanguage(saved);
    }
  }
}
