import { useState, useEffect } from "react";
import Tracking from "./Tracking";

interface ActiveTrip {
  trip_id: string;
  route_id: string;
}

export default function LiveTrackingPage({ busId }: { busId: string }) {
  const [selectedRoute, setSelectedRoute] = useState("R_ALL");
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [loadingTrip, setLoadingTrip] = useState(false);

  // fetch current trip by busId
  useEffect(() => {
    if (!busId) return;
    setLoadingTrip(true);

    fetch(`http://localhost:4000/api/tracking/current/${busId}`)
      .then((r) => {
        if (!r.ok) throw new Error("No active trip");
        return r.json() as Promise<ActiveTrip>;
      })
      .then((trip) => {
        setActiveTrip(trip);
        setSelectedRoute(trip.route_id);
      })
      .catch(() => setActiveTrip(null))
      .finally(() => setLoadingTrip(false));
  }, [busId]);

  if (loadingTrip) return <div>Loading trip…</div>;

  return (
    <div className="relative w-full h-full">
      <Tracking
        routeId={selectedRoute}
        trip_id={activeTrip?.trip_id}
        pollInterval={3000}
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
          <option>ເລືອກເສັ້ນທາງ</option>
          <option value="R001">ຕະຫຼາດເຊົ້າ - ທ່າເດື່ອ - ຂົວມິດຕະພາບ</option>
          <option value="R001-1">ຂົວມິດຕະພາບ - ທ່າເດື່ອ - ຕະຫຼາດເຊົ້າ</option>
          <option value="R002">ຕະຫຼາດເຊົ້າ - ທ່າງ່ອນ</option>
          <option value="R002-1">ທ່າງອນ - ຕະຫຼາດເຊົ້າ</option>
        </select>
      </div>
    </div>
  );
}
