export interface ActiveDriver {
  driver_id: string;
  bus_id: string;
  route_id: string
  trip_id?: string
}

export async function FetchActiveDrivers(): Promise<ActiveDriver[]> {
  const response = await fetch("http://localhost:4000/api/active-drivers")
  if (!response.ok) {
    throw new Error("Failed to fetch active drivers")
  }
  const data = await response.json()
  return data
}