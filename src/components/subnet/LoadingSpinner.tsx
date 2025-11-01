interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  isDark?: boolean;
}

export function LoadingSpinner({
  size = "md",
  isDark = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${
        sizeClasses[size]
      } border-transparent rounded-full animate-spin ${
        isDark
          ? "border-t-blue-400 border-r-blue-400"
          : "border-t-blue-600 border-r-blue-600"
      }`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
