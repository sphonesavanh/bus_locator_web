import { useState, useEffect } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { BusRouteData } from "@/api/busRouteAPI";

interface Props {
  initialData?: BusRouteData | null;
  onClose: () => void;
  onSave: (data: BusRouteData, id?: string) => void;
}

const BusRouteForm: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({ id, name }, initialData?.id);
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="ຊື່ເສັ້ນທາງ"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button onClick={onClose}>ຍົກເລີກ</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialData ? "ບັນທຶກ" : "ບັນທຶກ"}
        </Button>
      </Stack>
    </Stack>
  );
}

export default BusRouteForm;