"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { ColorTheme, ThemeMode, ThemeColors } from "./types";
import { colorThemes } from "./themes";

interface MobileMenuProps {
  isDark: boolean;
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  theme: ThemeColors;
  onThemeModeChange: (mode: ThemeMode) => void;
  onColorThemeChange: (color: ColorTheme) => void;
  onHistoryClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isDark,
  themeMode,
  colorTheme,
  theme,
  onThemeModeChange,
  onColorThemeChange,
  onHistoryClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleHistoryClick = () => {
    onHistoryClick();
    setIsOpen(false);
  };

  const handleThemeToggle = () => {
    onThemeModeChange(themeMode === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Floating Menu Button - Only visible on mobile, stacked above converter */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-40 lg:hidden flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all hover:scale-105 ${
          isDark ? theme.primary : theme.primaryLight
        }`}
        aria-label="Open mobile menu"
      >
        <Bars3Icon className="w-6 h-6 text-white" />
      </button>

      {/* Mobile Menu Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Menu Panel - Slide from bottom */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
            >
              <div
                className={`rounded-t-2xl shadow-2xl p-6 ${
                  isDark
                    ? "bg-gradient-to-br from-slate-900 to-slate-800"
                    : "bg-gradient-to-br from-white to-gray-50"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Settings
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                        : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                  {/* History Button */}
                  <button
                    onClick={handleHistoryClick}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    <ClockIcon className="w-6 h-6" />
                    <span className="font-medium">View History</span>
                  </button>

                  {/* Theme Mode Toggle */}
                  <button
                    onClick={handleThemeToggle}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    {isDark ? (
                      <SunIcon className="w-6 h-6" />
                    ) : (
                      <MoonIcon className="w-6 h-6" />
                    )}
                    <span className="font-medium">
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </span>
                  </button>

                  {/* Color Theme Section */}
                  <div
                    className={`p-4 rounded-lg ${
                      isDark
                        ? "bg-slate-800 border border-slate-700"
                        : "bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <SwatchIcon className="w-5 h-5" />
                      <span
                        className={`font-medium text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Color Theme
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(Object.keys(colorThemes) as Array<ColorTheme>).map(
                        (color) => {
                          const isSelected = colorTheme === color;
                          const themeColors = colorThemes[color];

                          // Extract color from the primary class
                          const getColorClass = (classStr: string) => {
                            const match = classStr.match(/bg-(\w+)-\d+/);
                            return match ? match[1] : color;
                          };

                          const colorName = getColorClass(themeColors.primary);

                          return (
                            <button
                              key={color}
                              onClick={() => onColorThemeChange(color)}
                              className={`relative h-12 rounded-lg transition-all ${
                                isSelected
                                  ? "ring-2 ring-offset-2 scale-105"
                                  : "hover:scale-105"
                              } ${
                                isSelected
                                  ? isDark
                                    ? "ring-white ring-offset-slate-900"
                                    : "ring-gray-900 ring-offset-white"
                                  : ""
                              }`}
                              style={{
                                backgroundColor: `var(--color-${colorName}-500)`,
                              }}
                              aria-label={`Select ${themeColors.name} theme`}
                            >
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                {/* Safe area padding for mobile devices */}
                <div className="h-safe-area-inset-bottom" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
