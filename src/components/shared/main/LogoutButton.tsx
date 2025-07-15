import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { LogOut } from "lucide-react";

export default function LogoutButton({
  isSidebarOpen,
}: {
  isSidebarOpen: boolean;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleConfirmLogout = () => {
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="border-t border-[#0099c0] mx-0  w-full lg:w-58 rounded-md hover:bg-[#006d88]">
        <button
          onClick={handleOpenDialog}
          className="flex w-full items-center gap-2 rounded-md py-4 mx-14 text-white "
        >
          <LogOut className="h-5 w-5" />
          <span className={`${!isSidebarOpen && "lg:hidden"}`}>ອອກຈາກລະບົບ</span>
        </button>
      </div>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>ຢືນຢັນການອອກຈາກລະບົບ</DialogTitle>
        <DialogContent>ທ່ານຕ້ອງການທີ່ຈະອອກຈາກລະບົບບໍ?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ບໍ່ຕ້ອງການ</Button>
          <Button onClick={handleConfirmLogout} color="error">
            ຕ້ອງການ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
