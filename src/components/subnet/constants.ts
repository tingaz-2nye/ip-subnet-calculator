/**
 * Application Constants
 * Centralized configuration values for the IP Subnet Calculator
 */

// Toast notification durations (in milliseconds)
export const TOAST_DURATIONS = {
  SHORT: 1500,
  NORMAL: 2000,
  LONG: 3000,
  SUCCESS: 3000,
} as const;

// Pagination settings
export const PAGINATION = {
  DEFAULT_ITEMS_PER_PAGE: 15,
  ITEMS_PER_PAGE_OPTIONS: [10, 15, 25, 50, 100],
  DEFAULT_PAGE: 1,
} as const;

// Calculation history settings
export const HISTORY = {
  MAX_ITEMS: 10,
  STORAGE_KEY: "subnet_calculation_history",
} as const;

// Default input values
export const DEFAULTS = {
  IP_INPUT: "10.0.0.0/16",
  CALCULATION_MODE: "manual" as const,
  COLOR_THEME: "rose" as const,
  THEME_MODE: "dark" as const,
} as const;

// IP address validation
export const IP_VALIDATION = {
  MIN_OCTET: 0,
  MAX_OCTET: 255,
  MIN_CIDR: 0,
  MAX_CIDR: 32,
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  FOCUS_INPUT: "k",
  CALCULATE: "Enter",
  RESET: "r",
  ESCAPE: "Escape",
} as const;

// Animation durations (in seconds)
export const ANIMATIONS = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;

// Responsive breakpoints (matches Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// Toast positions
export const TOAST_POSITION = "bottom-right" as const;

// Class-based default CIDR values
export const DEFAULT_CIDR_BY_CLASS = {
  A: 8,
  B: 16,
  C: 24,
  D: 24,
  E: 24,
} as const;

// Export file naming
export const EXPORT = {
  CSV_EXTENSION: ".csv",
  JSON_EXTENSION: ".json",
  FILENAME_PREFIX: "subnet-",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "subnet_calc_theme",
  COLOR_THEME: "subnet_calc_color",
  HISTORY: "subnet_calculation_history",
  FAVORITES: "subnet_favorites",
} as const;
