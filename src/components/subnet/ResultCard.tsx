import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { memo, ReactNode } from "react";

interface ResultCardProps {
  label: string;
  value: string | ReactNode;
  isDark: boolean;
  onCopy?: () => void;
}

export const ResultCard = memo(function ResultCard({
  label,
  value,
  isDark,
  onCopy,
}: ResultCardProps) {
  return (
    <div
      className={`${
        isDark
          ? "bg-slate-900/50 border-slate-700/50"
          : "bg-white border-blue-100 shadow-sm"
      } rounded p-3 border group relative`}
    >
      <div
        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}
      >
        {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div
          className={`font-mono text-sm ${
            isDark ? "text-white" : "text-gray-900"
          } font-semibold`}
        >
          {value}
        </div>
        {onCopy && (
          <button
            onClick={onCopy}
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded ${
              isDark
                ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
            title="Copy to clipboard"
            aria-label={`Copy ${label} to clipboard`}
          >
            <ClipboardDocumentIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
});
