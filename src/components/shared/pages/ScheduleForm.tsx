import { useState, useEffect } from "react";
import {
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { ScheduleData } from "@/api/scheduleAPI";

interface Props {
  initialData?: ScheduleData | null;
  onClose: () => void;
  onSave: (data: ScheduleData, id?: string) => void;
}

interface routeDropdownItem {
  id: string;
  label: string;
}

interface busStopDropdownItem {
  id: string;
  name: string;
}

const ScheduleFrom: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const [tripId, setTripId] = useState("");
  const [busStopId, setBusStopId] = useState("");
  const [plannedArrival, setPlannedArrival] = useState("");
  const [plannedDepartment, setPlannedDepartment] = useState("");

  const [trips, setTrips] = useState<routeDropdownItem[]>([]);
  const [busStops, setBusStops] = useState<busStopDropdownItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setTripId(initialData.trip_id);
      setBusStopId(initialData.bus_stop_id);
      setPlannedArrival(initialData.planned_arrival);
      setPlannedDepartment(initialData.planned_department);
    }

    const fetchDropdowns = async () => {
      try {
        const [tripRes, busStopRes] = await Promise.all([
          fetch("http://localhost:4000/api/trip-dropdown"),
          fetch("http://localhost:4000/api/bus-stop-dropdown"),
        ]);

        const tripData = await tripRes.json();
        const busStopData = await busStopRes.json();

        setTrips(tripData);
        setBusStops(busStopData);
      } catch (err) {
        console.log("Failed to fetch dropdowns:", err);
      }
    };

    fetchDropdowns();
  }, [initialData]);

  const handleSubmit = () => {
    if (!tripId || !busStopId || !plannedArrival || !plannedDepartment) return;

    const data: ScheduleData = {
      trip_id: tripId,
      bus_stop_id: busStopId,
      planned_arrival: plannedArrival,
      planned_department: plannedDepartment,
      bus_stop_name: busStops.find((stop) => stop.id === busStopId)?.name || "",
    };

    onSave(data, initialData?.schedule_id); // only pass id for edit
  };

  return (
    <Stack spacing={2} minWidth={300}>
      <FormControl fullWidth required>
        <InputLabel>ຖ້ຽວທີ</InputLabel>
        <Select
          value={tripId}
          label="ຖ້ຽວທີ"
          onChange={(e: SelectChangeEvent) => setTripId(e.target.value)}
        >
          {trips.map((trip) => (
            <MenuItem key={trip.id} value={trip.id}>
              {trip.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>ປ້າຍລົດເມປາຍທາງ</InputLabel>
        <Select
          value={busStopId}
          label="ປ້າຍລົດເມປາຍທາງ"
          onChange={(e: SelectChangeEvent) => setBusStopId(e.target.value)}
        >
          {busStops.map((stop) => (
            <MenuItem key={stop.id} value={stop.id}>
              {stop.id} - {stop.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="ເວລາອອກ"
        value={plannedDepartment}
        onChange={(e) => setPlannedDepartment(e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="ເວລາຮອດ"
        value={plannedArrival}
        onChange={(e) => setPlannedArrival(e.target.value)}
        fullWidth
        required
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={onClose}>
          ຍົກເລີກ
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          ບັນທຶກ
        </Button>
      </Stack>
    </Stack>
  );
};

export default ScheduleFrom;
