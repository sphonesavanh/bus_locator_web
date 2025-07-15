export interface BusRouteData {
  id: string;
  name: string;
}

// Call backend
export async function fetchBusRoutes(): Promise<BusRouteData[]> {
  const response = await fetch("http://localhost:4000/api/busroutes");
  if (!response.ok) {
    throw new Error("Failed to fetch bus routes");
  }

  const data = await response.json();

  // Map backend response to match frontend BusRouteData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((route: any) => ({
    id: route.route_id,
    name: route.route_name,
  }));
}