"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isDark?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  isDark = false,
  children,
  fullWidth = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles =
    "font-medium rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  // Variant styles
  const variantStyles = {
    primary: isDark
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: isDark
      ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
      : "bg-gray-200 hover:bg-gray-300 text-gray-700",
    danger: isDark
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-500 hover:bg-red-600 text-white",
    ghost: isDark
      ? "bg-transparent hover:bg-slate-700 text-gray-300"
      : "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

  return (
    <button className={combinedClassName} disabled={disabled} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

// Specific button types for common use cases
export function PaginationButton({
  isDark,
  children,
  ...props
}: Omit<ButtonProps, "variant" | "size">) {
  return (
    <Button variant="secondary" size="sm" isDark={isDark} {...props}>
      {children}
    </Button>
  );
}

export function IconButton({
  isDark,
  icon,
  title,
  className = "",
  ...props
}: Omit<ButtonProps, "children" | "variant" | "size"> & {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      className={`p-3 sm:p-4 rounded-full transition-all shadow-xl hover:shadow-2xl border-2 transform hover:scale-110 ${
        isDark
          ? "bg-slate-800 hover:bg-slate-700 border-slate-700"
          : "bg-white hover:bg-gray-50 border-gray-200"
      } ${className}`}
      title={title}
      aria-label={title}
      {...props}
    >
      {icon}
    </button>
  );
}
