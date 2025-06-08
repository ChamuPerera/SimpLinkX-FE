import {
  Activity,
  Building2,
  Calendar,
  CheckCircle,
  Database,
  Globe,
  Lock,
  Network,
  Shield,
  Stethoscope,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const milestones = [
  {
    year: "2023",
    title: "Project Inception",
    description:
      "Government initiative launched to digitize Sri Lanka's healthcare system",
  },
  {
    year: "2024",
    title: "Beta Launch",
    description: "Pilot program with 50 hospitals across major cities",
  },
  {
    year: "2024",
    title: "NIC Integration",
    description:
      "Secured integration with national identity verification system",
  },
  {
    year: "2025",
    title: "National Rollout",
    description: "Full deployment across 500+ hospitals nationwide",
  },
];

export const values = [
  {
    icon: Shield,
    title: "Security First",
    description:
      "Government-grade security protecting sensitive medical data with end-to-end encryption and NIC verification.",
  },
  {
    icon: Users,
    title: "Patient-Centered",
    description:
      "Every feature designed with patient needs in mind, ensuring accessible healthcare for all Sri Lankans.",
  },
  {
    icon: Globe,
    title: "Universal Access",
    description:
      "Breaking down barriers to healthcare access across urban and rural communities nationwide.",
  },
  {
    icon: Activity,
    title: "Innovation",
    description:
      "Leveraging cutting-edge technology to solve traditional healthcare challenges effectively.",
  },
  {
    icon: CheckCircle,
    title: "Reliability",
    description:
      "24/7 system availability with 99.9% uptime, ensuring healthcare services are always accessible.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    description:
      "Regular updates and enhancements based on user feedback and emerging healthcare needs.",
  },
];

export const achievements = [
  { number: "500+", label: "Hospitals Connected", icon: Building2 },
  { number: "15,000+", label: "Registered Doctors", icon: Stethoscope },
  { number: "1M+", label: "Citizens Registered", icon: Users },
  { number: "2M+", label: "Appointments Booked", icon: Calendar },
  { number: "50,000+", label: "Medicine Searches Daily", icon: Database },
  { number: "99.9%", label: "System Uptime", icon: Activity },
];

export const features = [
  {
    icon: Network,
    title: "Nationwide Network",
    description:
      "Comprehensive coverage across all 25 districts of Sri Lanka with seamless connectivity.",
  },
  {
    icon: Lock,
    title: "Data Protection",
    description:
      "Advanced encryption and privacy controls meeting international healthcare data standards.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Instant synchronization of appointments, medicine availability, and medical records.",
  },
];
