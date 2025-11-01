import { memo } from "react";
import { getIPClass, getIPClassInfo } from "./ipClassUtils";

interface IPClassBadgeProps {
  ipAddress: string;
  isDark: boolean;
}

export const IPClassBadge = memo(function IPClassBadge({
  ipAddress,
  isDark,
}: IPClassBadgeProps) {
  const ipClass = getIPClass(ipAddress);
  const classInfo = getIPClassInfo(ipClass);

  return (
    <div className="inline-block">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
          classInfo.color.bg
        } ${classInfo.color.border} ${
          isDark ? classInfo.color.dark : classInfo.color.light
        } text-xs font-semibold`}
        title={`${classInfo.name} - ${classInfo.range}`}
      >
        <span>{classInfo.name}</span>
      </div>
    </div>
  );
});
