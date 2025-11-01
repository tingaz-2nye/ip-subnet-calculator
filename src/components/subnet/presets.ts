import { PresetConfig } from "./types";
import {
  HomeIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  CloudIcon,
} from "@heroicons/react/24/outline";

export const presetConfigs: PresetConfig[] = [
  {
    name: "Home Network",
    icon: HomeIcon,
    ip: "192.168.1.0",
    cidr: 24,
    description: "192.168.1.0/24",
  },
  {
    name: "Small Office",
    icon: BuildingOfficeIcon,
    ip: "10.0.0.0",
    cidr: 27,
    description: "10.0.0.0/27",
  },
  {
    name: "Enterprise",
    icon: BuildingOffice2Icon,
    ip: "172.16.0.0",
    cidr: 16,
    description: "172.16.0.0/16",
  },
  {
    name: "Cloud VPC",
    icon: CloudIcon,
    ip: "10.0.0.0",
    cidr: 8,
    description: "10.0.0.0/8",
  },
];
