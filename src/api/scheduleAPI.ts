export interface ScheduleData {
  schedule_id?: string;
  trip_id: string;
  bus_stop_id: string;
  bus_stop_name: string;
  planned_arrival: string;
  planned_department: string;
}

export async function fetchSchedule(): Promise<ScheduleData[]> {
  const response = await fetch("http://localhost:4000/api/schedule");
  if (!response.ok) {
    throw new Error("Failed to fetch schedule");
  }

  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((schedule: any) => ({
    schedule_id: schedule.schedule_id,
    trip_id: schedule.trip_id,
    bus_stop_id: schedule.bus_stop_id,
    bus_stop_name: schedule.bus_stop_name,
    planned_arrival: schedule.planned_arrival,
    planned_department: schedule.planned_department,
  }));
}
