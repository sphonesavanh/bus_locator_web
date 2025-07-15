export interface BusLocation {
  id: string;
  status: number;
  route_id: string;
  lat: number;
  lng: number;
  accuracy: number;
  speed: number;
  heading: number;
  date: Date;
}

export async function fetchBusLocations(
  busIds: string[]
): Promise<BusLocation[]> {
  const query = busIds.map((id) => `ids[]=${encodeURIComponent(id)}`).join("&");
  const response = await fetch(
    `http://localhost:4000/api/buslocations?${query}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bus locations");
  }

  return await response.json();
}
