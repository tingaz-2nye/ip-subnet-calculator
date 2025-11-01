/**
 * IP Class utilities and color schemes
 */

export type IPClass = "A" | "B" | "C" | "D" | "E";

export interface IPClassInfo {
  class: IPClass;
  name: string;
  range: string;
  defaultMask: string;
  description: string;
  color: {
    light: string;
    dark: string;
    bg: string;
    border: string;
  };
}

/**
 * Get IP class from first octet
 */
export function getIPClass(ipAddress: string): IPClass {
  const firstOctet = parseInt(ipAddress.split(".")[0]);

  if (firstOctet >= 1 && firstOctet <= 126) return "A";
  if (firstOctet >= 128 && firstOctet <= 191) return "B";
  if (firstOctet >= 192 && firstOctet <= 223) return "C";
  if (firstOctet >= 224 && firstOctet <= 239) return "D";
  return "E";
}

/**
 * Get detailed information about an IP class
 */
export function getIPClassInfo(ipClass: IPClass): IPClassInfo {
  const classInfo: Record<IPClass, IPClassInfo> = {
    A: {
      class: "A",
      name: "Class A",
      range: "1.0.0.0 - 126.255.255.255",
      defaultMask: "255.0.0.0 (/8)",
      description: "Large networks: 16M hosts per network",
      color: {
        light: "text-blue-700",
        dark: "text-blue-400",
        bg: "bg-blue-500/20",
        border: "border-blue-500/50",
      },
    },
    B: {
      class: "B",
      name: "Class B",
      range: "128.0.0.0 - 191.255.255.255",
      defaultMask: "255.255.0.0 (/16)",
      description: "Medium networks: 65K hosts per network",
      color: {
        light: "text-green-700",
        dark: "text-green-400",
        bg: "bg-green-500/20",
        border: "border-green-500/50",
      },
    },
    C: {
      class: "C",
      name: "Class C",
      range: "192.0.0.0 - 223.255.255.255",
      defaultMask: "255.255.255.0 (/24)",
      description: "Small networks: 254 hosts per network",
      color: {
        light: "text-purple-700",
        dark: "text-purple-400",
        bg: "bg-purple-500/20",
        border: "border-purple-500/50",
      },
    },
    D: {
      class: "D",
      name: "Class D",
      range: "224.0.0.0 - 239.255.255.255",
      defaultMask: "N/A",
      description: "Multicast groups (no host addresses)",
      color: {
        light: "text-orange-700",
        dark: "text-orange-400",
        bg: "bg-orange-500/20",
        border: "border-orange-500/50",
      },
    },
    E: {
      class: "E",
      name: "Class E",
      range: "240.0.0.0 - 255.255.255.255",
      defaultMask: "N/A",
      description: "Reserved for future use / experimental",
      color: {
        light: "text-red-700",
        dark: "text-red-400",
        bg: "bg-red-500/20",
        border: "border-red-500/50",
      },
    },
  };

  return classInfo[ipClass];
}
