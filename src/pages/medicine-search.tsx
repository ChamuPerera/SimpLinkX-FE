import type { Inventory } from "@/services/inventory";

import { Footer, Header, Loader, Pagination } from "@/components/custom";
import { Input } from "@/components/ui";
import { useHospitalByIdentifier } from "@/hooks/use-hospitals";
import { useInventories } from "@/hooks/use-inventory";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Navigate, useParams } from "react-router";

export const MedicineSearchPage = () => {
  // get identifier from url /:identifier
  const { identifier } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });

  const { data: hospital, isLoading: isLoadingHospital } =
    useHospitalByIdentifier(identifier as string);
  const { data: inventory, isLoading: isLoadingInventory } = useInventories({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search: searchTerm,
    identifier: identifier as string,
  });

  if (isLoadingHospital) return <Loader />;

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Hospital not found.</p>
      </div>
    );
  }

  // Check if inventory is activated for the hospital
  if (!hospital?.is_inventory_activated) {
    return <Navigate to={`/find-hospitals/${identifier}`} replace />;
  }

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

      {/* Medicine details Section */}
      <section className="py-12">
        {/* search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Medicines
          </h2>
          <p className="mt-2 text-gray-600">
            Search for medicines available at {hospital?.name}
          </p>
          {/* Search Bar */}
          <div className="mt-6">
            <Input
              type="text"
              placeholder="Search for medicines..."
              className="border border-gray-300 rounded-lg py-2 px-4 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoadingInventory && (
          <div className="flex justify-center items-center mt-6">
            <FaSpinner className="animate-spin text-blue-600" size={24} />
            <span className="ml-2 text-gray-600">Loading medicines...</span>
          </div>
        )}

        {/* medicine details */}
        {!isLoadingInventory && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            {inventory && inventory?.inventories?.length > 0 && (
              <div className="grid grid-cols-1">
                {inventory?.inventories?.map((item: Inventory) => (
                  <div
                    key={item.id}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-300 hover:shadow-lg transition-shadow duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.drug_name || "N/A"}{" "}
                      {item.weight ? `(${item.weight}mg)` : ""}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Brand: {item.brand_name || "N/A"}
                    </p>
                    {/* details */}
                    <div className="flex justify-between gap-x-4 flex-col sm:flex-row">
                      <p className="text-sm text-gray-600 capitalize">
                        Type: {item.type || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Available Quantity: {item.available_quantity}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        Status:{" "}
                        {(item?.available_quantity ?? 0) > 0 ? (
                          <span className="text-green-600 font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Out of Stock
                          </span>
                        )}
                      </p>
                    </div>

                    {/* near by suggestions */}
                    {item?.nearby_suggestions &&
                      item?.nearby_suggestions?.length > 0 && (
                        <div className="mt-2 border-t border-gray-200 pt-2">
                          <h4 className="text-sm font-semibold text-gray-800">
                            Nearby Hospitals:
                          </h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {item.nearby_suggestions.map((suggestion) => (
                              <li key={suggestion.hospital.id}>
                                <span>
                                  {suggestion.hospital.name} -{" "}
                                  <a
                                    href={`tel:${suggestion.hospital.phone}`}
                                    className="text-blue-600 hover:underline me-3"
                                  >
                                    {suggestion.hospital.phone}
                                  </a>
                                  <p className="text-xs font-medium ps-10">
                                    <ArrowRightIcon className="inline-block size-3.5" />
                                    Approximate Distance*:{" "}
                                    {suggestion.distance_km} km (
                                    <a
                                      href={suggestion.hospital.location_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View on Map
                                    </a>
                                    )
                                  </p>
                                  <p className="text-xs font-medium ps-10">
                                    <ArrowRightIcon className="inline-block size-3.5 capitalize" />
                                    Available Medicines:{" "}
                                    {suggestion.total_quantity}{" "}
                                    {suggestion.medicine.type}
                                  </p>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            {inventory && inventory?.inventories?.length === 0 && (
              <p className="text-gray-500">No medicines found.</p>
            )}
          </div>
        )}

        {/* pagination */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Pagination
            setPagination={setPagination}
            pagination={{
              currentPage: pagination.currentPage,
              pageSize: pagination.pageSize,
              from: inventory?.from || 0,
              to: inventory?.to || 0,
              total: inventory?.total || 0,
              endPage: inventory?.endPage || 0,
            }}
          />
        </div>

        {/* Note */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <p className="text-xs text-gray-500">
            Note: Approximate distances are calculated based on the hospital's
            location and may vary based on the actual route taken.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
