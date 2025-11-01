# IP Subnet Calculator

A modern web-based IP subnet calculator built with Next.js, React, and TypeScript. Calculate comprehensive network information from IP addresses and CIDR notation, including IP address classes, subnet masks, host ranges, and subnetting details.

## Features

### Core Calculations

- **Network Address** - Base address of the subnet
- **Broadcast Address** - Last address in the subnet range
- **First/Last Usable Host** - Available IP addresses for devices
- **Total & Usable Hosts** - Host capacity calculations
- **Subnet Mask** - In both decimal and binary formats
- **Wildcard Mask** - Useful for Access Control Lists (ACLs)

### IP Address Classification

- **IP Classes A-E** - Automatic detection and description
- **Default CIDR** - Auto-suggestion based on IP class
- **Class Information** - Detailed explanations for each class

### Subnetting Information

- **Number of Subnets** - When subnetting is applied
- **Bits Used for Subnetting** - Borrowed bits calculation
- **Mathematical Formulas** - Clear explanation of calculations

### Subnet Ranges

- **Range Calculation** - Generate multiple subnet ranges from a base network
- **Detailed Range Table** - Network, broadcast, and usable host addresses for each subnet
- **Flexible Target CIDR** - Specify target subnet size for range generation
- **Visual Organization** - Clean tabular display with up to 50 subnet ranges

## Technology Stack

- **Next.js 15+** - React framework with App Router
- **React 18+** - User interface components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling framework
- **ESLint** - Code quality and consistency

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd IpSubnetCalculator
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) (or the next available port) in your browser.

## Usage

1. **Enter IP Address**: Input any valid IPv4 address (e.g., `192.168.1.1`)
2. **Set Base CIDR Prefix**: Enter a value from 0-32 (e.g., `24` for a /24 network)
3. **Optional - Enable Subnet Ranges**: Check the box to show subnet ranges
4. **Set Target CIDR**: When ranges are enabled, specify the target subnet size (e.g., `26`)
5. **Calculate**: Click the "Calculate Network" button to see results
6. **View Results**: Comprehensive information displayed in organized sections

### Example Calculations

#### Class C Network

- **Input**: `192.168.1.100/24`
- **Network**: `192.168.1.0`
- **Broadcast**: `192.168.1.255`
- **Usable Hosts**: `254` (192.168.1.1 - 192.168.1.254)

#### Subnetted Class B

- **Input**: `172.16.0.0/20`
- **Subnets**: `16` (borrowed 4 bits from default /16)
- **Hosts per Subnet**: `4094`

#### Subnet Ranges Example

- **Base Network**: `192.168.1.0/24`
- **Target CIDR**: `/26` (creating 4 subnets)
- **Result**: 4 subnets each with 62 usable hosts
  - Subnet 1: `192.168.1.0/26` (192.168.1.1 - 192.168.1.62)
  - Subnet 2: `192.168.1.64/26` (192.168.1.65 - 192.168.1.126)
  - Subnet 3: `192.168.1.128/26` (192.168.1.129 - 192.168.1.190)
  - Subnet 4: `192.168.1.192/26` (192.168.1.193 - 192.168.1.254)

## Mathematical Formulas

The calculator uses these standard networking formulas:

- **Number of Subnets**: `2^n` (where n = borrowed bits)
- **Hosts per Subnet**: `2^h - 2` (where h = host bits)
- **Network Address**: `IP AND Subnet Mask`
- **Broadcast Address**: `Network Address + (2^h - 1)`
- **Wildcard Mask**: `255.255.255.255 - Subnet Mask`

## IP Address Classes

| Class | Range                       | Default CIDR | Purpose         |
| ----- | --------------------------- | ------------ | --------------- |
| A     | 1.0.0.0 - 126.255.255.255   | /8           | Large networks  |
| B     | 128.0.0.0 - 191.255.255.255 | /16          | Medium networks |
| C     | 192.0.0.0 - 223.255.255.255 | /24          | Small networks  |
| D     | 224.0.0.0 - 239.255.255.255 | N/A          | Multicast       |
| E     | 240.0.0.0 - 255.255.255.255 | N/A          | Experimental    |

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page component
├── components/
│   └── SubnetCalculator.tsx # Main calculator component
└── utils/
    └── subnetCalculations.ts # Core calculation logic
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Organization

- **Components**: Reusable UI components with TypeScript interfaces
- **Utils**: Pure calculation functions with comprehensive validation
- **Styling**: Tailwind CSS with responsive design patterns
- **Error Handling**: Comprehensive input validation and user feedback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Network engineering principles and formulas
- Next.js and React communities
- Tailwind CSS for styling utilities
