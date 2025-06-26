import { BackToTopButton, Footer, Header } from "@/components/custom";
import { features, values } from "@/constants/about";
import { ArrowRight, Eye, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

export const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              About
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                SimpLinkX
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Sri Lanka's pioneering digital healthcare platform, connecting
              millions of citizens with quality medical services through
              innovative technology and government-backed reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Foundation
            </h2>
            <p className="text-xl text-gray-600">
              The principles that drive our mission to transform Sri Lankan
              healthcare
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-blue-50 p-2 rounded-xl flex space-x-2">
              {["mission", "vision", "impact"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "mission" && (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Our Mission
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To democratize healthcare access in Sri Lanka by creating a
                  unified digital platform that connects patients, healthcare
                  providers, and medical institutions. We strive to eliminate
                  barriers to quality healthcare through innovative technology,
                  ensuring every Sri Lankan citizen can access the medical
                  services they need, when they need them, regardless of their
                  location or economic status.
                </p>
              </div>
            )}

            {activeTab === "vision" && (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To establish Sri Lanka as a global leader in digital
                  healthcare innovation, where every citizen enjoys seamless
                  access to comprehensive medical services through cutting-edge
                  technology. We envision a future where healthcare disparities
                  are eliminated, medical information flows efficiently across
                  the nation, and preventive care becomes the foundation of our
                  healthcare system.
                </p>
              </div>
            )}

            {activeTab === "impact" && (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Impact</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Since our launch, SimpLinkX has revolutionized healthcare
                  delivery across Sri Lanka. We've reduced average appointment
                  waiting times by 60%, improved medicine availability tracking
                  by 85%, and connected rural communities with urban medical
                  expertise. Our platform has facilitated over 2 million medical
                  consultations and helped prevent countless medicine shortages
                  through real-time inventory management.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      

      {/* Technology Features */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Technology Excellence
            </h2>
            <p className="text-xl text-blue-100">
              Built on cutting-edge infrastructure for reliability and scale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="bg-white bg-opacity-10 backdrop-blur-lg p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center hover:bg-opacity-20 transition-all duration-200">
                    <Icon className="h-8 w-8 text-blue-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
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
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Join Sri Lanka's Healthcare Revolution
            </h2>
            <p className="text-xl text-gray-600">
              Be part of the transformation that's making quality healthcare
              accessible to every Sri Lankan citizen. Register today and
              experience the future of healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center space-x-2">
                <span>Get Started Today</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold">
                Learn More
              </button>
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
