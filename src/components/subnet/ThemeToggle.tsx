import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import { ThemeMode } from "./types";

interface ThemeToggleProps {
  themeMode: ThemeMode;
  onToggle: () => void;
  isDark: boolean;
}

export const ThemeToggle = memo(function ThemeToggle({
  themeMode,
  onToggle,
  isDark,
}: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-4 sm:top-6 right-20 sm:right-24 z-50 p-3 sm:p-4 rounded-full transition-all shadow-xl hover:shadow-2xl border-2 transform hover:scale-110 ${
        isDark
          ? "bg-slate-800 hover:bg-slate-700 text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50"
          : "bg-white hover:bg-gray-50 text-amber-600 border-amber-400/40 hover:border-amber-500/60"
      }`}
      title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
      aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
      aria-pressed={themeMode === "light"}
    >
      {themeMode === "dark" ? (
        <SunIcon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" />
      ) : (
        <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" />
      )}
    </button>
  );
});
