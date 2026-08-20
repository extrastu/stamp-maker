import { UserPreferences } from '../types';
import { DEFAULT_PREFERENCES } from './constants';

const STORAGE_KEY = 'stamp_maker_preferences_v1';

export function loadPreferences(): UserPreferences {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load preferences from localStorage', e);
  }
  return DEFAULT_PREFERENCES;
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  try {
    const current = loadPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save preferences to localStorage', e);
  }
}
