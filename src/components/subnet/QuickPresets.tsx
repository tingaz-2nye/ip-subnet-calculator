import { presetConfigs } from "./presets";

interface QuickPresetsProps {
  onLoadPreset: (ip: string, cidr: number) => void;
  isDark: boolean;
}

export function QuickPresets({ onLoadPreset, isDark }: QuickPresetsProps) {
  return (
    <div className="mb-6">
      <div
        className={`text-sm font-medium mb-3 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Quick Presets:
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {presetConfigs.map((preset) => {
          const IconComponent = preset.icon;
          return (
            <button
              key={preset.name}
              onClick={() => onLoadPreset(preset.ip, preset.cidr)}
              className={`flex flex-col items-center px-4 py-2 rounded text-sm font-medium transition-colors ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              <IconComponent className="w-5 h-5 mb-1" />
              <span>{preset.name}</span>
              <div className="text-xs opacity-75">{preset.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
