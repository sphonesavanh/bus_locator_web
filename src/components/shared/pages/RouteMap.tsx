import { useState, useEffect } from "react";
import Tracking from "@/pages/Tracking";

interface ActiveTrip {
  trip_id: string;
  route_id: string;
}

export default function RouteMap({ busId }: { busId: string }) {
  const [selectedRoute, setSelectedRoute] = useState("R001");
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [loadingTrip, setLoadingTrip] = useState(true);

  // fetch active trip by busId
  useEffect(() => {
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

  if (loadingTrip) return <div>Loading your active trip…</div>;
  if (!activeTrip) return <div>No active trip for bus {busId}</div>;

  return (
    <div className="relative w-full h-full">
      <Tracking routeId={selectedRoute} trip_id={activeTrip.trip_id} />
      <div className="absolute top-4 left-4 z-20 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
        <label className="block text-gray-700 font-semibold mb-2">
          Select Route
        </label>
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="block w-40 bg-white text-gray-900 border border-gray-300 rounded-md p-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="R001">Route 1</option>
          <option value="R001-1">Route 1-1</option>
        </select>
      </div>
    </div>
  );
}
