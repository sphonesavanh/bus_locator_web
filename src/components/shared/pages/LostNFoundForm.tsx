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
  const [status, setStatus] = useState("ດຳເນີນການ");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!description || !status) {
      alert("Please fill all fields");
      return;
    }

    if (!initialData && (!routeId || !busId || !userId)) {
      alert("Please fill all fields");
      return;
    }

    const submitData: LostNFoundSubmitData = {
      route_id: initialData ? initialData.route_id : routeId,
      bus_id: initialData ? initialData.bus_id : busId,
      user_id: initialData ? initialData.user_id : userId,
      description,
      status,
    };

    onSave(submitData, initialData?.lost_id);
  };

  return (
    <Stack spacing={2}>
      {isEditMode ? (
        <TextField
          label="ຊື່ເສັ້ນທາງ"
          value={initialData?.route_name}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      ) : (
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
      )}

      {isEditMode ? (
        <TextField
          label="ທະບຽນລົດ"
          value={initialData?.bus_plate}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      ) : (
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
      )}

      {isEditMode ? (
        <TextField
          label="ຊື່ຜູ້ໃຊ້ງານ"
          value={initialData?.user_name}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      ) : (
        <FormControl fullWidth>
          <InputLabel>ຊື່ຜູ້ໃຊ້ງານ</InputLabel>
          <Select
            style={{ color: "black" }}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            {userOptions.map((user) => (
              <MenuItem
                style={{ color: "black" }}
                key={user.id}
                value={user.id}
              >
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <TextField
        label="ຄຳອະທິບາຍ"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>ສະຖານະ</InputLabel>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value="ດຳເນີນການ">ດຳເນີນການ</MenuItem>
          <MenuItem value="ເຫັນແລ້ວ">ເຫັນແລ້ວ</MenuItem>
        </Select>
      </FormControl>

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
