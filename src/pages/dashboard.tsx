import { Layout, Loader } from "@/components/custom";
import { useAuth } from "@/hooks/use-auth";
import {
  useLowStockInventories,
  useNearExpiryInventories,
} from "@/hooks/use-inventory";
import { PrivateRoute } from "@/providers/private-route";
import { Suspense } from "react";

const breadcrumb = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Dashboard",
  },
];

export const DashboardPage = () => {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PrivateRoute>
      <Suspense fallback={<Loader />}>
        <Layout breadcrumbs={breadcrumb}>
          {/* Dashboard content */}
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Header row: user info on right */}
            <div className="flex justify-between items-center w-full max-w-6xl mb-6">
              <div /> {/* empty div to push right side */}
              <div className="text-right">
                <div className="text-blue-800 font-semibold">
                  {user?.name ? `Hello, ${user.name}!` : "Hello!"}
                </div>
                <div className="text-gray-500 text-sm">{today}</div>
              </div>
            </div>

            {/* Welcome row: text + logo in same line */}
            <div className="flex flex-wrap justify-center items-center gap-3">
              <h1 className="text-3xl font-extrabold text-blue-800">
                Welcome to
              </h1>
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="logo" className="h-10 w-10" />
                <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SimpLinkX
                </span>
              </div>
            </div>

            {/* Subtext */}
            <p className="text-gray-600 max-w-3xl">
              This is your personal health dashboard. Here you can find useful
              updates about your health and stay connected with your medical
              records.
            </p>

            {/* Pharmacy info */}
            {user?.role === "pharmacist" && <PharmacyStats />}

            {/* Health info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
              {/* Tip 1 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow">
                <h3 className="text-blue-700 font-bold mb-2">
                  💧 Stay Hydrated
                </h3>
                <p className="text-gray-700">
                  Drinking at least 8 glasses of water per day helps maintain
                  good health.
                </p>
              </div>

              {/* Tip 2 */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow">
                <h3 className="text-green-700 font-bold mb-2">
                  🏃‍♂️ Regular Exercise
                </h3>
                <p className="text-gray-700">
                  30 minutes of light activity daily can improve your heart and
                  mood.
                </p>
              </div>

              {/* Tip 3 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 shadow">
                <h3 className="text-yellow-700 font-bold mb-2">
                  😴 Sleep Well
                </h3>
                <p className="text-gray-700">
                  Adults should aim for 7-8 hours of sleep per night for
                  recovery and energy.
                </p>
              </div>

              {/* Tip 4 */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 shadow">
                <h3 className="text-purple-700 font-bold mb-2">
                  🩺 Regular Checkups
                </h3>
                <p className="text-gray-700">
                  Routine health screenings can detect issues early and keep you
                  well.
                </p>
              </div>

              {/* Tip 5 */}
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 shadow">
                <h3 className="text-pink-700 font-bold mb-2">
                  🍎 Healthy Eating
                </h3>
                <p className="text-gray-700">
                  A balanced diet with fruits and vegetables supports immunity
                  and vitality.
                </p>
              </div>

              {/* Tip 6 */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 shadow">
                <h3 className="text-indigo-700 font-bold mb-2">
                  🧘 Mental Wellbeing
                </h3>
                <p className="text-gray-700">
                  Taking time for relaxation and mindfulness helps reduce
                  stress.
                </p>
              </div>
            </div>
            <footer className="text-center text-xs text-gray-500 mt-6">
              &copy; 2025 SimpLinkX. All rights reserved. | A Government of Sri
              Lanka Initiative
            </footer>
          </div>
        </Layout>
      </Suspense>
    </PrivateRoute>
  );
};

const PharmacyStats = () => {
  const { data: nearExpiryInventories } = useNearExpiryInventories();
  const { data: lowStockInventories } = useLowStockInventories();

  return (
    <div className="w-full max-w-5xl bg-red-50 p-4 rounded border border-red-100 shadow">
      <h2 className="font-medium w-full text-start text-gray-800 mb-4 border-b pb-2">
        Pharmacy Inventory Alerts
      </h2>
      <div className="flex gap-y-6 flex-col">
        {/* Near Expiry Medicines - 14 days */}
        <div className="flex flex-col items-start border-b text-sm border-gray-200 pb-4 w-full">
          <h3 className="text-red-500 font-medium mb-2">
            Near Expiry Medicines - 14 days (
            {nearExpiryInventories?.fourteen_days.length} items)
          </h3>
          {nearExpiryInventories &&
          nearExpiryInventories.fourteen_days.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 max-h-48 overflow-y-auto">
              {nearExpiryInventories.fourteen_days.map((item) => (
                <li key={item.batch_id}>
                  {item.medicine.drug_name} - {item.medicine.weight}mg (Batch{" "}
                  {item.batch_number}) - Expires on{" "}
                  {new Date(item.expiry_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No medicines nearing expiry in the next 14 days.
            </p>
          )}
        </div>

        {/* Near Expiry Medicines - 30 days */}
        <div className="flex flex-col items-start border-b text-sm border-gray-200 pb-4 w-full">
          <h3 className="text-orange-600 font-medium mb-2">
            Near Expiry Medicines - 30 days (
            {nearExpiryInventories?.thirty_days.length} items)
          </h3>
          {nearExpiryInventories &&
          nearExpiryInventories.thirty_days.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 max-h-48 overflow-y-auto">
              {nearExpiryInventories.thirty_days.map((item) => (
                <li key={item.batch_id}>
                  {item.medicine.drug_name} - {item.medicine.weight}mg (Batch{" "}
                  {item.batch_number}) - Expires on{" "}
                  {new Date(item.expiry_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No medicines nearing expiry in the next 30 days.
            </p>
          )}
        </div>

        {/* Low Stock Medicines */}
        <div className="flex flex-col items-start border-b text-sm border-gray-200 pb-4 w-full">
          <h3 className="text-red-500 font-medium mb-2">Low Stock Medicines</h3>
          {lowStockInventories &&
          lowStockInventories.low_stock_inventories.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 max-h-48 overflow-y-auto">
              {lowStockInventories.low_stock_inventories.map((item) => (
                <li key={item.id}>
                  {item.drug_name} ({item.weight}mg) - Stock:{" "}
                  {item.total_available_quantity} units
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No low stock medicines.</p>
          )}
        </div>
      </div>
    </div>
  );
};
