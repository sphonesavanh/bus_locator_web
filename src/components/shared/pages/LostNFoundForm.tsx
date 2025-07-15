import { useState, useEffect } from "react";
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
import { LostNFoundData, LostNFoundSubmitData } from "@/api/lostnfoundAPI";

interface Props {
  initialData?: LostNFoundData | null;
  onClose: () => void;
  onSave: (data: LostNFoundSubmitData, id?: string) => void;
  routeOptions: { id: string; name: string }[];
  busOptions: { id: string; plate: string }[];
  userOptions: { id: string; name: string }[];
}

const LostNFoundForm: React.FC<Props> = ({
  initialData,
  onClose,
  onSave,
  routeOptions,
  busOptions,
  userOptions,
}) => {
  const [routeId, setRouteId] = useState("");
  const [busId, setBusId] = useState("");
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!routeId || !busId || !userId || !description) {
      alert("Please fill all fields");
      return;
    }

    const submitData: LostNFoundSubmitData = {
      route_id: routeId,
      bus_id: busId,
      user_id: userId,
      description: description,
    };

    onSave(submitData, initialData?.lost_id);
  };

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel>ຊື່ເສັ້ນທາງ</InputLabel>
        <Select
          sx={{ color: "black" }}
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
        >
          {routeOptions.map((route) => (
            <MenuItem sx={{ color: "black" }} key={route.id} value={route.id}>
              {route.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>ທະບຽນລົດ</InputLabel>
        <Select value={busId} onChange={(e) => setBusId(e.target.value)}>
          {busOptions.map((bus) => (
            <MenuItem key={bus.id} value={bus.id}>
              {bus.plate}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>ຊື່ຜູ້ໃຊ້ງານ</InputLabel>
        <Select
          style={{ color: "black" }}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          {userOptions.map((user) => (
            <MenuItem style={{ color: "black" }} key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="ຄຳອະທິບາຍ"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
      />

      <DialogActions>
        <Button onClick={onClose}>ຍົກເລີກ</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialData ? "ບັນທຶກ" : "ບັນທຶກ"}
        </Button>
      </DialogActions>
    </Stack>
  );
};

export default LostNFoundForm;
