"use client";

import { LoadingSpinner } from "./LoadingSpinner";
import { ThemeColors, CalculationMode } from "./types";
import type { ValidationResult } from "./validation";

interface InputSectionProps {
  isDark: boolean;
  theme: ThemeColors;
  calculationMode: CalculationMode;
  ipInput: string;
  subnetIndex: string;
  desiredSubnets: string;
  desiredHosts: string;
  ipValidation: ValidationResult | null;
  subnetsValidation: ValidationResult | null;
  hostsValidation: ValidationResult | null;
  isCalculating: boolean;
  error: string;
  onModeChange: (mode: CalculationMode) => void;
  onIPInputChange: (value: string) => void;
  onSubnetIndexChange: (value: string) => void;
  onSubnetsInputChange: (value: string) => void;
  onHostsInputChange: (value: string) => void;
  onCalculate: () => void;
  onReset: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function InputSection({
  isDark,
  theme,
  calculationMode,
  ipInput,
  subnetIndex,
  desiredSubnets,
  desiredHosts,
  ipValidation,
  subnetsValidation,
  hostsValidation,
  isCalculating,
  error,
  onModeChange,
  onIPInputChange,
  onSubnetIndexChange,
  onSubnetsInputChange,
  onHostsInputChange,
  onCalculate,
  onReset,
  onKeyPress,
}: InputSectionProps) {
  return (
    <div
      className={`${
        isDark ? "bg-slate-800/80" : "bg-blue-50/50"
      } backdrop-blur rounded-lg p-6 mb-6 border ${
        isDark ? "border-slate-700" : "border-blue-200"
      }`}
    >
      {/* Calculation Mode Selector */}
      <div className="mb-4">
        <label
          className={`block text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          } mb-2`}
        >
          Calculation Mode
        </label>
        <div
          className="flex flex-col sm:flex-row gap-2"
          data-tour="calculation-mode"
        >
          <button
            onClick={() => onModeChange("manual")}
            className={`flex-1 py-2 px-4 rounded transition-colors text-sm sm:text-base ${
              calculationMode === "manual"
                ? `${isDark ? theme.primary : theme.primaryLight} text-white`
                : `${
                    isDark
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`
            }`}
          >
            Manual CIDR
          </button>
          <button
            onClick={() => onModeChange("subnets")}
            className={`flex-1 py-2 px-4 rounded transition-colors text-sm sm:text-base ${
              calculationMode === "subnets"
                ? `${isDark ? theme.primary : theme.primaryLight} text-white`
                : `${
                    isDark
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`
            }`}
          >
            By Subnets
          </button>
          <button
            onClick={() => onModeChange("hosts")}
            className={`flex-1 py-2 px-4 rounded transition-colors text-sm sm:text-base ${
              calculationMode === "hosts"
                ? `${isDark ? theme.primary : theme.primaryLight} text-white`
                : `${
                    isDark
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`
            }`}
          >
            By Hosts
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* IP Address Input */}
        <div>
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            } mb-2`}
          >
            {calculationMode === "manual"
              ? "Network Address Block"
              : "Network Address"}
          </label>
          <input
            type="text"
            id="ip-input"
            value={ipInput}
            onChange={(e) => onIPInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            className={`w-full ${
              isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
            } border-2 rounded px-4 py-2.5 transition-all ${
              ipValidation
                ? ipValidation.isValid
                  ? "border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-500/20"
                  : ipValidation.type === "error"
                  ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                  : ipValidation.type === "warning"
                  ? "border-yellow-500 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-500/20"
                  : "border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                : isDark
                ? "border-slate-600 focus:border-slate-500"
                : "border-gray-300 focus:border-gray-400"
            } focus:outline-none`}
            placeholder={
              calculationMode === "manual" ? "10.0.0.0/16" : "10.0.0.0"
            }
          />
          {ipValidation && (
            <p
              className={`mt-2 text-xs flex items-center gap-1.5 ${
                ipValidation.isValid
                  ? "text-green-500"
                  : ipValidation.type === "error"
                  ? "text-red-500"
                  : ipValidation.type === "warning"
                  ? "text-yellow-500"
                  : "text-blue-500"
              }`}
            >
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  ipValidation.isValid
                    ? "bg-green-500"
                    : ipValidation.type === "error"
                    ? "bg-red-500"
                    : ipValidation.type === "warning"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
              />
              {ipValidation.message}
            </p>
          )}
        </div>

        {/* Manual Mode - Subnet Index */}
        {calculationMode === "manual" && (
          <div>
            <label
              className={`block text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              Subnet Index (optional)
            </label>
            <input
              type="text"
              value={subnetIndex}
              onChange={(e) => onSubnetIndexChange(e.target.value)}
              onKeyPress={onKeyPress}
              className={`w-full ${
                isDark
                  ? "bg-slate-900 border-slate-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } border rounded px-4 py-2.5 ${
                theme.primaryFocus
              } focus:outline-none focus:ring-1 ${theme.primaryRing}`}
              placeholder="11"
            />
            <p
              className={`mt-1.5 text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Enter a subnet number to highlight it in the ranges table below
            </p>
          </div>
        )}

        {/* Subnets Mode */}
        {calculationMode === "subnets" && (
          <>
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Number of Subnets Needed
              </label>
              <input
                type="number"
                value={desiredSubnets}
                onChange={(e) => onSubnetsInputChange(e.target.value)}
                onKeyPress={onKeyPress}
                className={`w-full ${
                  isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
                } border-2 rounded px-4 py-2.5 transition-all ${
                  subnetsValidation
                    ? subnetsValidation.isValid
                      ? "border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-500/20"
                      : subnetsValidation.type === "error"
                      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                      : "border-yellow-500 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-500/20"
                    : isDark
                    ? "border-slate-600 focus:border-slate-500"
                    : "border-gray-300 focus:border-gray-400"
                } focus:outline-none`}
                placeholder="64"
                min="1"
              />
              {subnetsValidation && (
                <p
                  className={`mt-2 text-xs flex items-center gap-1.5 ${
                    subnetsValidation.isValid
                      ? "text-green-500"
                      : subnetsValidation.type === "error"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      subnetsValidation.isValid
                        ? "bg-green-500"
                        : subnetsValidation.type === "error"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  {subnetsValidation.message}
                </p>
              )}
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Subnet Index (optional)
              </label>
              <input
                type="text"
                value={subnetIndex}
                onChange={(e) => onSubnetIndexChange(e.target.value)}
                onKeyPress={onKeyPress}
                className={`w-full ${
                  isDark
                    ? "bg-slate-900 border-slate-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border rounded px-4 py-2.5 ${
                  theme.primaryFocus
                } focus:outline-none focus:ring-1 ${theme.primaryRing}`}
                placeholder="11"
              />
              <p
                className={`mt-1.5 text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Enter a subnet number to highlight it in the ranges table below
              </p>
            </div>
          </>
        )}

        {/* Hosts Mode */}
        {calculationMode === "hosts" && (
          <>
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Number of Hosts Needed
              </label>
              <input
                type="number"
                value={desiredHosts}
                onChange={(e) => onHostsInputChange(e.target.value)}
                onKeyPress={onKeyPress}
                className={`w-full ${
                  isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
                } border-2 rounded px-4 py-2.5 transition-all ${
                  hostsValidation
                    ? hostsValidation.isValid
                      ? "border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-500/20"
                      : hostsValidation.type === "error"
                      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                      : "border-yellow-500 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-500/20"
                    : isDark
                    ? "border-slate-600 focus:border-slate-500"
                    : "border-gray-300 focus:border-gray-400"
                } focus:outline-none`}
                placeholder="250"
                min="1"
              />
              {hostsValidation && (
                <p
                  className={`mt-2 text-xs flex items-center gap-1.5 ${
                    hostsValidation.isValid
                      ? "text-green-500"
                      : hostsValidation.type === "error"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      hostsValidation.isValid
                        ? "bg-green-500"
                        : hostsValidation.type === "error"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  {hostsValidation.message}
                </p>
              )}
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Subnet Index (optional)
              </label>
              <input
                type="text"
                value={subnetIndex}
                onChange={(e) => onSubnetIndexChange(e.target.value)}
                onKeyPress={onKeyPress}
                className={`w-full ${
                  isDark
                    ? "bg-slate-900 border-slate-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border rounded px-4 py-2.5 ${
                  theme.primaryFocus
                } focus:outline-none focus:ring-1 ${theme.primaryRing}`}
                placeholder="11"
              />
              <p
                className={`mt-1.5 text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Enter a subnet number to highlight it in the ranges table below
              </p>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className={`flex-1 ${
            isDark ? theme.primary : theme.primaryLight
          } text-white font-semibold py-3 rounded transition-colors shadow-lg hover:opacity-90 text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isCalculating ? (
            <>
              <LoadingSpinner size="sm" isDark={isDark} />
              <span>Calculating...</span>
            </>
          ) : (
            "Calculate Subnet"
          )}
        </button>
        <button
          onClick={onReset}
          disabled={isCalculating}
          className={`sm:px-6 ${
            isDark
              ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
              : "bg-gray-300 hover:bg-gray-400 text-gray-800"
          } font-semibold py-3 rounded transition-colors shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Reset
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
