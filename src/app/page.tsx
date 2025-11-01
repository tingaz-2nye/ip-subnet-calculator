"use client";

import SubnetCalculatorDark from "@/components/SubnetCalculatorDark";
import { PWAInstaller } from "@/components/PWAInstaller";

export default function Home() {
  return (
    <>
      <PWAInstaller />
      <SubnetCalculatorDark />
    </>
  );
}
