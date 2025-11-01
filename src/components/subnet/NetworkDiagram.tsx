import { memo } from "react";
import { SubnetInfo } from "@/utils/subnetCalculations";

interface NetworkDiagramProps {
  result: SubnetInfo;
  isDark: boolean;
}

export const NetworkDiagram = memo(function NetworkDiagram({
  result,
  isDark,
}: NetworkDiagramProps) {
  const hostBits = 32 - result.cidr;
  const networkBits = result.cidr;

  // Create bit representation
  const renderBitBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 32; i++) {
      const isNetworkBit = i < networkBits;
      boxes.push(
        <div
          key={i}
          className={`flex flex-col items-center justify-center p-1 border ${
            isDark ? "border-slate-600" : "border-gray-300"
          } ${
            isNetworkBit
              ? isDark
                ? "bg-blue-500/20 border-blue-500/50"
                : "bg-blue-100 border-blue-300"
              : isDark
              ? "bg-green-500/20 border-green-500/50"
              : "bg-green-100 border-green-300"
          } text-xs font-mono`}
          style={{ minWidth: "20px", minHeight: "28px" }}
        >
          <span className={isDark ? "text-gray-300" : "text-gray-700"}>
            {i + 1}
          </span>
        </div>
      );
    }
    return boxes;
  };

  // Subnet visualization
  const renderSubnetVisualization = () => {
    const subnetsToShow = Math.min(result.numberOfSubnets, 16);
    const subnetWidth = 100 / subnetsToShow;

    return (
      <div className="w-full h-12 flex border rounded overflow-hidden">
        {Array.from({ length: subnetsToShow }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 flex items-center justify-center text-xs font-semibold border-r last:border-r-0 ${
              isDark
                ? "bg-linear-to-br from-purple-500/20 to-pink-500/20 border-slate-600 text-purple-300"
                : "bg-linear-to-br from-purple-100 to-pink-100 border-purple-200 text-purple-700"
            }`}
            style={{ minWidth: `${subnetWidth}%` }}
          >
            {i < 8 ? `#${i + 1}` : i === 8 ? "..." : ""}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`${
        isDark ? "bg-slate-800/80" : "bg-blue-50/50"
      } backdrop-blur rounded-lg p-6 mb-6 border ${
        isDark ? "border-slate-700" : "border-blue-200"
      }`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          isDark ? "text-blue-400" : "text-blue-600"
        }`}
      >
        Network Visualization
      </h2>

      {/* Bit Representation */}
      <div className="mb-6">
        <h3
          className={`text-sm font-semibold mb-3 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          32-Bit Address Structure
        </h3>
        <div className="grid grid-cols-16 gap-0.5 mb-2 overflow-x-auto">
          {renderBitBoxes()}
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded ${
                isDark
                  ? "bg-blue-500/20 border border-blue-500/50"
                  : "bg-blue-100 border border-blue-300"
              }`}
            ></div>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>
              Network Bits ({networkBits})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded ${
                isDark
                  ? "bg-green-500/20 border border-green-500/50"
                  : "bg-green-100 border border-green-300"
              }`}
            ></div>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>
              Host Bits ({hostBits})
            </span>
          </div>
        </div>
      </div>

      {/* Subnet Division */}
      {result.numberOfSubnets > 1 && (
        <div className="mb-6">
          <h3
            className={`text-sm font-semibold mb-3 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Subnet Division
            {result.numberOfSubnets > 16 && (
              <span className="ml-2 text-xs font-normal opacity-70">
                (Showing first 16 of {result.numberOfSubnets.toLocaleString()})
              </span>
            )}
          </h3>
          {renderSubnetVisualization()}
        </div>
      )}

      {/* Address Range Visualization */}
      <div>
        <h3
          className={`text-sm font-semibold mb-3 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Address Range
        </h3>
        <div className="space-y-2">
          <div
            className={`flex items-center gap-2 p-3 rounded ${
              isDark ? "bg-slate-900/50" : "bg-white"
            }`}
          >
            <div
              className={`px-3 py-1 rounded text-xs font-semibold ${
                isDark
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              Network
            </div>
            <div
              className={`font-mono text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {result.networkAddress}
            </div>
          </div>

          <div className="flex items-center justify-center py-2">
            <div
              className={`w-0.5 h-8 ${isDark ? "bg-slate-600" : "bg-gray-300"}`}
            ></div>
          </div>

          <div
            className={`flex items-center gap-2 p-3 rounded ${
              isDark ? "bg-slate-900/50" : "bg-white"
            }`}
          >
            <div
              className={`px-3 py-1 rounded text-xs font-semibold ${
                isDark
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-100 text-green-700"
              }`}
            >
              First Host
            </div>
            <div
              className={`font-mono text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {result.firstUsableHost}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div
              className={`px-3 py-1 rounded text-xs ${
                isDark
                  ? "bg-slate-700 text-gray-400"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {result.usableHosts.toLocaleString()} usable hosts
            </div>
          </div>

          <div
            className={`flex items-center gap-2 p-3 rounded ${
              isDark ? "bg-slate-900/50" : "bg-white"
            }`}
          >
            <div
              className={`px-3 py-1 rounded text-xs font-semibold ${
                isDark
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-100 text-green-700"
              }`}
            >
              Last Host
            </div>
            <div
              className={`font-mono text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {result.lastUsableHost}
            </div>
          </div>

          <div className="flex items-center justify-center py-2">
            <div
              className={`w-0.5 h-8 ${isDark ? "bg-slate-600" : "bg-gray-300"}`}
            ></div>
          </div>

          <div
            className={`flex items-center gap-2 p-3 rounded ${
              isDark ? "bg-slate-900/50" : "bg-white"
            }`}
          >
            <div
              className={`px-3 py-1 rounded text-xs font-semibold ${
                isDark
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              Broadcast
            </div>
            <div
              className={`font-mono text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {result.broadcastAddress}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
