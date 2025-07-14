import { BackToTopButton, Footer, Header } from "@/components/custom";
import { features, services } from "@/constants/home";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  MapPin,
  Search,
} from "lucide-react";
import { Link } from "react-router";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="gap-y-8 flex flex-col">
              <div className="gap-y-4 flex flex-col">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Sri Lanka's
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                    Digital Health
                  </span>
                  Revolution
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  Connect with hospitals, find medicines, book appointments, and
                  access healthcare services across Sri Lanka - all in one
                  unified platform designed for every citizen.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-3">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-x-2"
                >
                  <span className="font-semibold">Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="border border-blue-500 text-blue-600 px-8 py-2 rounded-md hover:bg-blue-50 transition-all duration-200 font-semibold"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md p-8 shadow-2xl">
                <div className="bg-white rounded-md p-6 flex flex-col gap-y-4">
                  <div className="flex items-center gap-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      NIC Verified Registration
                    </span>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Instant Appointments</span>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Search className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-gray-700">Medicine Availability</span>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-gray-700">Nearest Hospitals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col gap-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your healthcare journey in Sri
              Lanka, from finding doctors to tracking medicine availability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-x-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 gap-y-3 flex-col flex">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {service.title}
                      </h3>
                      <p className="text-gray-600">{service.description}</p>
                      <ul className="gap-y-1 flex flex-col">
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-x-2 text-sm text-gray-500"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center gap-y-4 mb-16 flex flex-col">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Choose SimpLinkX?
            </h2>
            <p className="text-blue-100 max-w-3xl mx-auto">
              Built specifically for Sri Lankan healthcare needs with
              government-grade security and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center gap-y-4 group">
                  <div className="bg-white bg-opacity-10 backdrop-blur-lg p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-200">
                    <Icon className="h-8 w-8 text-blue-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="gap-y-8 flex flex-col">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-gray-600">
              Join thousands of Sri Lankans who trust SimpLinkX for their
              healthcare needs. Register today with your NIC and start accessing
              better healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={"/register"}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
              >
                Register with NIC
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Back to top button */}
      <BackToTopButton />
    </div>
  );
};
