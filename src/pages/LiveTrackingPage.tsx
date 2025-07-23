import { useState } from "react";
import Tracking from "./Tracking";
import { useActiveBuses } from "@/contexts/ActiveBusContext"; // ✅ global polling context

export default function LiveTrackingPage() {
  const [selectedRoute, setSelectedRoute] = useState("R001"); // Default route
  const activeBuses = useActiveBuses();

  // 🛡 Safeguard: Check if activeBuses is an array
  const buses = Array.isArray(activeBuses) ? activeBuses : [];

  // Filter buses for the selected route
  const busOnRoute = buses.find((bus) => bus.route_id === selectedRoute);

  return (
    <div className="relative w-full h-full">
      <Tracking
        routeId={selectedRoute}
        trip_id={busOnRoute?.trip_id} // ✅ Only pass trip_id if active bus exists
        pollInterval={3000} // ✅ still optional
      />

      {/* Route selector at top-left */}
      <div className="absolute top-4 left-4 z-20 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
        <label className="block text-gray-700 font-semibold mb-2">
          ເລືອກເສັ້ນທາງ
        </label>
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="block w-40 bg-white text-gray-900 border border-gray-300 rounded-md p-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="R001">ຕະຫຼາດເຊົ້າ - ທ່າເດື່ອ - ຂົວມິດຕະພາບ</option>
          <option value="R001-1">ຂົວມິດຕະພາບ - ທ່າເດື່ອ - ຕະຫຼາດເຊົ້າ</option>
          <option value="R002">ຕະຫຼາດເຊົ້າ - ທ່າງ່ອນ</option>
          <option value="R002-1">ທ່າງ່ອນ - ຕະຫຼາດເຊົ້າ</option>
        </select>
      </div>
    </div>
  );
}
