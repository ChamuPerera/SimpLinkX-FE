import { Footer, Header } from "@/components/custom";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { districts } from "@/constants/districts";
import { usePharmacies } from "@/hooks/use-pharmacy";
import { useState } from "react";

export const OsusalaPage = () => {
  const [search, setSearch] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const { data, isLoading } = usePharmacies({
    currentPage: 0,
    pageSize: 10,
    search: search,
    district: district,
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
                Nearest Rajya Osusala Outlets
              </span>
            </h1>
          </div>

          {/* input for search */}
          <div className="max-w-2xl mx-auto mt-3 flex gap-2 flex-col sm:flex-row">
            <Input
              type="text"
              placeholder="Search Rajya Osusala outlets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-gray-400"
            />

            <Select
              value={district === "" ? undefined : district}
              onValueChange={(value) =>
                setDistrict(value === "default" ? "" : value)
              }
            >
              <SelectTrigger
                className="w-40 cursor-pointer border-gray-400"
                id="rows-per-page"
              >
                <SelectValue placeholder={"Select District"} />
              </SelectTrigger>
              <SelectContent side="top" className="max-h-60 overflow-y-auto">
                <SelectItem value="default">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem
                    key={district}
                    value={district}
                    className="capitalize"
                  >
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* loading screen*/}
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Loading hospitals...</p>
        </div>
      )}

      {/* pharmacies list */}
      {!isLoading && (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.pharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="bg-white border shadow-md border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-lg font-medium text-gray-800">
                  {pharmacy.name}
                </h2>
                <p className="text-gray-600 text-sm">{pharmacy.address}</p>
                <p className="text-gray-500 text-sm">
                  District: {pharmacy.district}
                </p>
                <p className="text-gray-500 text-sm">
                  Contact:{" "}
                  <a
                    href={`tel:${pharmacy.phone}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {pharmacy.phone}
                  </a>
                </p>
                <p className="text-gray-500 text-sm">
                  Email:{" "}
                  <a
                    href={`mailto:${pharmacy.email}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {pharmacy.email}
                  </a>
                </p>
                <p className="text-gray-500 text-sm">
                  Location:{" "}
                  <a
                    href={pharmacy.location_url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pharmacy.location_url ? "View on Map" : "N/A"}
                  </a>
                </p>
              </div>
            ))}

            {data?.pharmacies.length === 0 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center">
                <p className="text-gray-500">No Rajya Osusala Outlet found</p>
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
