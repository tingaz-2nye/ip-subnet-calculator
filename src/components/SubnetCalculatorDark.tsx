"use client";

import { useState, useEffect } from "react";
import { calculateSubnetInfo, SubnetInfo } from "@/utils/subnetCalculations";
import {
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ThemeToggle,
  ThemeSelector,
  QuickPresets,
  KeyboardShortcutsHint,
  CalculationModeSelector,
  ResultCard,
  LoadingSpinner,
  HistoryPanel,
  IPClassBadge,
  KeyboardShortcutsModal,
  NetworkDiagram,
  Onboarding,
  getIPClass,
  colorThemes,
  exportToCSV,
  exportToJSON,
  copyToClipboard,
  validateIPInput,
  validateSubnetsInput,
  validateHostsInput,
  getCalculationHistory,
  saveToHistory,
  clearHistory,
  removeFromHistory,
  saveThemePreference,
  getThemePreference,
  TOAST_DURATIONS,
  TOAST_POSITION,
  PAGINATION,
  DEFAULTS,
  type ColorTheme,
  type ThemeMode,
  type CalculationMode,
  type ValidationResult,
  type HistoryItem,
} from "./subnet";

export default function SubnetCalculatorDark() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>("rose");
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [ipInput, setIpInput] = useState("10.0.0.0/16");
  const [subnetIndex, setSubnetIndex] = useState("");
  const [calculationMode, setCalculationMode] =
    useState<CalculationMode>("manual");
  const [desiredSubnets, setDesiredSubnets] = useState("");
  const [desiredHosts, setDesiredHosts] = useState("");
  const [showAllRanges, setShowAllRanges] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [result, setResult] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [ipValidation, setIpValidation] = useState<ValidationResult | null>(
    null
  );
  const [subnetsValidation, setSubnetsValidation] =
    useState<ValidationResult | null>(null);
  const [hostsValidation, setHostsValidation] =
    useState<ValidationResult | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const theme = colorThemes[colorTheme];
  const isDark = themeMode === "dark";

  // Load preferences and history on mount
  useEffect(() => {
    // Auto-detect system theme preference if no saved preference
    const prefs = getThemePreference();

    if (!prefs.themeMode) {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setThemeMode(prefersDark ? "dark" : "light");
    } else {
      setThemeMode(prefs.themeMode as ThemeMode);
    }

    if (prefs.colorTheme) setColorTheme(prefs.colorTheme as ColorTheme);

    setHistory(getCalculationHistory());

    // Check if this is the first visit
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    // Load from URL params (but don't auto-calculate to prevent history overload)
    const params = new URLSearchParams(window.location.search);
    const urlIp = params.get("ip");
    const urlMode = params.get("mode");
    const urlSubnets = params.get("subnets");
    const urlHosts = params.get("hosts");

    if (urlIp) {
      setIpInput(urlIp);
      if (urlMode) setCalculationMode(urlMode as CalculationMode);
      if (urlSubnets) setDesiredSubnets(urlSubnets);
      if (urlHosts) setDesiredHosts(urlHosts);
      // Note: User must manually click Calculate button
    }
  }, []);

  // Save theme preferences when changed
  useEffect(() => {
    saveThemePreference(colorTheme, themeMode);
  }, [colorTheme, themeMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ? - Show shortcuts modal
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
      // Ctrl/Cmd + / - Show onboarding tour
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setShowOnboarding(true);
      }
      // Ctrl/Cmd + K - Focus on IP input
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("ip-input")?.focus();
      }
      // Ctrl/Cmd + Enter - Calculate
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        calculate();
      }
      // Ctrl/Cmd + R - Reset (prevent browser refresh)
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
        resetCalculator();
      }
      // Ctrl/Cmd + H - Toggle history
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        setShowHistoryPanel(!showHistoryPanel);
      }
      // Ctrl/Cmd + E - Export
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        if (result) handleExportCSV();
      }
      // Escape - Clear focus/close panels
      if (e.key === "Escape") {
        setShowThemePanel(false);
        setShowHistoryPanel(false);
        setShowShortcutsModal(false);
        setShowOnboarding(false);
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    ipInput,
    calculationMode,
    desiredSubnets,
    desiredHosts,
    result,
    showHistoryPanel,
  ]);

  // Load preset
  const loadPreset = (
    ip: string,
    cidr: number,
    mode: "manual" | "subnets" | "hosts" = "manual"
  ) => {
    setIpInput(`${ip}/${cidr}`);
    setCalculationMode(mode);
    setDesiredSubnets("");
    setDesiredHosts("");
    setSubnetIndex("");
    setError("");
  };

  // Helper functions wrapped to use imported utilities
  const handleCopyToClipboard = (text: string, label: string) => {
    copyToClipboard(text, label);
  };

  const handleExportCSV = () => {
    if (result) exportToCSV(result);
  };

  const handleExportJSON = () => {
    if (result) exportToJSON(result);
  };

  const handleShareURL = () => {
    const url = window.location.href;
    copyToClipboard(url, "Share URL");
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
    toast.success("Welcome aboard! Let's calculate some subnets! 🎉", {
      position: TOAST_POSITION,
      autoClose: TOAST_DURATIONS.SUCCESS,
    });
  };

  // Validation handlers
  const handleIPInputChange = (value: string) => {
    setIpInput(value);
    const validation = validateIPInput(value, calculationMode);
    setIpValidation(validation);
  };

  const handleSubnetsInputChange = (value: string) => {
    setDesiredSubnets(value);
    const validation = validateSubnetsInput(value);
    setSubnetsValidation(validation);
  };

  const handleHostsInputChange = (value: string) => {
    setDesiredHosts(value);
    const validation = validateHostsInput(value);
    setHostsValidation(validation);
  };

  // Handle mode change and remove/add CIDR prefix
  const handleModeChange = (mode: CalculationMode) => {
    setCalculationMode(mode);

    // Remove prefix when switching to subnets or hosts mode
    if ((mode === "subnets" || mode === "hosts") && ipInput.includes("/")) {
      const newValue = ipInput.split("/")[0];
      setIpInput(newValue);
      setIpValidation(validateIPInput(newValue, mode));
    }
    // Add default prefix when switching back to manual mode
    else if (mode === "manual" && !ipInput.includes("/")) {
      const newValue = ipInput + "/24";
      setIpInput(newValue);
      setIpValidation(validateIPInput(newValue, mode));
    } else {
      setIpValidation(validateIPInput(ipInput, mode));
    }
  };

  // History handlers
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setIpInput(item.ipInput);
    setCalculationMode(item.mode);
    setShowHistoryPanel(false);
    // Trigger calculation
    setTimeout(() => calculate(), 100);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast.info("History cleared", {
      position: TOAST_POSITION,
      autoClose: TOAST_DURATIONS.SHORT,
    });
  };

  const handleRemoveHistoryItem = (id: string) => {
    removeFromHistory(id);
    setHistory(getCalculationHistory());
  };

  const calculateCIDRFromSubnets = (
    baseIP: string,
    baseClass: string,
    numSubnets: number
  ): number => {
    const defaultCIDR = baseClass === "A" ? 8 : baseClass === "B" ? 16 : 24;
    const bitsNeeded = Math.ceil(Math.log2(numSubnets));
    return defaultCIDR + bitsNeeded;
  };

  const calculateCIDRFromHosts = (numHosts: number): number => {
    const totalHostsNeeded = numHosts + 2; // +2 for network and broadcast
    const hostBits = Math.ceil(Math.log2(totalHostsNeeded));
    return 32 - hostBits;
  };

  const calculate = () => {
    if (!ipInput) {
      setError("Please enter an IP address with CIDR notation");
      return;
    }

    setError("");
    setSearchQuery(""); // Reset search when calculating
    setCurrentPage(1); // Reset to first page
    setIsCalculating(true);

    // Use setTimeout to allow UI to update with loading state
    setTimeout(() => {
      try {
        let ipAddress: string;
        let cidr: number;

        if (calculationMode === "manual") {
          const parts = ipInput.split("/");
          if (parts.length !== 2) {
            throw new Error("Please use format: IP/CIDR (e.g., 10.0.0.0/16)");
          }
          ipAddress = parts[0];
          cidr = parseInt(parts[1]);
        } else {
          // For subnets/hosts mode, just use the IP part
          ipAddress = ipInput.split("/")[0];

          // Get IP class to determine default CIDR
          const firstOctet = parseInt(ipAddress.split(".")[0]);
          const ipClass =
            firstOctet <= 126 ? "A" : firstOctet <= 191 ? "B" : "C";

          if (calculationMode === "subnets") {
            const numSubnets = parseInt(desiredSubnets);
            if (isNaN(numSubnets) || numSubnets < 1) {
              throw new Error("Please enter a valid number of subnets");
            }
            cidr = calculateCIDRFromSubnets(ipAddress, ipClass, numSubnets);
          } else {
            const numHosts = parseInt(desiredHosts);
            if (isNaN(numHosts) || numHosts < 1) {
              throw new Error("Please enter a valid number of hosts");
            }
            cidr = calculateCIDRFromHosts(numHosts);
          }
        }

        if (isNaN(cidr) || cidr < 0 || cidr > 32) {
          throw new Error("CIDR must be between 0 and 32");
        }

        const calculatedResult = calculateSubnetInfo(
          ipAddress,
          cidr,
          true,
          showAllRanges ? 100000 : 100 // Generate more ranges if showing all
        );
        setResult(calculatedResult);

        // Prepare the correct ipInput format for history
        const historyIpInput =
          calculationMode === "manual" ? `${ipAddress}/${cidr}` : ipAddress;

        // Save to history
        saveToHistory({
          ipInput: historyIpInput,
          mode: calculationMode,
          networkAddress: calculatedResult.networkAddress,
          broadcastAddress: calculatedResult.broadcastAddress,
          cidr: calculatedResult.cidr,
          totalHosts: calculatedResult.totalHosts,
          usableHosts: calculatedResult.usableHosts,
          subnetMask: calculatedResult.subnetMask,
        });
        setHistory(getCalculationHistory());

        // Update URL with calculation state for sharing
        const params = new URLSearchParams();
        params.set("ip", historyIpInput);
        params.set("mode", calculationMode);
        if (calculationMode === "subnets" && desiredSubnets) {
          params.set("subnets", desiredSubnets);
        }
        if (calculationMode === "hosts" && desiredHosts) {
          params.set("hosts", desiredHosts);
        }
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${params.toString()}`
        );

        toast.success("Subnet calculated successfully!", {
          position: TOAST_POSITION,
          autoClose: TOAST_DURATIONS.NORMAL,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Invalid IP or CIDR format!"
        );
        setResult(null);

        toast.error(
          err instanceof Error ? err.message : "Invalid IP or CIDR format!",
          {
            position: TOAST_POSITION,
            autoClose: TOAST_DURATIONS.LONG,
          }
        );
      } finally {
        setIsCalculating(false);
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calculate();
    }
  };

  const resetCalculator = () => {
    setIpInput("10.0.0.0/16");
    setSubnetIndex("");
    setDesiredSubnets("");
    setDesiredHosts("");
    setCalculationMode("manual");
    setResult(null);
    setError("");
    setCurrentPage(1);
    setShowAllRanges(false);

    toast.info("Calculator reset", {
      position: TOAST_POSITION,
      autoClose: TOAST_DURATIONS.SHORT,
    });
  };

  const isPrivate = (ip: string): boolean => {
    const octets = ip.split(".").map(Number);
    if (octets[0] === 10) return true;
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
    if (octets[0] === 192 && octets[1] === 168) return true;
    return false;
  };

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-linear-to-br from-slate-900 to-slate-800 text-white"
          : "bg-linear-to-br from-blue-50 via-white to-gray-50 text-gray-900"
      } flex flex-col items-center justify-center p-4 sm:p-6 md:p-8`}
    >
      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        theme={isDark ? "dark" : "light"}
        autoClose={3000}
      />

      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding isDark={isDark} onComplete={handleOnboardingComplete} />
      )}

      {/* Theme Controls */}
      <div data-tour="theme-controls">
        <ThemeToggle
          themeMode={themeMode}
          onToggle={() => setThemeMode(isDark ? "light" : "dark")}
          isDark={isDark}
        />

        <ThemeSelector
          isOpen={showThemePanel}
          onToggle={() => setShowThemePanel(!showThemePanel)}
          currentTheme={colorTheme}
          onThemeChange={(theme) => {
            setColorTheme(theme);
            setShowThemePanel(false);
          }}
          isDark={isDark}
        />
      </div>

      {/* History Button */}
      <button
        onClick={() => setShowHistoryPanel(!showHistoryPanel)}
        className={`fixed top-4 sm:top-6 left-4 sm:left-6 z-50 p-3 sm:p-4 rounded-full transition-all shadow-xl hover:shadow-2xl border-2 transform hover:scale-110 ${
          isDark
            ? "bg-slate-800 hover:bg-slate-700 text-cyan-400 border-cyan-400/30 hover:border-cyan-400/50"
            : "bg-white hover:bg-gray-50 text-cyan-600 border-cyan-400/40 hover:border-cyan-500/60"
        } ${showHistoryPanel ? "ring-4 ring-cyan-400/30 scale-105" : ""}`}
        title="View calculation history"
        aria-label="View calculation history"
        aria-expanded={showHistoryPanel}
        data-tour="history-button"
      >
        <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" />
        {history.length > 0 && (
          <span
            className={`absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center ${
              isDark ? "bg-cyan-500 text-white" : "bg-cyan-600 text-white"
            }`}
          >
            {history.length}
          </span>
        )}
      </button>

      {/* History Panel */}
      <HistoryPanel
        isOpen={showHistoryPanel}
        onClose={() => setShowHistoryPanel(false)}
        history={history}
        onSelectItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        onRemoveItem={handleRemoveHistoryItem}
        isDark={isDark}
      />

      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-300"
        } border w-full max-w-4xl shadow-xl rounded-2xl p-4 sm:p-6 md:p-8`}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            IPv4 Subnet Calculator
          </h1>
          <p
            className={`text-sm sm:text-base ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Calculate subnet details for any IPv4 network address block
          </p>
          <button
            onClick={() => setShowOnboarding(true)}
            className={`mt-3 text-sm font-medium transition-colors flex items-center gap-1.5 mx-auto ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            <AcademicCapIcon className="w-4 h-4" />
            New here? Take a quick tour
          </button>
        </div>

        {/* Quick Presets */}
        <div data-tour="quick-presets">
          <QuickPresets onLoadPreset={loadPreset} isDark={isDark} />
        </div>

        {/* Keyboard Shortcuts Hint */}
        <KeyboardShortcutsHint isDark={isDark} />

        {/* Input Section */}
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
                onClick={() => handleModeChange("manual")}
                className={`flex-1 py-2 px-4 rounded transition-colors text-sm sm:text-base ${
                  calculationMode === "manual"
                    ? `${
                        isDark ? theme.primary : theme.primaryLight
                      } text-white`
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
                onClick={() => handleModeChange("subnets")}
                className={`flex-1 py-2 px-4 rounded transition-colors text-sm sm:text-base ${
                  calculationMode === "subnets"
                    ? `${
                        isDark ? theme.primary : theme.primaryLight
                      } text-white`
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
                onClick={() => handleModeChange("hosts")}
                className={`flex-1 py-2 px-4 rounded transition-colors text-sm sm:text-base ${
                  calculationMode === "hosts"
                    ? `${
                        isDark ? theme.primary : theme.primaryLight
                      } text-white`
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
                onChange={(e) => handleIPInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
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
                  onChange={(e) => setSubnetIndex(e.target.value)}
                  onKeyPress={handleKeyPress}
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
                  Enter a subnet number to highlight it in the ranges table
                  below
                </p>
              </div>
            )}

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
                    onChange={(e) => handleSubnetsInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full ${
                      isDark
                        ? "bg-slate-900 text-white"
                        : "bg-white text-gray-900"
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
                    onChange={(e) => setSubnetIndex(e.target.value)}
                    onKeyPress={handleKeyPress}
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
                    Enter a subnet number to highlight it in the ranges table
                    below
                  </p>
                </div>
              </>
            )}

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
                    onChange={(e) => handleHostsInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full ${
                      isDark
                        ? "bg-slate-900 text-white"
                        : "bg-white text-gray-900"
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
                    onChange={(e) => setSubnetIndex(e.target.value)}
                    onKeyPress={handleKeyPress}
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
                    Enter a subnet number to highlight it in the ranges table
                    below
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={calculate}
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
              onClick={resetCalculator}
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

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <>
            {/* Summary Grid */}
            <div
              className={`${
                isDark ? "bg-slate-800/80" : "bg-blue-50/50"
              } backdrop-blur rounded-lg p-6 mb-6 border ${
                isDark ? "border-slate-700" : "border-blue-200"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  isDark ? theme.heading : theme.headingLight
                }`}
              >
                Network Summary
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <button
                  onClick={handleExportCSV}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                  aria-label="Export as CSV"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                  aria-label="Export as JSON"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Export JSON
                </button>
                <button
                  onClick={handleShareURL}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    isDark
                      ? theme.primary
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  aria-label="Copy shareable URL"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                  Share URL
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <ResultCard
                  label="Network Address"
                  value={result.networkAddress}
                  isDark={isDark}
                  onCopy={() =>
                    handleCopyToClipboard(
                      result.networkAddress,
                      "Network Address"
                    )
                  }
                />
                <ResultCard
                  label="Subnet Mask"
                  value={result.subnetMask}
                  isDark={isDark}
                  onCopy={() =>
                    handleCopyToClipboard(result.subnetMask, "Subnet Mask")
                  }
                />
                <ResultCard
                  label="Default Subnet Mask"
                  value={(() => {
                    const defaultCIDR =
                      result.ipClass === "A"
                        ? 8
                        : result.ipClass === "B"
                        ? 16
                        : 24;
                    const masks = {
                      8: "255.0.0.0",
                      16: "255.255.0.0",
                      24: "255.255.255.0",
                    };
                    return `${
                      masks[defaultCIDR as keyof typeof masks]
                    } (/${defaultCIDR})`;
                  })()}
                  isDark={isDark}
                />
                <ResultCard
                  label="Wildcard Mask"
                  value={result.wildcardMask}
                  isDark={isDark}
                  onCopy={() =>
                    handleCopyToClipboard(result.wildcardMask, "Wildcard Mask")
                  }
                />
                <ResultCard
                  label="Broadcast Address"
                  value={result.broadcastAddress}
                  isDark={isDark}
                  onCopy={() =>
                    handleCopyToClipboard(
                      result.broadcastAddress,
                      "Broadcast Address"
                    )
                  }
                />
                <ResultCard
                  label="CIDR Notation"
                  value={`${ipInput.split("/")[0]}/${result.cidr}`}
                  isDark={isDark}
                  onCopy={() =>
                    handleCopyToClipboard(
                      `${ipInput.split("/")[0]}/${result.cidr}`,
                      "CIDR Notation"
                    )
                  }
                />
                <div
                  className={`${
                    isDark ? "bg-slate-800" : "bg-white"
                  } backdrop-blur rounded-lg p-4 border ${
                    isDark ? "border-slate-700" : "border-gray-200"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    IP Class
                  </div>
                  <div className="flex items-center gap-2">
                    <IPClassBadge
                      ipAddress={result.networkAddress}
                      isDark={isDark}
                    />
                  </div>
                </div>
                <ResultCard
                  label="Borrowed Bits"
                  value={result.bitsUsedForSubnetting.toString()}
                  isDark={isDark}
                />
                <ResultCard
                  label="Number of Subnets"
                  value={
                    <>
                      2<sup>{result.bitsUsedForSubnetting}</sup> ={" "}
                      {result.numberOfSubnets.toLocaleString()}
                    </>
                  }
                  isDark={isDark}
                />
                <ResultCard
                  label="Total Hosts"
                  value={
                    <>
                      2<sup>{32 - result.cidr}</sup> ={" "}
                      {result.totalHosts.toLocaleString()}
                    </>
                  }
                  isDark={isDark}
                />
                <ResultCard
                  label="Usable Hosts"
                  value={
                    <>
                      2<sup>{32 - result.cidr}</sup> - 2 ={" "}
                      {result.usableHosts.toLocaleString()}
                    </>
                  }
                  isDark={isDark}
                />
                <ResultCard
                  label="Network Type"
                  value={
                    isPrivate(ipInput.split("/")[0]) ? "Private" : "Public"
                  }
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Network Diagram Visualization */}
            <NetworkDiagram result={result} isDark={isDark} />

            {/* Binary Representation */}
            <div
              className={`${
                isDark ? "bg-slate-800/80" : "bg-blue-50/50"
              } backdrop-blur rounded-lg p-6 mb-6 border ${
                isDark ? "border-slate-700" : "border-blue-200"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  isDark ? theme.heading : theme.headingLight
                }`}
              >
                Binary Representation
              </h2>
              <div className="space-y-4 overflow-x-auto">
                {/* IP Address Binary */}
                <div>
                  <div
                    className={`text-xs sm:text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    IP Address: {result.networkAddress}
                  </div>
                  <div className="flex gap-0.5 sm:gap-1 font-mono text-[10px] sm:text-xs">
                    {result.networkAddress.split(".").map((octet, idx) => {
                      const binary = parseInt(octet)
                        .toString(2)
                        .padStart(8, "0");
                      return (
                        <div key={idx} className="flex">
                          {binary.split("").map((bit, bitIdx) => {
                            const bitPosition = idx * 8 + bitIdx;
                            const isNetworkBit = bitPosition < result.cidr;
                            return (
                              <span
                                key={bitIdx}
                                className={`px-0.5 sm:px-1 py-0.5 text-[9px] sm:text-xs ${
                                  isNetworkBit
                                    ? isDark
                                      ? "bg-blue-900/50 text-blue-300"
                                      : "bg-blue-200 text-blue-800"
                                    : isDark
                                    ? "bg-green-900/50 text-green-300"
                                    : "bg-green-200 text-green-800"
                                }`}
                              >
                                {bit}
                              </span>
                            );
                          })}
                          {idx < 3 && (
                            <span
                              className={`px-0.5 sm:px-1 ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              .
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subnet Mask Binary */}
                <div>
                  <div
                    className={`text-xs sm:text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Subnet Mask: {result.subnetMask}
                  </div>
                  <div className="flex gap-0.5 sm:gap-1 font-mono text-[10px] sm:text-xs">
                    {result.subnetMask.split(".").map((octet, idx) => {
                      const binary = parseInt(octet)
                        .toString(2)
                        .padStart(8, "0");
                      return (
                        <div key={idx} className="flex">
                          {binary.split("").map((bit, bitIdx) => (
                            <span
                              key={bitIdx}
                              className={`px-0.5 sm:px-1 py-0.5 text-[9px] sm:text-xs ${
                                bit === "1"
                                  ? isDark
                                    ? "bg-purple-900/50 text-purple-300"
                                    : "bg-purple-200 text-purple-800"
                                  : isDark
                                  ? "bg-slate-700 text-gray-400"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {bit}
                            </span>
                          ))}
                          {idx < 3 && (
                            <span
                              className={`px-0.5 sm:px-1 ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              .
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Default Subnet Mask Binary */}
                <div>
                  <div
                    className={`text-xs sm:text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Default Subnet Mask (Class {result.ipClass}):{" "}
                    {(() => {
                      const defaultCIDR =
                        result.ipClass === "A"
                          ? 8
                          : result.ipClass === "B"
                          ? 16
                          : 24;
                      const masks = {
                        8: "255.0.0.0",
                        16: "255.255.0.0",
                        24: "255.255.255.0",
                      };
                      return masks[defaultCIDR as keyof typeof masks];
                    })()}
                  </div>
                  <div className="flex gap-0.5 sm:gap-1 font-mono text-[10px] sm:text-xs">
                    {(() => {
                      const defaultCIDR =
                        result.ipClass === "A"
                          ? 8
                          : result.ipClass === "B"
                          ? 16
                          : 24;
                      const masks = {
                        8: "255.0.0.0",
                        16: "255.255.0.0",
                        24: "255.255.255.0",
                      };
                      const defaultMask =
                        masks[defaultCIDR as keyof typeof masks];
                      return defaultMask.split(".").map((octet, idx) => {
                        const binary = parseInt(octet)
                          .toString(2)
                          .padStart(8, "0");
                        return (
                          <div key={idx} className="flex">
                            {binary.split("").map((bit, bitIdx) => (
                              <span
                                key={bitIdx}
                                className={`px-0.5 sm:px-1 py-0.5 text-[9px] sm:text-xs ${
                                  bit === "1"
                                    ? isDark
                                      ? "bg-amber-900/50 text-amber-300"
                                      : "bg-amber-200 text-amber-800"
                                    : isDark
                                    ? "bg-slate-700 text-gray-400"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                {bit}
                              </span>
                            ))}
                            {idx < 3 && (
                              <span
                                className={`px-0.5 sm:px-1 ${
                                  isDark ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                .
                              </span>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs ${
                        isDark
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      Network Bits
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs ${
                        isDark
                          ? "bg-green-900/50 text-green-300"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      Host Bits
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs ${
                        isDark
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-purple-200 text-purple-800"
                      }`}
                    >
                      Mask: 1
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs ${
                        isDark
                          ? "bg-amber-900/50 text-amber-300"
                          : "bg-amber-200 text-amber-800"
                      }`}
                    >
                      Default Mask: 1
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs ${
                        isDark
                          ? "bg-slate-700 text-gray-400"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      Mask: 0
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Host Range */}
            <div
              className={`${
                isDark ? "bg-slate-800/80" : "bg-blue-50/50"
              } backdrop-blur rounded-lg p-6 mb-6 border ${
                isDark ? "border-slate-700" : "border-blue-200"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  isDark ? theme.heading : theme.headingLight
                }`}
              >
                Host Address Range
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-base sm:text-lg">
                <span
                  className={`font-mono text-sm sm:text-base ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {result.firstUsableHost}
                </span>
                <span
                  className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  -
                </span>
                <span
                  className={`font-mono text-sm sm:text-base ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  {result.lastUsableHost}
                </span>
              </div>
            </div>

            {/* Subnet Details Table */}
            <div
              className={`${
                isDark ? "bg-slate-800/80" : "bg-blue-50/50"
              } backdrop-blur rounded-lg p-6 border ${
                isDark ? "border-slate-700" : "border-blue-200"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h2
                  className={`text-xl font-bold ${
                    isDark ? theme.heading : theme.headingLight
                  }`}
                >
                  Subnet Details
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  {/* Search Box */}
                  <div className="relative flex-1 md:flex-initial">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search subnets..."
                      className={`w-full md:w-64 ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } text-sm px-3 py-2 pl-9 rounded border ${
                        theme.primaryFocus
                      } focus:outline-none focus:ring-1 ${theme.primaryRing}`}
                    />
                    <MagnifyingGlassIcon
                      className={`absolute left-3 top-2.5 w-4 h-4 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>

                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className={`${
                      isDark
                        ? "bg-slate-700 border-slate-600"
                        : "bg-white border-gray-300"
                    } text-sm px-3 py-2 rounded border ${
                      theme.primaryFocus
                    } focus:outline-none`}
                  >
                    <option value={10}>10 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDark ? "border-slate-600" : "border-gray-300"
                      }`}
                    >
                      <th
                        className={`text-left py-3 px-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } font-semibold`}
                      >
                        Subnet ID
                      </th>
                      <th
                        className={`text-left py-3 px-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } font-semibold`}
                      >
                        Subnet Address
                      </th>
                      <th
                        className={`text-left py-3 px-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } font-semibold`}
                      >
                        Host Address Range
                      </th>
                      <th
                        className={`text-left py-3 px-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } font-semibold`}
                      >
                        Broadcast Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Filter subnets based on search query
                      const filteredSubnets =
                        result.subnetRanges?.filter((subnet) => {
                          if (!searchQuery) return true;
                          const query = searchQuery.toLowerCase();
                          return (
                            subnet.subnetNumber.toString().includes(query) ||
                            subnet.networkAddress
                              .toLowerCase()
                              .includes(query) ||
                            subnet.firstUsableHost
                              .toLowerCase()
                              .includes(query) ||
                            subnet.lastUsableHost
                              .toLowerCase()
                              .includes(query) ||
                            subnet.broadcastAddress
                              .toLowerCase()
                              .includes(query)
                          );
                        }) || [];

                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;

                      if (filteredSubnets.length === 0 && searchQuery) {
                        return (
                          <tr>
                            <td
                              colSpan={4}
                              className={`py-8 text-center ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              No subnets found matching "{searchQuery}"
                            </td>
                          </tr>
                        );
                      }

                      return filteredSubnets
                        .slice(startIndex, endIndex)
                        .map((subnet) => (
                          <tr
                            key={subnet.subnetNumber}
                            className={`border-b ${
                              isDark
                                ? "border-slate-700/50 hover:bg-slate-700/30"
                                : "border-gray-200 hover:bg-gray-100"
                            } transition-colors ${
                              subnetIndex &&
                              parseInt(subnetIndex) === subnet.subnetNumber
                                ? `${theme.highlight} border-l-4`
                                : ""
                            }`}
                          >
                            <td className="py-3 px-4 font-medium">
                              {subnet.subnetNumber}
                            </td>
                            <td
                              className={`py-3 px-4 font-mono text-sm ${
                                isDark ? theme.value : theme.valueLight
                              }`}
                            >
                              {subnet.networkAddress}
                            </td>
                            <td
                              className={`py-3 px-4 font-mono text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {subnet.firstUsableHost} - {subnet.lastUsableHost}
                            </td>
                            <td
                              className={`py-3 px-4 font-mono text-sm ${
                                isDark ? "text-orange-300" : "text-orange-600"
                              }`}
                            >
                              {subnet.broadcastAddress}
                            </td>
                          </tr>
                        ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {result.subnetRanges && result.subnetRanges.length > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {(() => {
                      const filteredCount =
                        result.subnetRanges?.filter((subnet) => {
                          if (!searchQuery) return true;
                          const query = searchQuery.toLowerCase();
                          return (
                            subnet.subnetNumber.toString().includes(query) ||
                            subnet.networkAddress
                              .toLowerCase()
                              .includes(query) ||
                            subnet.firstUsableHost
                              .toLowerCase()
                              .includes(query) ||
                            subnet.lastUsableHost
                              .toLowerCase()
                              .includes(query) ||
                            subnet.broadcastAddress
                              .toLowerCase()
                              .includes(query)
                          );
                        }).length || 0;

                      const start = Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        filteredCount
                      );
                      const end = Math.min(
                        currentPage * itemsPerPage,
                        filteredCount
                      );

                      return `Showing ${start} to ${end} of ${filteredCount} subnets${
                        searchQuery ? " (filtered)" : ""
                      }`;
                    })()}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 ${
                        isDark
                          ? "bg-slate-700 hover:bg-slate-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      } rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
                    >
                      First
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 ${
                        isDark
                          ? "bg-slate-700 hover:bg-slate-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      } rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
                    >
                      Previous
                    </button>
                    <div
                      className={`flex items-center px-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {(() => {
                        const filteredCount =
                          result.subnetRanges?.filter((subnet) => {
                            if (!searchQuery) return true;
                            const query = searchQuery.toLowerCase();
                            return (
                              subnet.subnetNumber.toString().includes(query) ||
                              subnet.networkAddress
                                .toLowerCase()
                                .includes(query) ||
                              subnet.firstUsableHost
                                .toLowerCase()
                                .includes(query) ||
                              subnet.lastUsableHost
                                .toLowerCase()
                                .includes(query) ||
                              subnet.broadcastAddress
                                .toLowerCase()
                                .includes(query)
                            );
                          }).length || 0;

                        return `Page ${currentPage} of ${Math.ceil(
                          filteredCount / itemsPerPage
                        )}`;
                      })()}
                    </div>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={(() => {
                        const filteredCount =
                          result.subnetRanges?.filter((subnet) => {
                            if (!searchQuery) return true;
                            const query = searchQuery.toLowerCase();
                            return (
                              subnet.subnetNumber.toString().includes(query) ||
                              subnet.networkAddress
                                .toLowerCase()
                                .includes(query) ||
                              subnet.firstUsableHost
                                .toLowerCase()
                                .includes(query) ||
                              subnet.lastUsableHost
                                .toLowerCase()
                                .includes(query) ||
                              subnet.broadcastAddress
                                .toLowerCase()
                                .includes(query)
                            );
                          }).length || 0;

                        return (
                          currentPage >= Math.ceil(filteredCount / itemsPerPage)
                        );
                      })()}
                      className={`px-3 py-1 ${
                        isDark
                          ? "bg-slate-700 hover:bg-slate-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      } rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
                    >
                      Next
                    </button>
                    <button
                      onClick={() => {
                        const filteredCount =
                          result.subnetRanges?.filter((subnet) => {
                            if (!searchQuery) return true;
                            const query = searchQuery.toLowerCase();
                            return (
                              subnet.subnetNumber.toString().includes(query) ||
                              subnet.networkAddress
                                .toLowerCase()
                                .includes(query) ||
                              subnet.firstUsableHost
                                .toLowerCase()
                                .includes(query) ||
                              subnet.lastUsableHost
                                .toLowerCase()
                                .includes(query) ||
                              subnet.broadcastAddress
                                .toLowerCase()
                                .includes(query)
                            );
                          }).length || 0;
                        setCurrentPage(Math.ceil(filteredCount / itemsPerPage));
                      }}
                      disabled={(() => {
                        const filteredCount =
                          result.subnetRanges?.filter((subnet) => {
                            if (!searchQuery) return true;
                            const query = searchQuery.toLowerCase();
                            return (
                              subnet.subnetNumber.toString().includes(query) ||
                              subnet.networkAddress
                                .toLowerCase()
                                .includes(query) ||
                              subnet.firstUsableHost
                                .toLowerCase()
                                .includes(query) ||
                              subnet.lastUsableHost
                                .toLowerCase()
                                .includes(query) ||
                              subnet.broadcastAddress
                                .toLowerCase()
                                .includes(query)
                            );
                          }).length || 0;

                        return (
                          currentPage >= Math.ceil(filteredCount / itemsPerPage)
                        );
                      })()}
                      className={`px-3 py-1 ${
                        isDark
                          ? "bg-slate-700 hover:bg-slate-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      } rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer / Credits */}
        <div
          className={`mt-8 pt-6 border-t ${
            isDark ? "border-slate-700" : "border-gray-200"
          } text-center`}
        >
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Created by{" "}
            <a
              href="https://github.com/tingaz-2nye"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium hover:underline ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Tingaz-2nye
            </a>
          </p>
          <p
            className={`text-xs mt-1 ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Open source on{" "}
            <a
              href="https://github.com/tingaz-2nye/ip-subnet-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              GitHub
            </a>
          </p>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        isDark={isDark}
      />
    </div>
  );
}
