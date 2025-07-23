import { useState, useEffect } from "react";
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
import { fetchDrivers, DriverData } from "@/api/driverAPI";
import DriverForm from "@/components/shared/pages/DriverForm";
import { handleExportPDF } from "@/components/reports/DriverReport";

const Driver = () => {
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<DriverData | null>(null);

  useEffect(() => {
    document.title = "Driver | Bus Tracking System";
    fetchDrivers()
      .then(setDrivers)
      .catch((error) => console.error(error));

    fetchDrivers();

    const Interval = setInterval(() => {
      fetchDrivers();
    }, 10000);

    return () => clearInterval(Interval);
  }, []);

  const filteredDrivers = drivers.filter(
    (d) =>
      (typeof d.id === "string" &&
        d.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof d.name === "string" &&
        d.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalItems = filteredDrivers.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const currentItems = filteredDrivers.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEditDriver = (d: DriverData) => {
    setEditData(d);
    setOpenDialog(true);
  };

  const handleDeleteDriver = async (id: string) => {
    await fetch(`http://localhost:4000/api/driver/${id}`, {
      method: "DELETE",
    });
    const updated = await fetchDrivers();
    setDrivers(updated);
  };

  const handleSaveDriver = async (data: DriverData, id?: string) => {
    if (id) {
      await fetch(`http://localhost:4000/api/driver/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          tel: data.tel,
          status: data.status,
        }),
      });
    } else {
      await fetch(`http://localhost:4000/api/driver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const updated = await fetchDrivers();
    setDrivers(updated);
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
            ເພີ່ມຄົນຂັບ
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExportPDF(drivers)}
            sx={{ color: "#0099c0", borderColor: "#0099c0" }}
          >
            ສ້າງລາຍງານ
          </Button>
        </Stack>
      </div>

      <div className="overflow-x-auto">
        <Box sx={{ maxHeight: 565, overflowY: "auto", padding: "0 20px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FFF8EB" }}>
                {[
                  "ລະຫັດຄົນຂັບ",
                  "ຊື່ ແລະ ນາມສະກຸນ",
                  "ເບີໂທ",
                  "ສະຖານະ",
                  "ການຈັດການ",
                ].map((label, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontFamily: '"Noto Sans Lao", sans-serif',
                      fontWeight: "bold",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((d, index) => (
                <TableRow
                  key={d.id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell align="center">{d.id}</TableCell>
                  <TableCell align="center">{d.name}</TableCell>
                  <TableCell align="center">{d.tel}</TableCell>
                  <TableCell align="center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        d.status === "ເຮັດວຽກ"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEditDriver(d)}
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
                        onClick={() => handleDeleteDriver(d.id)}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editData ? "ແກ້ໄຂຄົນຂັບ" : "ເພີ່ມຄົນຂັບ"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DriverForm
            initialData={editData}
            onClose={() => setOpenDialog(false)}
            onSave={handleSaveDriver}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Driver;
