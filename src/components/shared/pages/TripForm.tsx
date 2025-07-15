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
import { TripData } from "@/api/tripAPI";

interface Props {
  initialData?: TripData | null;
  onClose: () => void;
  onSave: (data: TripData, id?: string) => void;
}

interface RouteDropdownItem {
  id: string;
  name?: string;
}

interface BusDropdownItem {
  id: string;
  plate?: string;
}

const TripForm: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const [routeId, setRouteId] = useState("");
  const [busId, setBusId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [routes, setRoutes] = useState<RouteDropdownItem[]>([]);
  const [buses, setBuses] = useState<BusDropdownItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setRouteId(initialData.route_id);
      setBusId(initialData.bus_id);
      setStartTime(initialData.start_time);
      setEndTime(initialData.end_time);
    }

    const fetchDropdowns = async () => {
      try {
        const [routeRes, busRes] = await Promise.all([
          fetch("http://localhost:4000/api/route-dropdown"),
          fetch("http://localhost:4000/api/bus-dropdown"),
        ]);

        const routeData = await routeRes.json();
        const busData = await busRes.json();

        setRoutes(routeData);
        setBuses(busData);

        if (!initialData) {
          setRouteId(routeData[0]?.id || "");
          setBusId(busData[0]?.id || "");
        }
      } catch (err) {
        console.error("Failed to fetch dropdowns:", err);
      }
    };

    fetchDropdowns();
  }, [initialData]);

  const handleSubmit = () => {
    if (!routeId || !busId || !startTime || !endTime) return;

    const data: TripData = {
      trip_id: initialData?.trip_id || "",
      route_id: routeId,
      bus_id: busId,
      start_time: startTime,
      end_time: endTime,
      routeName: "",
      busPlate: "",
    };

    onSave(data, initialData?.trip_id);
  };

  return (
    <Stack spacing={2}>
      <FormControl fullWidth required>
        <InputLabel>ຊື່ເສັ້ນທາງ</InputLabel>
        <Select
          value={routeId}
          onChange={(e: SelectChangeEvent) => setRouteId(e.target.value)}
          label="ຊື່ເສັ້ນທາງ"
        >
          {routes.map((route) => (
            <MenuItem key={route.id} value={route.id}>
              {route.id} - {route.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>ທະບຽນລົດເມ</InputLabel>
        <Select
          value={busId}
          onChange={(e: SelectChangeEvent) => setBusId(e.target.value)}
          label="ທະບຽນລົດເມ"
        >
          {buses.map((bus) => (
            <MenuItem key={bus.id} value={bus.id}>
              {bus.id} - {bus.plate}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="ເວລາອອກ"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="ເວລາສິ້ນສຸດ"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        fullWidth
        required
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={onClose}>
          ຍົກເລີກ
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          ບັນທຶກ
        </Button>
      </Stack>
    </Stack>
  );
};

export default TripForm;
