export interface DriverData {
  id: string;
  name: string;
  tel: string;
  password: string;
  status: string;
}

export async function fetchDrivers(): Promise<DriverData[]> {
  const response = await fetch("http://localhost:4000/api/driver");
  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((driver: any) => ({
    id: driver.driver_id,
    name: driver.driver_name,
    tel: driver.driver_phone,
    password: driver.driver_password,
    status: driver.driver_status,
  }));
}