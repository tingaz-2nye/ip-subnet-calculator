import { CalculationMode, ThemeColors } from "./types";
import { memo } from "react";

interface CalculationModeSelectorProps {
  calculationMode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void;
  isDark: boolean;
  theme: ThemeColors;
}

export const CalculationModeSelector = memo(function CalculationModeSelector({
  calculationMode,
  onModeChange,
  isDark,
  theme,
}: CalculationModeSelectorProps) {
  const modes: { value: CalculationMode; label: string }[] = [
    { value: "manual", label: "Manual CIDR" },
    { value: "subnets", label: "By Subnets" },
    { value: "hosts", label: "By Hosts" },
  ];

  return (
    <div className="mb-4">
      <label
        className={`block text-sm font-medium ${
          isDark ? "text-gray-300" : "text-gray-700"
        } mb-2`}
      >
        Calculation Mode
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            className={`flex-1 py-2 px-4 rounded transition-colors text-sm sm:text-base ${
              calculationMode === mode.value
                ? `${isDark ? theme.primary : theme.primaryLight} text-white`
                : `${
                    isDark
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
});
