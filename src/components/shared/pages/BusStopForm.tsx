import { useState, useEffect } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { BusStopData } from "@/api/busStopAPI";

interface Props {
  initialData?: BusStopData | null;
  onClose: () => void;
  onSave: (data: BusStopData, id?: string) => void;
}

const BusStopForm: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setName(initialData.name);
      setLat(initialData.lat);
      setLng(initialData.lng);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (initialData) {
      onSave({ id, name, lat, lng }, initialData?.id);
    } else {
      onSave({ name, lat, lng } as BusStopData);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="ຊື່ປ້າຍລົດເມ"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Latitude"
        type="number"
        value={lat}
        onChange={(e) => setLat(parseFloat(e.target.value))}
        fullWidth
      />
      <TextField
        label="Longitude"
        type="number"
        value={lng}
        onChange={(e) => setLng(parseFloat(e.target.value))}
        fullWidth
      />
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button onClick={onClose}>ຍົກເລີກ</Button>
        <Button variant="contained" onClick={handleSubmit}>
          ບັນທຶກ
        </Button>
      </Stack>
    </Stack>
  );
};

export default BusStopForm;
