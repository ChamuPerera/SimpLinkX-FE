import { permissions } from "@/constants/permissions";
import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
import {
  Calendar1Icon,
  CalendarDays,
  CalendarRange,
  FileText,
  Hospital,
  Settings,
  Shield,
  UserSquare,
} from "lucide-react";
import { FaHospitalAlt } from "react-icons/fa";

export const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
      isActive: true,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: CalendarDays,
      isActive: false,
      permissions: [
        permissions.viewAppointments,
        permissions.manageAppointments,
      ],
    },
    {
      title: "Prescriptions",
      url: "/prescriptions",
      icon: FileText,
      isActive: false,
      permissions: [
        permissions.viewPrescriptions,
        permissions.createPrescriptions,
        permissions.updatePrescriptions,
        permissions.deletePrescriptions,
      ],
    },
    {
      title: "People",
      url: "/people",
      icon: PersonIcon,
      isActive: false,
      permissions: [
        permissions.viewUsers,
        permissions.createUsers,
        permissions.updateUsers,
        permissions.updateUsersHospital,
      ],
    },
    {
      title: "Hospitals",
      url: "/hospitals",
      icon: Hospital,
      isActive: false,
      permissions: [permissions.createHospitals, permissions.updateHospitals],
    },
    {
      title: "Roles",
      url: "/roles",
      icon: PersonIcon,
      isActive: false,
      permissions: [
        permissions.viewRoles,
        permissions.createRoles,
        permissions.updateRoles,
      ],
    },
    {
      title: "Permissions",
      url: "/permissions",
      icon: Shield,
      isActive: false,
      permissions: [
        permissions.viewPermissions,
        permissions.createPermissions,
        permissions.updatePermissions,
      ],
    },
    {
      title: "Inventories",
      url: "/inventories",
      icon: Shield,
      isActive: false,
      permissions: [permissions.manageInventories],
    },
    {
      title: "Account",
      url: "/account",
      icon: UserSquare,
      isActive: false,
    },
    {
      title: "Clinics",
      url: "/clinics",
      icon: FaHospitalAlt,
      isActive: false,
      permissions: [permissions.manageHospitals],
    },
    {
      title: "Clinic Dates",
      url: "/clinics/dates",
      icon: CalendarRange,
      isActive: false,
      permissions: [permissions.manageHospitals],
    },
    {
      title: "OPD Dates",
      url: "/opd-dates",
      icon: Calendar1Icon,
      isActive: false,
      permissions: [permissions.manageHospitals],
    },
    {
      title: "Settings",
      url: "/settings/hospital",
      icon: Settings,
      isActive: false,
      permissions: [permissions.manageHospitals],
    },
  ],
};
