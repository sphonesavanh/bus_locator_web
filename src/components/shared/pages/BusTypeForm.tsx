import { useState, useEffect } from "react";
import { Button, DialogActions, Stack, TextField } from "@mui/material";
import { BusTypeData } from "@/api/busTypeAPI";

interface Props {
  initialData?: BusTypeData | null;
  onClose: () => void;
  onSave: (data: BusTypeData, id?: string) => void;
}

const BusTypeForm: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const [busTypeId, setBusTypeId] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (initialData) {
      setBusTypeId(initialData.bus_type_id);
      setName(initialData.bus_type_name);
      setCapacity(initialData.bus_type_capacity.toString());
    }
  }, [initialData]);

  const handleSubmit = () => {
    const data: BusTypeData = {
      bus_type_id: busTypeId,
      bus_type_name: name,
      bus_type_capacity: parseInt(capacity),
    };
    onSave(data, initialData?.bus_type_id);
  };

  return (
    <Stack spacing={2} mt={1}>
      <TextField
        label="ຊື່ປະເພດລົດເມ"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="ຈຳນວນບ່ອນນັ່ງ"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        fullWidth
      />

      <DialogActions sx={{ justifyContent: "flex-end" }}>
        <Button onClick={onClose}>ຍົກເລີກ</Button>
        <Button onClick={handleSubmit} variant="contained">
          ບັນທຶກ
        </Button>
      </DialogActions>
    </Stack>
  );
};

export default BusTypeForm;
