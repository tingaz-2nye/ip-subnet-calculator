/**
 * localStorage utilities for IP Subnet Calculator
 */

import { STORAGE_KEYS, HISTORY } from "./constants";

export interface HistoryItem {
  id: string;
  timestamp: number;
  ipInput: string;
  mode: "manual" | "subnets" | "hosts";
  networkAddress: string;
  broadcastAddress: string;
  cidr: number;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
}

/**
 * Get calculation history from localStorage
 */
export function getCalculationHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading history from localStorage:", error);
    return [];
  }
}

/**
 * Save a calculation to history
 */
export function saveToHistory(item: Omit<HistoryItem, "id" | "timestamp">) {
  if (typeof window === "undefined") return;

  try {
    const history = getCalculationHistory();

    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add to beginning of array
    const updatedHistory = [newItem, ...history];

    // Keep only MAX_ITEMS
    const trimmedHistory = updatedHistory.slice(0, HISTORY.MAX_ITEMS);

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving to history:", error);
  }
}

/**
 * Clear calculation history
 */
export function clearHistory() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error("Error clearing history:", error);
  }
}

/**
 * Remove a specific item from history
 */
export function removeFromHistory(id: string) {
  if (typeof window === "undefined") return;

  try {
    const history = getCalculationHistory();
    const filtered = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing from history:", error);
  }
}

/**
 * Save theme preferences
 */
export function saveThemePreference(theme: string, mode: string) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.COLOR_THEME, theme);
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
  } catch (error) {
    console.error("Error saving theme preference:", error);
  }
}

/**
 * Get theme preferences
 */
export function getThemePreference(): {
  colorTheme: string | null;
  themeMode: string | null;
} {
  if (typeof window === "undefined")
    return { colorTheme: null, themeMode: null };

  try {
    return {
      colorTheme: localStorage.getItem(STORAGE_KEYS.COLOR_THEME),
      themeMode: localStorage.getItem(STORAGE_KEYS.THEME),
    };
  } catch (error) {
    console.error("Error reading theme preference:", error);
    return { colorTheme: null, themeMode: null };
  }
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString();
}
