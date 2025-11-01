"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowsRightLeftIcon,
  AcademicCapIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ThemeColors } from "./types";

// Add custom scrollbar styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar.dark-scrollbar::-webkit-scrollbar-thumb {
      background: #475569;
      border-radius: 4px;
    }
    .custom-scrollbar.dark-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }
    .custom-scrollbar.light-scrollbar::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }
    .custom-scrollbar.light-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  `;
  if (!document.getElementById("custom-scrollbar-styles")) {
    style.id = "custom-scrollbar-styles";
    document.head.appendChild(style);
  }
}

interface NumberSystemConverterProps {
  isDark: boolean;
  theme: ThemeColors;
}

type NumberSystem = "binary" | "decimal" | "hexadecimal";

interface ConversionResult {
  binary: string;
  decimal: string;
  hexadecimal: string;
}

export const NumberSystemConverter: React.FC<NumberSystemConverterProps> = ({
  isDark,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputSystem, setInputSystem] = useState<NumberSystem>("decimal");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");
  const [showSteps, setShowSteps] = useState(false);

  const validateInput = (value: string, system: NumberSystem): boolean => {
    if (!value) return false;

    switch (system) {
      case "binary":
        return /^[01]+$/.test(value);
      case "decimal":
        return /^\d+$/.test(value);
      case "hexadecimal":
        return /^[0-9A-Fa-f]+$/.test(value);
      default:
        return false;
    }
  };

  const convert = () => {
    setError("");
    setResult(null);

    if (!validateInput(inputValue, inputSystem)) {
      setError(
        `Invalid ${inputSystem} input. Please check your value and try again.`
      );
      return;
    }

    try {
      let decimalValue: number;

      // Convert input to decimal first
      switch (inputSystem) {
        case "binary":
          decimalValue = parseInt(inputValue, 2);
          break;
        case "decimal":
          decimalValue = parseInt(inputValue, 10);
          break;
        case "hexadecimal":
          decimalValue = parseInt(inputValue, 16);
          break;
        default:
          throw new Error("Invalid number system");
      }

      if (isNaN(decimalValue) || decimalValue < 0) {
        setError("Invalid number. Please enter a positive number.");
        return;
      }

      // Convert to all systems
      setResult({
        binary: decimalValue.toString(2),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
      });
    } catch (err) {
      setError("Conversion failed. Please check your input.");
    }
  };

  const getConversionSteps = (): string[] => {
    if (!result || !inputValue) return [];

    const steps: string[] = [];
    const decimalValue = parseInt(result.decimal, 10);

    switch (inputSystem) {
      case "binary":
        steps.push(`Binary to Decimal:`);
        steps.push(`${inputValue} (base 2) = ?`);
        const binaryDigits = inputValue.split("").reverse();
        const calculation = binaryDigits
          .map((digit, idx) => `${digit} × 2^${idx}`)
          .reverse()
          .join(" + ");
        steps.push(`= ${calculation}`);
        const sum = binaryDigits
          .map((digit, idx) => parseInt(digit) * Math.pow(2, idx))
          .join(" + ");
        steps.push(`= ${sum}`);
        steps.push(`= ${decimalValue}`);
        break;

      case "decimal":
        steps.push(`Decimal to Binary (Division Method):`);
        steps.push(`Divide ${decimalValue} by 2 repeatedly:`);
        let num = decimalValue;
        const divisions: string[] = [];
        while (num > 0) {
          const remainder = num % 2;
          divisions.push(
            `${num} ÷ 2 = ${Math.floor(num / 2)}, remainder ${remainder}`
          );
          num = Math.floor(num / 2);
        }
        steps.push(...divisions);
        steps.push(`Read remainders from bottom to top: ${result.binary}`);
        break;

      case "hexadecimal":
        steps.push(`Hexadecimal to Decimal:`);
        steps.push(`${inputValue} (base 16) = ?`);
        const hexDigits = inputValue.toUpperCase().split("").reverse();
        const hexCalc = hexDigits
          .map((digit, idx) => {
            const val = parseInt(digit, 16);
            return `${val} × 16^${idx}`;
          })
          .reverse()
          .join(" + ");
        steps.push(`= ${hexCalc}`);
        const hexSum = hexDigits
          .map((digit, idx) => parseInt(digit, 16) * Math.pow(16, idx))
          .join(" + ");
        steps.push(`= ${hexSum}`);
        steps.push(`= ${decimalValue}`);
        break;
    }

    return steps;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      convert();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-medium transition-all hover:scale-105 ${
          isDark
            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
        }`}
        aria-label="Open number system converter"
      >
        <ArrowsRightLeftIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Converter</span>
      </button>

      {/* Converter Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex flex-col"
            >
              <div
                className={`relative flex-1 shadow-2xl overflow-hidden flex flex-col ${
                  isDark
                    ? "bg-linear-to-br from-slate-900 to-slate-800"
                    : "bg-linear-to-br from-white to-gray-50"
                }`}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                      : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                  aria-label="Close converter"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Content */}
                <div
                  className={`p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar ${
                    isDark ? "dark-scrollbar" : "light-scrollbar"
                  }`}
                  style={
                    {
                      scrollbarWidth: "thin",
                      scrollbarColor: isDark
                        ? "#475569 #1e293b"
                        : "#d1d5db #f3f4f6",
                    } as React.CSSProperties
                  }
                >
                  <div className="w-full max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div
                        className={`p-2 sm:p-3 rounded-xl ${
                          isDark
                            ? `${theme.highlight.split(" ")[0]} ${
                                isDark ? theme.heading : theme.headingLight
                              }`
                            : `${theme.highlight
                                .split(" ")[0]
                                .replace("/20", "/10")} ${theme.headingLight}`
                        }`}
                      >
                        <AcademicCapIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div>
                        <h2
                          className={`text-xl sm:text-2xl font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Number System Converter
                        </h2>
                        <p
                          className={`text-xs sm:text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Learn binary, decimal, hexadecimal conversions
                        </p>
                      </div>
                    </div>

                    {/* Reference Table */}
                    <div
                      className={`rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 ${
                        isDark
                          ? "bg-slate-800 border border-slate-700"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <h3
                        className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Quick Reference Table
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm">
                          <thead>
                            <tr
                              className={`border-b ${
                                isDark ? "border-slate-600" : "border-gray-300"
                              }`}
                            >
                              <th
                                className={`py-2 px-3 text-left font-semibold ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                Dec
                              </th>
                              <th
                                className={`py-2 px-3 text-left font-semibold ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                Hex
                              </th>
                              <th
                                className={`py-2 px-3 text-left font-semibold ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                Bin
                              </th>
                            </tr>
                          </thead>
                          <tbody className="font-mono">
                            {[
                              { dec: "00", hex: "0", bin: "0000" },
                              { dec: "01", hex: "1", bin: "0001" },
                              { dec: "02", hex: "2", bin: "0010" },
                              { dec: "03", hex: "3", bin: "0011" },
                              { dec: "04", hex: "4", bin: "0100" },
                              { dec: "05", hex: "5", bin: "0101" },
                              { dec: "06", hex: "6", bin: "0110" },
                              { dec: "07", hex: "7", bin: "0111" },
                              { dec: "08", hex: "8", bin: "1000" },
                              { dec: "09", hex: "9", bin: "1001" },
                              { dec: "10", hex: "A", bin: "1010" },
                              { dec: "11", hex: "B", bin: "1011" },
                              { dec: "12", hex: "C", bin: "1100" },
                              { dec: "13", hex: "D", bin: "1101" },
                              { dec: "14", hex: "E", bin: "1110" },
                              { dec: "15", hex: "F", bin: "1111" },
                            ].map((row) => (
                              <tr
                                key={row.dec}
                                className={
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                <td className="py-1.5 px-3">{row.dec}</td>
                                <td className="py-1.5 px-3">{row.hex}</td>
                                <td className="py-1.5 px-3">{row.bin}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Binary Position Values Helper */}
                    <div
                      className={`rounded-lg p-4 mb-6 ${
                        isDark
                          ? `${theme.highlight.split(" ")[0]} ${
                              theme.primaryBorder
                            }`
                          : `${theme.highlight
                              .split(" ")[0]
                              .replace("/20", "/10")} ${theme.primaryBorder}`
                      }`}
                    >
                      <h3
                        className={`text-sm font-semibold mb-3 ${
                          isDark ? theme.heading : theme.headingLight
                        }`}
                      >
                        8-Bit Binary Position Values
                      </h3>
                      <div className="overflow-x-auto">
                        <div className="min-w-max">
                          <div className="flex gap-1 mb-1">
                            {[7, 6, 5, 4, 3, 2, 1, 0].map((exp) => (
                              <div
                                key={exp}
                                className={`flex-1 text-center py-2 px-3 font-mono text-sm border ${
                                  isDark
                                    ? "border-blue-700 text-blue-300"
                                    : "border-blue-300 text-blue-700"
                                }`}
                              >
                                2^{exp}
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-1">
                            {[128, 64, 32, 16, 8, 4, 2, 1].map((val) => (
                              <div
                                key={val}
                                className={`flex-1 text-center py-2 px-3 font-mono text-sm font-bold border ${
                                  isDark
                                    ? "bg-blue-900/30 border-blue-700 text-blue-200"
                                    : "bg-blue-100 border-blue-300 text-blue-800"
                                }`}
                              >
                                {val}
                              </div>
                            ))}
                          </div>
                          <div
                            className={`mt-2 text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Tip: To convert binary to decimal, add the position
                            values where the bit is 1
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Input Section */}
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div>
                        <label
                          className={`block text-xs sm:text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Select Input Number System
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          {(
                            [
                              "binary",
                              "decimal",
                              "hexadecimal",
                            ] as NumberSystem[]
                          ).map((system) => (
                            <button
                              key={system}
                              onClick={() => {
                                setInputSystem(system);
                                setInputValue("");
                                setResult(null);
                                setError("");
                              }}
                              className={`px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                                inputSystem === system
                                  ? `${
                                      isDark
                                        ? theme.primary
                                        : theme.primaryLight
                                    } text-white`
                                  : isDark
                                  ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {system.charAt(0).toUpperCase() + system.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-xs sm:text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Enter{" "}
                          {inputSystem.charAt(0).toUpperCase() +
                            inputSystem.slice(1)}{" "}
                          Number
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                              setInputValue(e.target.value);
                              setError("");
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder={
                              inputSystem === "binary"
                                ? "e.g., 1010"
                                : inputSystem === "hexadecimal"
                                ? "e.g., A5"
                                : "e.g., 42"
                            }
                            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 font-mono text-base sm:text-lg focus:outline-none transition-colors ${
                              error
                                ? "border-red-500"
                                : isDark
                                ? `bg-slate-800 border-slate-700 text-white ${theme.primaryFocus}`
                                : `bg-white border-gray-300 text-gray-900 ${theme.primaryFocus}`
                            }`}
                          />
                          <button
                            onClick={convert}
                            className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors text-white ${
                              isDark ? theme.primary : theme.primaryLight
                            }`}
                          >
                            Convert
                          </button>
                        </div>
                        {error && (
                          <p className="mt-2 text-xs sm:text-sm text-red-500">
                            {error}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Results */}
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div
                          className={`rounded-lg p-4 ${
                            isDark
                              ? "bg-slate-800 border border-slate-700"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <h3
                            className={`text-lg font-semibold mb-3 ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Conversion Results
                          </h3>
                          <div className="space-y-2">
                            {Object.entries(result).map(([system, value]) => (
                              <div
                                key={system}
                                className={`flex justify-between items-center p-3 rounded ${
                                  isDark ? "bg-slate-900" : "bg-white"
                                }`}
                              >
                                <span
                                  className={`font-medium ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {system.charAt(0).toUpperCase() +
                                    system.slice(1)}
                                </span>
                                <span
                                  className={`font-mono text-lg ${
                                    isDark ? theme.value : theme.valueLight
                                  }`}
                                >
                                  {system === "hexadecimal" ? "0x" : ""}
                                  {system === "octal" ? "0o" : ""}
                                  {system === "binary" ? "0b" : ""}
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Show Steps Toggle */}
                        <button
                          onClick={() => setShowSteps(!showSteps)}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                            isDark
                              ? "bg-slate-800 hover:bg-slate-700 text-gray-300"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {showSteps ? "Hide" : "Show"} Conversion Steps
                        </button>

                        {/* Conversion Steps */}
                        <AnimatePresence>
                          {showSteps && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className={`rounded-lg p-4 overflow-hidden ${
                                isDark
                                  ? `${theme.highlight.split(" ")[0]} ${
                                      theme.primaryBorder
                                    }`
                                  : `${theme.highlight
                                      .split(" ")[0]
                                      .replace("/20", "/10")} ${
                                      theme.primaryBorder
                                    }`
                              }`}
                            >
                              <h4
                                className={`font-semibold mb-3 flex items-center gap-2 ${
                                  isDark ? theme.heading : theme.headingLight
                                }`}
                              >
                                <AcademicCapIcon className="w-5 h-5" />
                                Step-by-Step Explanation
                              </h4>
                              <div
                                className={`space-y-1 font-mono text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {getConversionSteps().map((step, idx) => (
                                  <div key={idx} className="pl-2">
                                    {step}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
