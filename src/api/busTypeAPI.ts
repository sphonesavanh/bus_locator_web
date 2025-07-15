export interface BusTypeData {
  bus_type_id: string;
  bus_type_name: string;
  bus_type_capacity: number;
}

export async function fetchBusType(): Promise<BusTypeData[]> {
  const response = await fetch("http://localhost:4000/api/bustype");
  if (!response.ok) {
    throw new Error("Failed to fetch bus type data");
  }

  const data = await response.json();

  // Map backend response to match frontend BusTypeData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((busType: any) => ({
    bus_type_id: busType.bus_type_id,
    bus_type_name: busType.bus_type_name,
    bus_type_capacity: busType.bus_type_capacity,
  }));
}