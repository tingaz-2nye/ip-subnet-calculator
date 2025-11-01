interface KeyboardShortcutsHintProps {
  isDark: boolean;
}

export function KeyboardShortcutsHint({ isDark }: KeyboardShortcutsHintProps) {
  return (
    <div
      className={`text-xs mb-4 p-3 rounded overflow-x-auto ${
        isDark
          ? "bg-slate-900/50 text-gray-400"
          : "bg-blue-100/50 text-gray-600"
      }`}
    >
      <span className="font-semibold">Shortcuts:</span>{" "}
      <span className="whitespace-nowrap">
        ? (Help) • Ctrl+K (Focus) • Ctrl+Enter (Calculate) • Ctrl+H (History) •
        Ctrl+E (Export) • Esc (Close)
      </span>
    </div>
  );
}
