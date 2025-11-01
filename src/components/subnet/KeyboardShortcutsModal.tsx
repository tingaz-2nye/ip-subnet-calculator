import { XMarkIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

export const KeyboardShortcutsModal = memo(function KeyboardShortcutsModal({
  isOpen,
  onClose,
  isDark,
}: KeyboardShortcutsModalProps) {
  const shortcuts: Shortcut[] = [
    {
      keys: ["Ctrl", "K"],
      description: "Focus IP input",
      category: "Navigation",
    },
    {
      keys: ["Ctrl", "Enter"],
      description: "Calculate subnet",
      category: "Actions",
    },
    {
      keys: ["Ctrl", "R"],
      description: "Reset calculator",
      category: "Actions",
    },
    { keys: ["Ctrl", "H"], description: "Toggle history", category: "Panels" },
    { keys: ["Ctrl", "E"], description: "Export to CSV", category: "Export" },
    {
      keys: ["Ctrl", "Shift", "E"],
      description: "Export to JSON",
      category: "Export",
    },
    {
      keys: ["Esc"],
      description: "Close panels/dialogs",
      category: "Navigation",
    },
    { keys: ["?"], description: "Show shortcuts (this)", category: "Help" },
    {
      keys: ["Ctrl", "/"],
      description: "Show onboarding tour",
      category: "Help",
    },
  ];

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 rounded-2xl shadow-2xl ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
            role="dialog"
            aria-label="Keyboard shortcuts"
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-6 border-b ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Keyboard Shortcuts
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Speed up your workflow with keyboard shortcuts
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
                aria-label="Close shortcuts modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category}>
                    <h3
                      className={`text-sm font-semibold mb-3 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {shortcuts
                        .filter((s) => s.category === category)
                        .map((shortcut, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isDark ? "bg-slate-900/50" : "bg-gray-50"
                            }`}
                          >
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {shortcut.description}
                            </span>
                            <div className="flex items-center gap-1">
                              {shortcut.keys.map((key, keyIdx) => (
                                <span
                                  key={keyIdx}
                                  className="flex items-center gap-1"
                                >
                                  <kbd
                                    className={`px-2.5 py-1.5 text-xs font-semibold rounded border shadow-sm ${
                                      isDark
                                        ? "bg-slate-700 border-slate-600 text-gray-300"
                                        : "bg-white border-gray-300 text-gray-700"
                                    }`}
                                  >
                                    {key}
                                  </kbd>
                                  {keyIdx < shortcut.keys.length - 1 && (
                                    <span
                                      className={`text-xs ${
                                        isDark
                                          ? "text-gray-500"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      +
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className={`p-4 border-t text-center ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <p
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-gray-300 text-xs">
                  ?
                </kbd>{" "}
                anytime to show this guide
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
