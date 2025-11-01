export type ColorTheme =
  | "blue"
  | "emerald"
  | "purple"
  | "cyan"
  | "orange"
  | "rose"
  | "indigo";

export type ThemeMode = "dark" | "light";

export type CalculationMode = "manual" | "subnets" | "hosts";

export interface ThemeColors {
  name: string;
  primary: string;
  primaryLight: string;
  primaryBorder: string;
  primaryRing: string;
  primaryFocus: string;
  heading: string;
  headingLight: string;
  value: string;
  valueLight: string;
  highlight: string;
}

export interface PresetConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  ip: string;
  cidr: number;
  description: string;
}
