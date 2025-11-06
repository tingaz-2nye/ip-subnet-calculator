// IP subnet calculation utilities

// Cache for calculation results
const calculationCache = new Map<string, SubnetInfo>();
const MAX_CACHE_SIZE = 50; // Keep last 50 calculations

export interface SubnetRange {
  subnetNumber: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  usableHosts: number;
}

export interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  subnetMaskBinary: string;
  wildcardMask: string;
  cidr: number;
  ipClass: string;
  ipClassDescription: string;
  numberOfSubnets: number;
  bitsUsedForSubnetting: number;
  subnetRanges?: SubnetRange[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Helper function to generate cache key
function getCacheKey(
  ip: string,
  cidr: number,
  includeRanges: boolean,
  maxRanges: number
): string {
  return `${ip}/${cidr}|${includeRanges}|${maxRanges}`;
}

// Helper function to manage cache size
function manageCacheSize(): void {
  if (calculationCache.size > MAX_CACHE_SIZE) {
    const firstKey = calculationCache.keys().next().value;
    if (firstKey) {
      calculationCache.delete(firstKey);
    }
  }
}

export function validateIPAddress(ip: string): ValidationResult {
  const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipRegex);

  if (!match) {
    return { isValid: false, error: "Invalid IP address format" };
  }

  const octets = match.slice(1, 5).map(Number);

  for (const octet of octets) {
    if (octet < 0 || octet > 255) {
      return {
        isValid: false,
        error: "IP address octets must be between 0 and 255",
      };
    }
  }

  return { isValid: true };
}

export function validateCIDR(cidr: number): ValidationResult {
  if (cidr < 0 || cidr > 32) {
    return { isValid: false, error: "CIDR must be between 0 and 32" };
  }
  return { isValid: true };
}

export function getIPClass(ip: string): { class: string; description: string } {
  const firstOctet = parseInt(ip.split(".")[0]);

  if (firstOctet >= 1 && firstOctet <= 126) {
    return {
      class: "A",
      description:
        "Class A (1.0.0.0 - 126.255.255.255) - Large networks, /8 default",
    };
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    return {
      class: "B",
      description:
        "Class B (128.0.0.0 - 191.255.255.255) - Medium networks, /16 default",
    };
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    return {
      class: "C",
      description:
        "Class C (192.0.0.0 - 223.255.255.255) - Small networks, /24 default",
    };
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    return {
      class: "D",
      description:
        "Class D (224.0.0.0 - 239.255.255.255) - Multicast addresses",
    };
  } else if (firstOctet >= 240 && firstOctet <= 255) {
    return {
      class: "E",
      description:
        "Class E (240.0.0.0 - 255.255.255.255) - Experimental/Reserved",
    };
  } else {
    return {
      class: "Invalid",
      description: "Invalid IP address range",
    };
  }
}

export function ipToNumber(ip: string): number {
  return (
    ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
  );
}

export function numberToIP(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join(".");
}

export function cidrToSubnetMask(cidr: number): string {
  const mask = (0xffffffff << (32 - cidr)) >>> 0;
  return numberToIP(mask);
}

export function subnetMaskToBinary(mask: string): string {
  return mask
    .split(".")
    .map((octet) => decimalToBinarySubtraction(parseInt(octet)))
    .join(".");
}

/**
 * Convert decimal to binary using the subtraction method
 * For example: 200 = 128 + 64 + 8 = 11001000
 * 1. Start with 200
 * 2. Subtract 128 (2^7) → remainder 72, bit 7 = 1
 * 3. Subtract 64 (2^6) from 72 → remainder 8, bit 6 = 1
 * 4. Can't subtract 32 (2^5) from 8 → bit 5 = 0
 * 5. Can't subtract 16 (2^4) from 8 → bit 4 = 0
 * 6. Can't subtract 8 (2^3) from 8 → but 8 - 8 = 0, bit 3 = 1
 * 7. Remaining bits = 0
 * Result: 11001000
 */
function decimalToBinarySubtraction(decimal: number): string {
  const bits: string[] = [];
  let remainder = decimal;

  // Powers of 2 from 2^7 (128) down to 2^0 (1) for 8-bit binary
  const powers = [128, 64, 32, 16, 8, 4, 2, 1];

  for (const power of powers) {
    if (remainder >= power) {
      bits.push("1"); // Turn ON this bit
      remainder -= power; // Subtract the power
    } else {
      bits.push("0"); // Turn OFF this bit
    }
  }

  return bits.join("");
}

/**
 * Get the subtraction method breakdown for displaying in UI
 * Returns the powers that were used (turned ON bits)
 */
export function getDecimalToBinaryBreakdown(decimal: number): {
  powers: number[];
  sum: string;
  binary: string;
} {
  const powers: number[] = [];
  let remainder = decimal;
  const allPowers = [128, 64, 32, 16, 8, 4, 2, 1];

  for (const power of allPowers) {
    if (remainder >= power) {
      powers.push(power);
      remainder -= power;
    }
  }

  const sum = powers.length > 0 ? powers.join(" + ") : "0";
  const binary = decimalToBinarySubtraction(decimal);

  return { powers, sum, binary };
}

export function calculateWildcardMask(subnetMask: string): string {
  return subnetMask
    .split(".")
    .map((octet) => (255 - parseInt(octet)).toString())
    .join(".");
}

export function getDefaultCIDRForClass(ipClass: string): number {
  switch (ipClass) {
    case "A":
      return 8;
    case "B":
      return 16;
    case "C":
      return 24;
    default:
      return 24;
  }
}

