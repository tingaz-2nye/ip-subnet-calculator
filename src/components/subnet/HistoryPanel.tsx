import { ClockIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import { HistoryItem, formatTimestamp } from "./storage";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  isDark: boolean;
}

export const HistoryPanel = memo(function HistoryPanel({
  isOpen,
  onClose,
  history,
  onSelectItem,
  onClearHistory,
  onRemoveItem,
  isDark,
}: HistoryPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 ${
          isDark ? "bg-slate-800" : "bg-white"
        } shadow-2xl transform transition-transform duration-300 overflow-y-auto`}
        role="dialog"
        aria-label="Calculation history"
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            <h2
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              History
            </h2>
            {history.length > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isDark
                    ? "bg-slate-700 text-gray-300"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {history.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Close history panel"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon
                className={`w-12 h-12 mx-auto mb-3 ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No calculation history yet
              </p>
              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Your calculations will appear here
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 history-scroll">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`group rounded-lg border p-3 transition-all hover:shadow-md ${
                      isDark
                        ? "bg-slate-900/50 border-slate-700 hover:border-slate-600"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => onSelectItem(item)}
                      className="w-full text-left mb-2"
                      aria-label={`Load calculation for ${item.ipInput}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-mono text-sm font-semibold truncate ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.ipInput}
                          </div>
                          <div
                            className={`text-xs mt-0.5 ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {formatTimestamp(item.timestamp)}
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                            item.mode === "manual"
                              ? isDark
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-blue-100 text-blue-700"
                              : item.mode === "subnets"
                              ? isDark
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-purple-100 text-purple-700"
                              : isDark
                              ? "bg-green-500/20 text-green-400"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.mode}
                        </span>
                      </div>

                      <div
                        className={`grid grid-cols-2 gap-2 text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <div>
                          <div className="font-medium">Network</div>
                          <div className="font-mono truncate">
                            {item.networkAddress}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Hosts</div>
                          <div>{item.usableHosts.toLocaleString()}</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className={`w-full text-xs py-1.5 px-3 rounded border transition-colors flex items-center justify-center gap-1.5 ${
                        isDark
                          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                          : "border-red-300 text-red-600 hover:bg-red-50"
                      }`}
                      aria-label="Remove this item"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={onClearHistory}
                className={`w-full mt-4 text-sm py-2 px-3 rounded-lg border transition-colors ${
                  isDark
                    ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                    : "border-red-300 text-red-600 hover:bg-red-50"
                }`}
                aria-label="Clear all history"
              >
                Clear All History
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
});
