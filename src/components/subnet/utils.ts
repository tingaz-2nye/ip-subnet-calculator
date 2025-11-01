import { SubnetInfo } from "@/utils/subnetCalculations";
import { toast } from "react-toastify";
import { TOAST_DURATIONS, TOAST_POSITION } from "./constants";

export const exportToCSV = (subnetInfo: SubnetInfo) => {
  const headers = ["Field", "Value"];

  const summaryData = [
    ["Network Address", subnetInfo.networkAddress],
    ["Broadcast Address", subnetInfo.broadcastAddress],
    ["First Usable Host", subnetInfo.firstUsableHost],
    ["Last Usable Host", subnetInfo.lastUsableHost],
    ["Total Hosts", subnetInfo.totalHosts.toString()],
    ["Usable Hosts", subnetInfo.usableHosts.toString()],
    ["Subnet Mask", subnetInfo.subnetMask],
    ["Wildcard Mask", subnetInfo.wildcardMask],
    ["CIDR Notation", `/${subnetInfo.cidr}`],
    ["IP Class", subnetInfo.ipClass],
    ["Number of Subnets", subnetInfo.numberOfSubnets?.toString() || "N/A"],
  ];

  const csvContent = [
    headers.join(","),
    ...summaryData.map((row) => row.join(",")),
    "",
    "Subnet Ranges:",
    "Subnet,Network,First Host,Last Host,Broadcast",
    ...(subnetInfo.subnetRanges || []).map((range, index) =>
      [
        index + 1,
        range.networkAddress,
        range.firstUsableHost,
        range.lastUsableHost,
        range.broadcastAddress,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `subnet-${subnetInfo.networkAddress.replace(/\./g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  toast.success("CSV file exported successfully!", {
    position: TOAST_POSITION,
    autoClose: TOAST_DURATIONS.LONG,
  });
};

export const exportToJSON = (subnetInfo: SubnetInfo) => {
  const jsonContent = JSON.stringify(subnetInfo, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `subnet-${subnetInfo.networkAddress.replace(/\./g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);

  toast.success("JSON file exported successfully!", {
    position: TOAST_POSITION,
    autoClose: TOAST_DURATIONS.LONG,
  });
};

export const copyToClipboard = async (text: string, label: string) => {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`, {
        position: TOAST_POSITION,
        autoClose: TOAST_DURATIONS.NORMAL,
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      textArea.remove();

      if (successful) {
        toast.success(`${label} copied to clipboard!`, {
          position: TOAST_POSITION,
          autoClose: TOAST_DURATIONS.NORMAL,
        });
      } else {
        throw new Error("execCommand failed");
      }
    }
  } catch (err) {
    console.error("Failed to copy:", err);
    toast.error("Failed to copy to clipboard. Please copy manually.", {
      position: TOAST_POSITION,
      autoClose: TOAST_DURATIONS.LONG,
    });
  }
};
