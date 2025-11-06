"use client";

import { useState } from "react";
import { ThemeColors } from "./types";

interface SubnetRange {
  subnetNumber: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  usableHosts: number;
}

interface QuickSubnetLookupProps {
  subnetRanges: SubnetRange[];
  isDark: boolean;
  theme: ThemeColors;
}

export default function QuickSubnetLookup({
  subnetRanges,
  isDark,
  theme,
}: QuickSubnetLookupProps) {
  const [quickLookupSubnet, setQuickLookupSubnet] = useState("");
  const [lookupResult, setLookupResult] = useState<SubnetRange | null>(null);

  const handleLookup = () => {
    const subnetNum = parseInt(quickLookupSubnet);
    if (subnetNum >= 1 && subnetNum <= subnetRanges.length) {
      const subnet = subnetRanges.find((s) => s.subnetNumber === subnetNum);
      setLookupResult(subnet || null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLookup();
    }
  };

  const clearResult = () => {
    setLookupResult(null);
    setQuickLookupSubnet("");
  };

  const getOrdinalSuffix = (num: number): string => {
    if (num === 1) return "st";
    if (num === 2) return "nd";
    if (num === 3) return "rd";
    return "th";
  };

  return (
    <div
      className={`${
        isDark ? "bg-slate-800/80" : "bg-blue-50/50"
      } backdrop-blur rounded-lg p-6 border ${
        isDark ? "border-slate-700" : "border-blue-200"
      }`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          isDark ? theme.heading : theme.headingLight
        }`}
      >
        🔍 Quick Subnet Lookup
      </h2>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex-1 w-full">
          <label
            htmlFor="quickLookup"
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Enter Subnet Number (1 - {subnetRanges.length})
          </label>
          <input
            id="quickLookup"
            type="number"
            min="1"
            max={subnetRanges.length}
            value={quickLookupSubnet}
            onChange={(e) => setQuickLookupSubnet(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 10, 1023, 2000..."
            className={`w-full px-4 py-2 rounded border ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            } focus:outline-none focus:ring-2 ${theme.primaryRing}`}
          />
        </div>
        <button
          onClick={handleLookup}
          disabled={
            !quickLookupSubnet ||
            parseInt(quickLookupSubnet) < 1 ||
            parseInt(quickLookupSubnet) > subnetRanges.length
          }
          className={`px-6 py-2 rounded font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark
              ? `${theme.primary} hover:opacity-90`
              : `${theme.primaryLight} hover:opacity-90`
          } text-white`}
        >
          Lookup
        </button>
      </div>

      {/* Lookup Result */}
      {lookupResult && (
        <div
          className={`mt-6 p-4 rounded-lg border-2 ${
            isDark
              ? "bg-slate-700/50 border-cyan-500/30"
              : "bg-white border-cyan-400/40"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-xl font-bold ${
                isDark ? "text-cyan-400" : "text-cyan-600"
              }`}
            >
              Subnet #{lookupResult.subnetNumber} Details
            </h3>
            <button
              onClick={clearResult}
              className={`text-sm px-3 py-1 rounded ${
                isDark
                  ? "bg-slate-600 hover:bg-slate-500 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Clear
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Subnet Range */}
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-slate-800/50" : "bg-blue-50"
              }`}
            >
              <h4
                className={`text-md font-bold mb-3 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                📊 Subnet Range
              </h4>
              <div className="space-y-3">
                <div>
                  <span
                    className={`text-xs font-semibold uppercase ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Network Address
                  </span>
                  <p
                    className={`font-mono text-lg font-bold ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {lookupResult.networkAddress}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold uppercase ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Broadcast Address
                  </span>
                  <p
                    className={`font-mono text-lg font-bold ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {lookupResult.broadcastAddress}
                  </p>
                </div>
                <div
                  className={`pt-2 border-t ${
                    isDark ? "border-slate-700" : "border-gray-200"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold uppercase ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Usable Hosts
                  </span>
                  <p
                    className={`text-lg font-bold ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {lookupResult.usableHosts.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Assignable Addresses */}
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-slate-800/50" : "bg-green-50"
              }`}
            >
              <h4
                className={`text-md font-bold mb-3 ${
                  isDark ? "text-green-400" : "text-green-600"
                }`}
              >
                💻 Assignable Host Addresses
              </h4>
              <div className="space-y-3">
                <div>
                  <span
                    className={`text-xs font-semibold uppercase ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    First Usable Host
                  </span>
                  <p
                    className={`font-mono text-lg font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {lookupResult.firstUsableHost}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold uppercase ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Last Usable Host
                  </span>
                  <p
                    className={`font-mono text-lg font-bold ${
                      isDark ? "text-orange-400" : "text-orange-600"
                    }`}
                  >
                    {lookupResult.lastUsableHost}
                  </p>
                </div>
                <div
                  className={`pt-2 border-t ${
                    isDark ? "border-slate-700" : "border-gray-200"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold uppercase ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Host Range
                  </span>
                  <p
                    className={`text-sm font-mono ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {lookupResult.firstUsableHost} -{" "}
                    {lookupResult.lastUsableHost}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Bar */}
          <div
            className={`mt-4 p-3 rounded-lg text-center ${
              isDark
                ? "bg-linear-to-r from-slate-800 to-slate-700"
                : "bg-linear-to-r from-blue-50 to-green-50"
            }`}
          >
            <p
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <span className="font-semibold">
                This is the {lookupResult.subnetNumber}
                {getOrdinalSuffix(lookupResult.subnetNumber)} subnet
              </span>{" "}
              with a range from{" "}
              <span
                className={`font-mono font-semibold ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {lookupResult.networkAddress}
              </span>{" "}
              to{" "}
              <span
                className={`font-mono font-semibold ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                {lookupResult.broadcastAddress}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
