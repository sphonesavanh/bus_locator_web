import { useEffect, useState } from "react";
import LiveTrackingPage from "./LiveTrackingPage";

interface ActiveDriver {
  driver_id: number;
  driver_name: string;
  bus_id: string;
  route_id: string;
  trip_id: number;
}

export default function DynamicTrackingWrapper() {
  const [drivers, setDrivers] = useState<ActiveDriver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | "">("");
  const [busId, setBusId] = useState<string | null>(null);

  // 1) Load all active drivers and auto-select the first one
  useEffect(() => {
    fetch("http://localhost:4000/api/active-drivers")
      .then((r) => r.json())
      .then((data: ActiveDriver[]) => {
        setDrivers(data);
        if (data.length > 0) setSelectedDriverId(data[0].driver_id);
      })
      .catch(console.error);
  }, []);

  // 2) When driver changes, fetch its bus_id
  useEffect(() => {
    if (!selectedDriverId) return;
    fetch(`http://localhost:4000/api/active-drivers/${selectedDriverId}`)
      .then((r) => r.json())
      .then((d: { bus_id: string }) => setBusId(d.bus_id))
      .catch(() => setBusId(null));
  }, [selectedDriverId]);

  return (
    <div className="relative h-full">
      {/* Driver selector, positioned to the right of the route dropdown */}
      <div className="absolute top-35 left-4 z-20 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
        <label className="block text-gray-700 font-semibold mb-2">
          ເລືອກຄົນຂັບ
        </label>
        <select
          value={selectedDriverId}
          onChange={(e) => setSelectedDriverId(e.target.value)}
          className="block w-48 bg-white text-gray-900 border border-gray-300 rounded-md p-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {drivers.map((d) => (
            <option key={d.driver_id} value={d.driver_id}>
              {d.driver_name} ({d.bus_id})
            </option>
          ))}
        </select>
      </div>

      {/* Map + LiveTrackingPage */}
      {busId ? (
        <div className="w-full h-full">
          <LiveTrackingPage busId={busId} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Loading bus info…
        </div>
      )}
    </div>
  );
}
