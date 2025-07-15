import { useState, useEffect } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { DriverData } from "@/api/driverAPI";

interface Props {
  initialData?: DriverData | null;
  onClose: () => void;
  onSave: (data: DriverData, id?: string) => void;
}

const DriverForm: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setName(initialData.name);
      setTel(initialData.tel);
      setPassword(initialData.password);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({ id, name, tel, password, status }, initialData?.id);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="ຊື່ຄົນຂັບ"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="ເບີໂທ"
        value={tel}
        onChange={(e) => setTel(e.target.value)}
        fullWidth
      />
      <TextField
        label="ລະຫັດຜ່ານ"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <TextField
        label="ສະຖານະ"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
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
};

export default DriverForm;