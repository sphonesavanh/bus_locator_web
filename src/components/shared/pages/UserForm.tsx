import { useState, useEffect } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { UserData } from "@/api/userAPI";

interface Props {
  initialData?: UserData | null;
  onClose: () => void;
  onSave: (data: UserData, id?: string) => void;
}

const UserForm: React.FC<Props> = ({ initialData, onClose, onSave }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setName(initialData.name);
      setEmail(initialData.email);
      setTel(initialData.tel);
      setPassword(initialData.password || ""); // Optional chaining for password
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({ id, name, email, tel, password }, initialData?.id);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="ຊື່"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="ອີເມວ"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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

export default UserForm;
