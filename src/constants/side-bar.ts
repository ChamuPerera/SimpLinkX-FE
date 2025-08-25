import { permissions } from "@/constants/permissions";
import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
import {
  Calendar1Icon,
  CalendarDays,
  CalendarRange,
  FileText,
  HomeIcon,
  Hospital,
  Settings,
  Shield,
  UserCheck,
  Users,
  Users2,
  UserSquare,
} from "lucide-react";
import { FaHospitalAlt } from "react-icons/fa";
import { RiMedicineBottleFill } from "react-icons/ri";

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
      icon: Users,
      isActive: false,
      permissions: [
        permissions.viewUsers,
        permissions.createUsers,
        permissions.updateUsers,
        permissions.updateUsersHospital,
      ],
    },
    {
      title: "Patients",
      url: "/patients",
      icon: UserCheck,
      isActive: false,
      permissions: [permissions.viewPatients, permissions.managePatients],
    },
    {
      title: "Hospitals",
      url: "/hospitals",
      icon: Hospital,
      isActive: false,
      permissions: [permissions.createHospitals, permissions.updateHospitals],
    },
    {
      title: "Rajya Osusala outlets",
      url: "/pharmacies",
      icon: RiMedicineBottleFill,
      isActive: false,
      permissions: [permissions.managePharmacy],
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
      title: "Clinic Patients",
      url: "/clinic-patients",
      icon: Users2,
      isActive: false,
      permissions: [
        permissions.viewClinicPatients,
        permissions.manageClinicPatients,
      ],
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
    {
      title: "Back to Home",
      url: "/",
      icon: HomeIcon,
      isActive: false,
    },
  ],
};
