import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  SparklesIcon,
  CursorArrowRaysIcon,
  RectangleStackIcon,
  ClockIcon,
  CommandLineIcon,
  PaintBrushIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

interface OnboardingProps {
  isDark: boolean;
  onComplete: () => void;
}

interface Step {
  title: string;
  description: string;
  highlight?: string;
  tips?: string[];
  icon?: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    title: "Welcome to IP Subnet Calculator!",
    description:
      "Let me show you around and help you master subnet calculations in just a few steps.",
    icon: SparklesIcon,
    tips: [
      "Calculate subnets quickly and accurately",
      "Save your calculation history",
      "Export results in multiple formats",
      "Customize themes to your preference",
    ],
  },
  {
    title: "Choose Your Calculation Mode",
    description:
      "Select how you want to calculate your subnet. We support three modes:",
    icon: CursorArrowRaysIcon,
    highlight: "calculation-mode",
    tips: [
      "Manual: Enter IP with CIDR notation (e.g., 192.168.1.0/24)",
      "By Subnets: Specify how many subnets you need",
      "By Hosts: Specify how many hosts per subnet you need",
    ],
  },
  {
    title: "Quick Presets for Common Networks",
    description:
      "Use quick presets for common network types. Click any preset to auto-fill!",
    icon: RectangleStackIcon,
    highlight: "quick-presets",
    tips: [
      "Home Network: Standard home router setup",
      "Small Office: Small business network",
      "Enterprise: Large corporate network",
      "Data Center: Server farm configuration",
    ],
  },
  {
    title: "View All Subnets",
    description:
      "When your network has more than 100 subnets, use the 'Show All Subnets' button to display them all!",
    icon: TableCellsIcon,
    tips: [
      "By default, only 100 subnets are shown for performance",
      "Click 'Show All Subnets' to see all available subnets",
      "Works great for networks with thousands of subnets",
      "Button appears automatically when needed",
    ],
  },
  {
    title: "Quick Subnet Lookup",
    description:
      "Need to find a specific subnet? Use Quick Subnet Lookup to jump directly to any subnet number!",
    icon: MagnifyingGlassIcon,
    tips: [
      "Enter a subnet number (e.g., 1023) to find it instantly",
      "Shows network address, broadcast, and usable host range",
      "Perfect for large networks with many subnets",
      "Located above the subnet details table",
    ],
  },
  {
    title: "Calculation History",
    description:
      "Your calculations are automatically saved. Click the history button to view past calculations.",
    icon: ClockIcon,
    highlight: "history-button",
    tips: [
      "Last 10 calculations are saved automatically",
      "Click any history item to restore it",
      "Remove individual items or clear all",
      "History persists across browser sessions",
    ],
  },
  {
    title: "Number System Converter",
    description:
      "Learn binary conversions with our interactive converter! Choose between Subtraction or Division methods.",
    icon: AcademicCapIcon,
    tips: [
      "Click the floating ⇄ button (bottom-right) to open",
      "Subtraction Method: Check powers of 2 (best for learning)",
      "Division Method: Divide by 2 repeatedly (best for algorithms)",
      "Shows step-by-step explanations with visual tutorials",
      "Includes quick reference table and 8-bit position values",
    ],
  },
  {
    title: "Keyboard Shortcuts",
    description:
      "Work faster with keyboard shortcuts! Press ? anytime to see all shortcuts.",
    icon: CommandLineIcon,
    tips: [
      "Ctrl/Cmd + K: Focus on IP input",
      "Ctrl/Cmd + Enter: Calculate",
      "Ctrl/Cmd + H: Toggle history",
      "Ctrl/Cmd + E: Export results",
      "Ctrl/Cmd + R: Reset form",
      "?: Show keyboard shortcuts",
    ],
  },
  {
    title: "Customize Your Experience",
    description:
      "Choose from 7 color themes and toggle between light/dark mode!",
    icon: PaintBrushIcon,
    highlight: "theme-controls",
    tips: [
      "Click the sun/moon icon for light/dark mode",
      "Click the palette icon to choose colors",
      "Themes are Blue, Emerald, Purple, Cyan, Orange, Rose, and Indigo",
      "Your preferences are saved automatically",
    ],
  },
  {
    title: "You're All Set!",
    description:
      "You now know everything to become a subnet calculation pro. Start calculating!",
    icon: RocketLaunchIcon,
    tips: [
      "Hover over any field to copy its value",
      "Export results as CSV or JSON",
      "Share calculations via URL",
      "Check out the network diagram visualization",
    ],
  },
];

export const Onboarding = memo(function Onboarding({
  isDark,
  onComplete,
}: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  useEffect(() => {
    // Highlight the relevant element
    if (step.highlight) {
      const element = document.querySelector(`[data-tour="${step.highlight}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("tour-highlight");
      }
    }

    return () => {
      // Remove highlight when unmounting
      document.querySelectorAll(".tour-highlight").forEach((el) => {
        el.classList.remove("tour-highlight");
      });
    };
  }, [currentStep, step.highlight]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${
              isDark
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-gray-200"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={handleSkip}
              className={`absolute top-6 right-6 p-2 rounded-lg transition-colors z-10 ${
                isDark
                  ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Skip tutorial"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="p-8">
              {/* Progress Indicator */}
              <div className="flex gap-2 mb-6 pr-12">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      index <= currentStep
                        ? isDark
                          ? "bg-blue-500"
                          : "bg-blue-600"
                        : isDark
                        ? "bg-slate-700"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Step Counter */}
              <div
                className={`text-sm font-semibold mb-2 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Step {currentStep + 1} of {steps.length}
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon and Title */}
                  <div className="flex items-center gap-3 mb-4">
                    {step.icon && (
                      <div
                        className={`p-3 rounded-xl ${
                          isDark
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <step.icon className="w-8 h-8" />
                      </div>
                    )}
                    <h2
                      className={`text-2xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {step.title}
                    </h2>
                  </div>

                  <p
                    className={`text-base mb-6 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {step.description}
                  </p>

                  {step.tips && (
                    <div
                      className={`rounded-lg p-4 mb-6 ${
                        isDark
                          ? "bg-slate-900/50 border border-slate-700"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <ul className="space-y-2">
                        {step.tips.map((tip, index) => (
                          <li
                            key={index}
                            className={`flex items-start gap-2 text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <CheckIcon
                              className={`w-5 h-5 shrink-0 mt-0.5 ${
                                isDark ? "text-blue-400" : "text-blue-600"
                              }`}
                            />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleSkip}
                  className={`text-sm font-medium ${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                >
                  Skip Tutorial
                </button>

                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={handlePrevious}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                        isDark
                          ? "bg-slate-700 hover:bg-slate-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      <span className="hidden xs:inline">Previous</span>
                      <span className="xs:hidden">Prev</span>
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isLastStep ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span className="hidden xs:inline">Get Started</span>
                        <span className="xs:hidden">Start</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden xs:inline">Next</span>
                        <span className="xs:hidden">Next</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
