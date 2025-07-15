export interface TripData {
  trip_id: string;
  route_id: string;
  routeName: string;
  bus_id: string;
  busPlate: string;
  start_time: string;
  end_time: string;
}

export async function fetchTrip(): Promise<TripData[]> {
  const response = await fetch("http://localhost:4000/api/trip");
  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((trip: any) => ({
    trip_id: trip.trip_id,
    route_id: trip.route_id,
    routeName: trip.route_name,
    bus_id: trip.bus_id,
    busPlate: trip.bus_plate,
    start_time: trip.start_time,
    end_time: trip.end_time,
  }));
}