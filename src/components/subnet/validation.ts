/**
 * IP Address and CIDR Validation Utilities
 */

import { IP_VALIDATION } from "./constants";

export interface ValidationResult {
  isValid: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

/**
 * Validates an individual IP octet
 */
export function isValidOctet(octet: string): boolean {
  const num = parseInt(octet, 10);
  return (
    !isNaN(num) &&
    num >= IP_VALIDATION.MIN_OCTET &&
    num <= IP_VALIDATION.MAX_OCTET &&
    octet === num.toString() // Ensures no leading zeros
  );
}

/**
 * Validates a complete IP address
 */
export function isValidIPAddress(ip: string): boolean {
  const octets = ip.split(".");
  if (octets.length !== 4) return false;
  return octets.every(isValidOctet);
}

/**
 * Validates CIDR notation
 */
export function isValidCIDR(cidr: string): boolean {
  const num = parseInt(cidr, 10);
  return (
    !isNaN(num) &&
    num >= IP_VALIDATION.MIN_CIDR &&
    num <= IP_VALIDATION.MAX_CIDR
  );
}

/**
 * Validates IP/CIDR input in real-time
 */
export function validateIPInput(
  input: string,
  mode: "manual" | "subnets" | "hosts"
): ValidationResult {
  // Empty input
  if (!input.trim()) {
    return {
      isValid: false,
      message: "IP address is required",
      type: "info",
    };
  }

  // For manual mode, expect IP/CIDR format
  if (mode === "manual") {
    if (!input.includes("/")) {
      return {
        isValid: false,
        message: "Format: IP/CIDR (e.g., 192.168.1.0/24)",
        type: "warning",
      };
    }

    const [ip, cidr] = input.split("/");

    // Validate IP part
    if (!ip) {
      return {
        isValid: false,
        message: "IP address is required before /",
        type: "error",
      };
    }

    const octets = ip.split(".");
    if (octets.length < 4) {
      return {
        isValid: false,
        message: `Enter all 4 octets (${octets.length}/4)`,
        type: "info",
      };
    }

    if (octets.length > 4) {
      return {
        isValid: false,
        message: "Too many octets (max 4)",
        type: "error",
      };
    }

    // Check each octet
    for (let i = 0; i < octets.length; i++) {
      if (!octets[i]) {
        return {
          isValid: false,
          message: `Octet ${i + 1} is empty`,
          type: "error",
        };
      }
      if (!isValidOctet(octets[i])) {
        return {
          isValid: false,
          message: `Octet ${i + 1} must be 0-255`,
          type: "error",
        };
      }
    }

    // Validate CIDR
    if (!cidr) {
      return {
        isValid: false,
        message: "CIDR prefix is required after /",
        type: "warning",
      };
    }

    if (!isValidCIDR(cidr)) {
      return {
        isValid: false,
        message: "CIDR must be 0-32",
        type: "error",
      };
    }

    // All valid!
    return {
      isValid: true,
      message: "Valid IP/CIDR notation",
      type: "success",
    };
  } else {
    // For subnets/hosts mode, just validate IP (no CIDR)
    const ip = input.split("/")[0]; // Remove any accidental CIDR

    const octets = ip.split(".");
    if (octets.length < 4) {
      return {
        isValid: false,
        message: `Enter all 4 octets (${octets.length}/4)`,
        type: "info",
      };
    }

    if (octets.length > 4) {
      return {
        isValid: false,
        message: "Too many octets (max 4)",
        type: "error",
      };
    }

    // Check each octet
    for (let i = 0; i < octets.length; i++) {
      if (!octets[i]) {
        return {
          isValid: false,
          message: `Octet ${i + 1} is empty`,
          type: "error",
        };
      }
      if (!isValidOctet(octets[i])) {
        return {
          isValid: false,
          message: `Octet ${i + 1} must be 0-255`,
          type: "error",
        };
      }
    }

    return {
      isValid: true,
      message: "Valid IP address",
      type: "success",
    };
  }
}

/**
 * Validates number of subnets input
 */
export function validateSubnetsInput(input: string): ValidationResult {
  if (!input.trim()) {
    return {
      isValid: false,
      message: "Number of subnets required",
      type: "info",
    };
  }

  const num = parseInt(input, 10);
  if (isNaN(num)) {
    return {
      isValid: false,
      message: "Must be a valid number",
      type: "error",
    };
  }

  if (num < 1) {
    return {
      isValid: false,
      message: "Must be at least 1",
      type: "error",
    };
  }

  if (num > 16384) {
    return {
      isValid: false,
      message: "Maximum 16,384 subnets",
      type: "warning",
    };
  }

  return {
    isValid: true,
    message: `${num} subnet${num > 1 ? "s" : ""} will be calculated`,
    type: "success",
  };
}

/**
 * Validates number of hosts input
 */
export function validateHostsInput(input: string): ValidationResult {
  if (!input.trim()) {
    return {
      isValid: false,
      message: "Number of hosts required",
      type: "info",
    };
  }

  const num = parseInt(input, 10);
  if (isNaN(num)) {
    return {
      isValid: false,
      message: "Must be a valid number",
      type: "error",
    };
  }

  if (num < 1) {
    return {
      isValid: false,
      message: "Must be at least 1",
      type: "error",
    };
  }

  if (num > 16777214) {
    return {
      isValid: false,
      message: "Maximum ~16.7M hosts",
      type: "warning",
    };
  }

  return {
    isValid: true,
    message: `Network for ${num} host${num > 1 ? "s" : ""} will be calculated`,
    type: "success",
  };
}