export function calculateSubnetRanges(
  ip: string,
  cidr: number,
  maxRanges: number = 50
): SubnetRange[] {
  // Get the IP class to determine the default network
  const { class: ipClass } = getIPClass(ip);
  const defaultCIDR = getDefaultCIDRForClass(ipClass);

  // Calculate the base network address
  const ipNum = ipToNumber(ip);
  const subnetMaskNum = ipToNumber(cidrToSubnetMask(cidr));
  const networkNum = ipNum & subnetMaskNum;

  // Calculate the parent network (using default class mask)
  const parentMaskNum = ipToNumber(cidrToSubnetMask(defaultCIDR));
  const parentNetworkNum = ipNum & parentMaskNum;

  // Calculate subnet size and total subnets
  const hostBits = 32 - cidr;
  const subnetSize = Math.pow(2, hostBits);

  // Total subnets in the parent network
  const bitsUsedForSubnetting = cidr - defaultCIDR;
  const totalSubnets =
    bitsUsedForSubnetting > 0 ? Math.pow(2, bitsUsedForSubnetting) : 1;
  const actualRanges = Math.min(totalSubnets, maxRanges);

  const ranges: SubnetRange[] = [];

  for (let i = 0; i < actualRanges; i++) {
    const subnetNetworkNum = parentNetworkNum + i * subnetSize;
    const subnetBroadcastNum = subnetNetworkNum + subnetSize - 1;

    const networkAddress = numberToIP(subnetNetworkNum);
    const broadcastAddress = numberToIP(subnetBroadcastNum);
    const firstUsableHost =
      hostBits > 1 ? numberToIP(subnetNetworkNum + 1) : networkAddress;
    const lastUsableHost =
      hostBits > 1 ? numberToIP(subnetBroadcastNum - 1) : networkAddress;
    const usableHosts = hostBits > 1 ? subnetSize - 2 : hostBits === 1 ? 0 : 1;

    ranges.push({
      subnetNumber: i + 1,
      networkAddress,
      broadcastAddress,
      firstUsableHost,
      lastUsableHost,
      usableHosts,
    });
  }

  return ranges;
}

export function calculateSubnetInfo(
  ip: string,
  cidr: number,
  includeRanges: boolean = false,
  maxRanges: number = 50
): SubnetInfo {
  // Check cache first
  const cacheKey = getCacheKey(ip, cidr, includeRanges, maxRanges);
  const cachedResult = calculationCache.get(cacheKey);
  if (cachedResult) {
    console.log("✅ Cache hit for:", cacheKey);
    return cachedResult;
  }

  console.log("🔄 Computing for:", cacheKey);

  const ipValidation = validateIPAddress(ip);
  if (!ipValidation.isValid) {
    throw new Error(ipValidation.error);
  }

  const cidrValidation = validateCIDR(cidr);
  if (!cidrValidation.isValid) {
    throw new Error(cidrValidation.error);
  }

  const ipNum = ipToNumber(ip);
  const subnetMask = cidrToSubnetMask(cidr);
  const subnetMaskNum = ipToNumber(subnetMask);

  // Calculate network address
  const networkNum = ipNum & subnetMaskNum;
  const networkAddress = numberToIP(networkNum);

  // Calculate broadcast address
  const hostBits = 32 - cidr;
  const broadcastNum = networkNum | ((1 << hostBits) - 1);
  const broadcastAddress = numberToIP(broadcastNum);

  // Calculate usable host range
  const firstUsableHost =
    hostBits > 1 ? numberToIP(networkNum + 1) : networkAddress;
  const lastUsableHost =
    hostBits > 1 ? numberToIP(broadcastNum - 1) : networkAddress;

  // Calculate host counts
  const totalHosts = Math.pow(2, hostBits);
  const usableHosts = hostBits > 1 ? totalHosts - 2 : hostBits === 1 ? 0 : 1;

  // Get IP class information
  const { class: ipClass, description: ipClassDescription } = getIPClass(ip);
  const defaultCIDR = getDefaultCIDRForClass(ipClass);

  // Calculate subnetting information
  const bitsUsedForSubnetting = Math.max(0, cidr - defaultCIDR);
  const numberOfSubnets =
    bitsUsedForSubnetting > 0 ? Math.pow(2, bitsUsedForSubnetting) : 1;

  // Calculate subnet ranges if requested
  let subnetRanges: SubnetRange[] | undefined;
  if (includeRanges) {
    try {
      subnetRanges = calculateSubnetRanges(ip, cidr, maxRanges);
    } catch (error) {
      // If error calculating ranges, continue without them
      subnetRanges = undefined;
    }
  }

  const result: SubnetInfo = {
    networkAddress,
    broadcastAddress,
    firstUsableHost,
    lastUsableHost,
    totalHosts,
    usableHosts,
    subnetMask,
    subnetMaskBinary: subnetMaskToBinary(subnetMask),
    wildcardMask: calculateWildcardMask(subnetMask),
    cidr,
    ipClass,
    ipClassDescription,
    numberOfSubnets,
    bitsUsedForSubnetting,
    subnetRanges,
  };

  // Cache the result
  manageCacheSize();
  calculationCache.set(cacheKey, result);

  return result;
}

// Export function to clear cache if needed
export function clearCalculationCache(): void {
  calculationCache.clear();
  console.log("🗑️ Calculation cache cleared");
}
