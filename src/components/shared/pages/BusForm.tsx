import React, { useState, useEffect } from "react";
import {
  Button,
  DialogActions,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { BusData } from "@/api/busAPI";

interface Props {
  initialData?: BusData | null;
  onClose: () => void;
  onSave: (data: BusData, id?: string) => void;
}

interface BusTypeItem {
  id: string;
  name: string;
}
interface DriverItem {
  driver_id: string;
  driver_name: string;
}

const BusForm: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  // 1) ALWAYS start with an empty string (never null/undefined)
  const [busPlate, setBusPlate] = useState<string>("");
  const [busNumber, setBusNumber] = useState<string>("");
  const [busTypeId, setBusTypeId] = useState<string>("");
  const [driverId, setDriverId] = useState<string>("");

  const [busTypes, setBusTypes] = useState<BusTypeItem[]>([]);
  const [drivers, setDrivers] = useState<DriverItem[]>([]);

  // 2) If editing, seed the form
  useEffect(() => {
    if (initialData) {
      setBusPlate(initialData.busPlate);
      setBusNumber(initialData.busNumber);
      setBusTypeId(initialData.busTypeId);
      setDriverId(initialData.driverId);
    }

    const fetchDropdowns = async () => {
      try {
        const [busTypeRes, driverRes] = await Promise.all([
          fetch("http://localhost:4000/api/bustype-dropdown"),
          fetch("http://localhost:4000/api/driver-dropdown"),
        ]);

        const busTypeData = await busTypeRes.json();
        const driverData = await driverRes.json();

        setBusTypes(busTypeData);
        setDrivers(driverData);

        // ← NEW: default selects on “Add”
        if (!initialData) {
          setBusTypeId(busTypeData[0]?.id ?? "");
          setDriverId(driverData[0]?.driver_id ?? "");
        }
      } catch (error) {
        console.error("Failed to fetch dropdowns:", error);
      }
    };

    fetchDropdowns();
  }, [initialData]);
  

  const handleSubmit = () => {
    if (!busPlate || !busNumber || !busTypeId || !driverId) return;
    const payload: BusData = {
      id: initialData?.id ?? "",
      busPlate,
      busNumber,
      busTypeId,
      busTypeCapacity: initialData?.busTypeCapacity ?? 0,
      driverId,
      driverName:
        drivers.find((d) => d.driver_id === driverId)?.driver_name ?? "",
      busTypeName: busTypes.find((t) => t.id === busTypeId)?.name ?? "",
    };
    onSave(payload, initialData?.id);
  };

  return (
    <Stack spacing={2} mt={1}>
      <TextField
        label="ທະບຽນ"
        value={busPlate}
        onChange={(e) => setBusPlate(e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="ໝາຍເລກ"
        value={busNumber}
        onChange={(e) => setBusNumber(e.target.value)}
        fullWidth
        required
      />

      <FormControl fullWidth required>
        <InputLabel>ປະເພດລົດເມ</InputLabel>
        <Select
          id="busType-select"
          value={busTypeId}
          onChange={(e) => setBusTypeId(e.target.value)}
          label="ປະເພດລົດເມ"
        >
          {/* placeholder so "" is always valid */}

          {busTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.id} - {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel htmlFor="driver-select">ຄົນຂັບ</InputLabel>
        <Select
          id="driver-select"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          label="ຄົນຂັບ"
        >
          {drivers.map((d) => (
            <MenuItem key={d.driver_id} value={d.driver_id}>
              {d.driver_id} - {d.driver_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DialogActions sx={{ justifyContent: "flex-end" }}>
        <Button onClick={onClose}>ຍົກເລີກ</Button>
        <Button onClick={handleSubmit} variant="contained">
          ບັນທຶກ
        </Button>
      </DialogActions>
    </Stack>
  );
};

export default BusForm;
