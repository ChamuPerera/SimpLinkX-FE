import { Footer, Header } from "@/components/custom";
import { Input } from "@/components/ui";
import { useHospitals } from "@/hooks/use-hospitals";
import { ArrowBigRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export const FindHospitalsPage = () => {
  const [search, setSearch] = useState<string>("");
  const { data, isLoading } = useHospitals({
    currentPage: 0,
    pageSize: 10,
    search: search,
  });
  return (
    <main>
      {/* navbar */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
              Search
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                Hospitals in Sri Lanka
              </span>
            </h1>
          </div>

          {/* input for search */}
          <div className="max-w-2xl mx-auto mt-3">
            <Input
              type="text"
              placeholder="Search hospitals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-gray-400"
            />
          </div>
        </div>
      </section>

      {/* loading screen*/}
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Loading hospitals...</p>
        </div>
      )}

      {/* hospitals list */}
      {!isLoading && (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.hospitals.map((hospital) => (
              <div
                key={hospital.identifier}
                className="bg-white border shadow-md border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-lg font-medium text-gray-800">
                  {hospital.name}
                </h2>
                <p className="text-gray-600 text-sm">{hospital.address}</p>
                <p className="text-gray-500 text-sm">
                  District: {hospital.district}
                </p>
                <p className="text-gray-500 text-sm">
                  Contact:{" "}
                  <a
                    href={`tel:${hospital.phone}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {hospital.phone}
                  </a>
                </p>
                <p className="text-gray-500 text-sm">
                  Email:{" "}
                  <a
                    href={`mailto:${hospital.email}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {hospital.email}
                  </a>
                </p>
                <p className="text-gray-500 text-sm">
                  Location:{" "}
                  <a
                    href={hospital.location_url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {hospital.location_url ? "View on Map" : "N/A"}
                  </a>
                </p>

                <div className="flex justify-end">
                  <Link
                    to={`/find-hospitals/${hospital.identifier}`}
                    className="bg-blue-600 flex items-center mt-2 hover:bg-blue-700 text-sm text-white px-4 py-1.5 rounded-md transition-colors duration-200"
                  >
                    View Details{" "}
                    <ArrowBigRight className="flex-1 w-5 h-5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}

            {data?.hospitals.length === 0 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center">
                <p className="text-gray-500">No hospitals found.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* footer */}
      <Footer />
    </main>
  );
};
