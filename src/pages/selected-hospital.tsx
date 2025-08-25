import { Footer, Header, Loader } from "@/components/custom";
import { useHospitalByIdentifier } from "@/hooks/use-hospitals";
import {
  Activity,
  Building2,
  Info,
  Package,
  QrCode,
  Search,
} from "lucide-react";
import { Link, useParams } from "react-router";

export const SelectedHospitalPage = () => {
  // get identifier from url /:identifier
  const { identifier } = useParams();

  const { data: hospital, isLoading } = useHospitalByIdentifier(
    identifier as string,
  );

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            {/* hospital details */}
            <h1 className="text-xl md:text-3xl font-semibold text-gray-900">
              {hospital?.name}
            </h1>
            <p className="text-lg text-gray-600">
              {hospital?.address} -{" "}
              <span className="capitalize">{hospital?.district}</span> District
            </p>
            <div className="flex gap-4 flex-col sm:flex-row justify-center items-center">
              <p className="text-sm text-gray-500">
                Contact:{" "}
                <a
                  href={`tel:${hospital?.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {hospital?.phone ?? "N/A"}
                </a>
              </p>
              <span className="hidden sm:inline">|</span>
              <p className="text-sm text-gray-500">
                Email:{" "}
                <a
                  href={`mailto:${hospital?.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {hospital?.email ?? "N/A"}
                </a>
              </p>{" "}
              <span className="hidden sm:inline">|</span>
              <p className="text-sm text-gray-500">
                Location:{" "}
                <a
                  href={hospital?.location_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {hospital?.location_url
                    ? "View on Map"
                    : "Location not available"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Clinic Token Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <QrCode className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Get Clinic Token
                    </h2>
                    <p className="text-blue-100">
                      Book your appointment and get digital token
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex space-x-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">How it works:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Select your preferred hospital and clinic</li>
                        <li>• Choose an available date and time slot</li>
                        <li>• Receive a digital token with QR code</li>
                        <li>• Show the token at the hospital reception</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Action Button */}
                <div className="flex justify-end">
                  {hospital?.is_appointment_activated ? (
                    <Link
                      to={`/find-hospitals/${identifier}/token`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Get Token
                    </Link>
                  ) : (
                    <p className="text-sm text-red-500">
                      Token service is currently unavailable
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Medicine Search Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <Search className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Medicine Finder
                    </h2>
                    <p className="text-green-100">
                      Search medicine availability in real-time
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Info */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex space-x-3">
                    <Package className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">
                        Medicine Search Features:
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>• Real-time inventory tracking</li>
                        <li>• Alternative location suggestions</li>
                        <li>• Price comparison across hospitals</li>
                        <li>• Medicine reservation system</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                  {hospital?.is_inventory_activated ? (
                    <Link
                      to={`/find-hospitals/${identifier}/medicines`}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Search Medicines
                    </Link>
                  ) : (
                    <p className="text-sm text-red-500">
                      Medicine search service is currently unavailable
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hospital Network Statistics
            </h2>
            <p className="text-lg text-gray-600">
              Real-time data from across Sri Lanka's healthcare network
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Connected Hospitals</div>
            </div>

            <div className="text-center space-y-2">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">2M+</div>
              <div className="text-sm text-gray-600">Tokens Issued</div>
            </div>

            <div className="text-center space-y-2">
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Daily Searches</div>
            </div>

            <div className="text-center space-y-2">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
