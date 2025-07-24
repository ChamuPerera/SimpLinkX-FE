import {
  Activity,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Search,
  Shield,
} from "lucide-react";

export const services = [
  {
    icon: Calendar,
    title: "Online Appointments",
    description:
      "Book appointments with your preferred doctors across Sri Lanka's hospital network",
    features: [
      "Real-time availability",
      "Instant confirmation",
      "Reminder notifications",
    ],
  },
  {
    icon: Search,
    title: "Medicine Finder",
    description:
      "Search medicine availability across hospitals and find nearest alternatives",
    features: ["Real-time inventory", "Alternative suggestions"],
  },
  {
    icon: Building2,
    title: "Hospital Directory",
    description:
      "Comprehensive database of hospitals, specialties, and medical services",
    features: ["Detailed profiles", "Contact information"],
  },
];

export const features = [
  {
    icon: Shield,
    title: "NIC Integration",
    description:
      "Secure registration using Sri Lankan National Identity Card for verified access",
  },
  {
    icon: Activity,
    title: "Real-time Updates",
    description:
      "Live inventory tracking and appointment availability across all connected hospitals",
  },
  {
    icon: MapPin,
    title: "Location-based Services",
    description:
      "Find nearest hospitals, available medicines, and alternative locations instantly",
  },
  {
    icon: Clock,
    title: "24/7 Access",
    description:
      "Round-the-clock access to medical services and emergency information",
  },
];
