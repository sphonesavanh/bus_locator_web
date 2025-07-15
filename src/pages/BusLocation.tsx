import { useEffect, useState } from "react";
import { fetchBusLocations, BusLocation } from "@/api/busLocationAPI";

const BusLiveMap = () => {
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBusLocations(["101", "102", "103"])
        .then((data) => {
          console.log("Fetched bus locations:", data);
          setBusLocations(data);
        })
        .catch((err) => console.error("Fetch error:", err));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Bus Live Locations</h2>
      <ul>
        {busLocations.length === 0 ? (
          <li>No data found.</li>
        ) : (
          busLocations.map((bus) => (
            <li key={bus.id}>
              Bus {bus.id} → Lat: {bus.lat}, Lng: {bus.lng}, Speed: {bus.speed}{" "}
              m/s
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BusLiveMap;
