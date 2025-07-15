export interface BusStopData {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

// Call Express Backend
export async function fetchBusStops(): Promise<BusStopData[]> {
  const response = await fetch("http://localhost:4000/api/busstops");
  if (!response.ok) {
    throw new Error("Failed to fetch bus stops");
  }

  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((stop: any) => ({
    id: stop.bus_stop_id,
    name: stop.bus_stop_name,
    lat: stop.bus_stop_lat,
    lng: stop.bus_stop_lng,
  }));
}
