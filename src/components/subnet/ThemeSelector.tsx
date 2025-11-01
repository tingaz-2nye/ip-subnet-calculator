import { PaintBrushIcon, CheckIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import { ColorTheme, ThemeColors } from "./types";
import { colorThemes } from "./themes";

interface ThemeSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  currentTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
  isDark: boolean;
}

// Color badges for each theme
const themeColors: Record<ColorTheme, string> = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
  rose: "bg-rose-500",
  indigo: "bg-indigo-500",
};

export const ThemeSelector = memo(function ThemeSelector({
  isOpen,
  onToggle,
  currentTheme,
  onThemeChange,
  isDark,
}: ThemeSelectorProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-50 p-3 sm:p-4 rounded-full transition-all shadow-xl hover:shadow-2xl border-2 transform hover:scale-110 ${
          isDark
            ? "bg-slate-800 hover:bg-slate-700 text-purple-400 border-purple-400/30 hover:border-purple-400/50"
            : "bg-white hover:bg-gray-50 text-purple-600 border-purple-400/40 hover:border-purple-500/60"
        } ${isOpen ? "ring-4 ring-purple-400/30 scale-105" : ""}`}
        title="Change theme color"
        aria-label="Change theme color"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <PaintBrushIcon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" />
      </button>

      {isOpen && (
        <div
          className={`fixed right-4 sm:right-6 top-20 sm:top-24 z-50 p-4 rounded-lg shadow-2xl border-2 ${
            isDark
              ? "bg-slate-800 border-slate-600"
              : "bg-white border-gray-300"
          }`}
          role="menu"
          aria-label="Theme color options"
        >
          <h3
            className={`text-sm font-semibold mb-3 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Theme Colors
          </h3>
          <div className="space-y-2 w-40 sm:w-48">
            {(Object.keys(colorThemes) as ColorTheme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => onThemeChange(theme)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all border ${
                  currentTheme === theme
                    ? isDark
                      ? "bg-slate-700 border-slate-600 shadow-md"
                      : "bg-gray-100 border-gray-300 shadow-md"
                    : isDark
                    ? "hover:bg-slate-700 text-gray-300 border-transparent hover:border-slate-600"
                    : "hover:bg-gray-100 text-gray-700 border-transparent hover:border-gray-300"
                }`}
                role="menuitemradio"
                aria-checked={currentTheme === theme}
                aria-label={`Select ${colorThemes[theme].name} theme`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${themeColors[theme]} ${
                      currentTheme === theme
                        ? "ring-2 ring-white shadow-lg scale-110"
                        : "opacity-70"
                    } transition-all`}
                  />
                  <span
                    className={`text-sm ${
                      currentTheme === theme ? "font-semibold" : ""
                    }`}
                  >
                    {colorThemes[theme].name}
                  </span>
                </div>
                {currentTheme === theme && (
                  <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
});
