import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserForm from "@/components/shared/pages/UserForm";
import { fetchUsers, UserData } from "@/api/userAPI";
import { handleExportPDF } from "@/components/reports/UserReport";

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  useEffect(() => {
    document.title = "Users | Bus Locator";
    fetchUsers()
      .then(setUsers)
      .catch((error) => console.error(error));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || // optional chaining prevents error
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) // optional: filter by email too
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<UserData | null>(null);

  const totalItems = filteredUsers.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const currentItems = filteredUsers.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user: UserData) => {
    setEditData(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (id: string) => {
    await fetch(`http://localhost:4000/api/users/${id}`, { method: "DELETE" });
    const updated = await fetchUsers();
    setUsers(updated);
  };

  const handleSaveUser = async (data: UserData, id?: string) => {
    if (id) {
      // update
      await fetch(`http://localhost:4000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          tel: data.tel,
        }),
      });
    } else {
      // create
      await fetch(`http://localhost:4000/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const updated = await fetchUsers();
    setUsers(updated);
    setOpenDialog(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-[450px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            placeholder="ຄົ້ນຫາ..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 border-gray-300 border-2 text-black text-l"
          />
        </div>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ color: "#0099c0", borderColor: "#0099c0" }}
          >
            ເພີ່ມຜູ້ໃຊ້ງານ
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExportPDF(users)}
            sx={{ color: "#0099c0", borderColor: "#0099c0" }}
          >
            ສ້າງລາຍງານ
          </Button>
        </Stack>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto">
        <Box sx={{ maxHeight: 565, overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FFF8EB" }}>
                {[
                  "ລະຫັດຜູ້ໃຊ້ງານ",
                  "ຊື່ຜູ້ໃຊ້ງານ",
                  "ອີເມວ",
                  "ເບີໂທ",
                  "ຈັດການ",
                ].map((label, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontFamily: '"Noto Sans Lao", sans-serif',
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((user, index) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell align="center">{user.id}</TableCell>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.tel}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEditUser(user)}
                        sx={{
                          backgroundColor: "#ffeb3b",
                          "&:hover": { backgroundColor: "#fdd835" },
                          borderRadius: "8px",
                          padding: "6px",
                        }}
                      >
                        <EditIcon style={{ color: "black" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteUser(user.id)}
                        sx={{
                          backgroundColor: "#f44336",
                          "&:hover": { backgroundColor: "#e53935" },
                          borderRadius: "8px",
                          padding: "6px",
                        }}
                      >
                        <DeleteIcon style={{ color: "white" }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editData ? "ແກ້ໄຂຜູ້ໃຊ້ງານ" : "ເພີ່ມຜູ້ໃຊ້ງານ"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <UserForm
            initialData={editData}
            onClose={() => setOpenDialog(false)}
            onSave={handleSaveUser}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
