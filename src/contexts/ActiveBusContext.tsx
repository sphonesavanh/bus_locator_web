import React, { createContext, useState, useEffect, useContext } from "react";

interface ActiveBus {
  trip_id: string;
  route_id: string;
  bus_id: string;
  status: string;
  timestamp: string;
  coordinates: [number, number];
}

const ActiveBusContext = createContext<ActiveBus[]>([]);

export const useActiveBuses = () => useContext(ActiveBusContext);

export const ActiveBusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeBuses, setActiveBuses] = useState<ActiveBus[]>([]);

  useEffect(() => {
    const fetchActiveBuses = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/tracking/allbus/active");
        const data = await res.json();
        if (Array.isArray(data)) {
          setActiveBuses(data);
          console.log("[ActiveBusContext] ✅ Fetched active buses:", data);
        } else {
          console.warn("[ActiveBusContext] ⚠ Unexpected response:", data);
          setActiveBuses([]);
        }
      } catch (err) {
        console.error(
          "[ActiveBusContext] ❌ Error fetching active buses:",
          err
        );
        setActiveBuses([]);
      }
    };

    fetchActiveBuses(); // Initial fetch
    const interval = setInterval(fetchActiveBuses, 3000); // Poll every 3s
    console.log("[ActiveBusContext] 🚀 Polling started...");

    return () => {
      clearInterval(interval);
      console.log("[ActiveBusContext] 🛑 Polling stopped.");
    };
  }, []);

  return (
    <ActiveBusContext.Provider value={activeBuses}>
      {children}
    </ActiveBusContext.Provider>
  );
};
