export interface LostNFoundData {
  lost_id: string;
  route_id: string;
  route_name: string;
  bus_id: string;
  bus_plate: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_tel: string;
  description: string;
  lost_date: Date;
  status: string;
}

export interface LostNFoundSubmitData {
  route_id: string;
  bus_id: string;
  user_id: string;
  description: string;
  status: string;
}

export async function fetchLostNFound(): Promise<LostNFoundData[]> {
  const response = await fetch("http://localhost:4000/api/lost-and-found");
  if (!response.ok) {
    throw new Error("Failed to fetch lost and found data");
  }

  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((item: any) => ({
    lost_id: item.lost_id,
    route_name: item.route_name,
    bus_plate: item.bus_plate,
    user_name: item.user_name,
    user_email: item.user_email,
    user_tel: item.user_tel,
    description: item.description,
    lost_date: new Date(item.lost_date),
    status: item.status,
  }));
}

export async function createLostNFound(
  data: LostNFoundSubmitData
): Promise<void> {
  await fetch("http://localhost:4000/api/lost-and-found", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateLostNFound(
  id: string,
  data: LostNFoundSubmitData
): Promise<void> {
  await fetch(`http://localhost:4000/api/lost-and-found/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteLostNFound(id: string): Promise<void> {
  await fetch(`http://localhost:4000/api/lost-and-found/${id}`, {
    method: "DELETE",
  });
}

export async function fetchRoutesDrop() {
  const response = await fetch(
    "http://localhost:4000/api/lost-and-found-dropdown/route"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch route options");
  }
  const data = await response.json();
  return data;
}

export async function fetchBusesDrop() {
  const response = await fetch(
    "http://localhost:4000/api/lost-and-found-dropdown/bus"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch bus options");
  }
  const data = await response.json();
  return data;
}

export async function fetchUsersDrop() {
  const response = await fetch(
    "http://localhost:4000/api/lost-and-found-dropdown/user"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user options");
  }
  const data = await response.json();
  return data;
}
