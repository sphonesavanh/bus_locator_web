export interface BusData {
  id: string;
  busPlate: string;
  busNumber: string;
  busTypeId: string;
  busTypeName: string;
  busTypeCapacity: number;
  driverId: string;
  driverName: string;
}

export async function fetchBus(): Promise<BusData[]> {
  const response = await fetch("http://localhost:4000/api/bus");
  if (!response.ok) {
    throw new Error("Failed to fetch bus data");
  }

  const data = await response.json();

  // Map backend response to match frontend BusData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((bus: any) => ({
    id: bus.bus_id,
    busPlate: bus.bus_plate,
    busNumber: bus.bus_number,
    busTypeId: bus.bus_type_id,
    busTypeName: bus.bus_type_name,
    busTypeCapacity: bus.bus_type_capacity,
    driverId: bus.driver_id,
    driverName: bus.driver_name,
  }));
}
