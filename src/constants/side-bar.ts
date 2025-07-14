import { permissions } from "@/constants/permissions";
import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
import { CalendarDays, Hospital, Shield, UserSquare, FileText  } from "lucide-react";
import { BsSpeedometer2 } from "react-icons/bs";

export const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
      isActive: true,
    },
    {
      title: "Appoinments",
      url: "/appoinments",
      icon: CalendarDays,
      isActive: false,
    },
    {
      title: "Prescriptions",
      url: "/prescriptions",
      icon: FileText,
      isActive: false,
      permissions: [permissions.viewPrescriptions],
    },
    {
      title: "Calculate NPM Risk",
      url: "/calculate-npm-risk",
      icon: BsSpeedometer2,
      isActive: false,
      permissions: [permissions.calculateNpmRisk],
    },
    {
      title: "Personal details",
      url: "/personal-details",
      icon: UserSquare,
      isActive: false,
      permissions: [permissions.updatePersonalDetails],
    },
    {
      title: "Staff",
      url: "/staff",
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
  ],
};
