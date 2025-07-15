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
import { fetchBus, BusData } from "@/api/busAPI";
import BusForm from "@/components/shared/pages/BusForm";
import { handleExportPDF } from "@/components/reports/BusReport";
const Bus = () => {
  const [bus, setBus] = useState<BusData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<BusData | null>(null);

  const rowsPerPage = 100;

  useEffect(() => {
    document.title = "Bus | Bus Tracking System";
    fetchBus().then(setBus).catch(console.error);
  }, []);

  const filteredBusData = bus.filter(
    (b) =>
      b.busPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.busTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.busTypeCapacity.toString().includes(searchQuery.toLowerCase()) ||
      b.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentItems = filteredBusData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEditBus = (b: BusData) => {
    setEditData(b);
    setOpenDialog(true);
  };

  const handleDeleteBus = async (id: string) => {
    await fetch(`http://localhost:4000/api/bus/${id}`, { method: "DELETE" });
    const updated = await fetchBus();
    setBus(updated);
  };

  const handleSaveBus = async (data: BusData, id?: string) => {
    const url = id
      ? `http://localhost:4000/api/bus/${id}`
      : `http://localhost:4000/api/bus`;

    const body = id
      ? {
          plate: data.busPlate,
          number: data.busNumber,
          busTypeId: data.busTypeId,
          driverId: data.driverId,
        }
      : {
          plate: data.busPlate,
          number: data.busNumber,
          busTypeId: data.busTypeId,
          driverId: data.driverId,
        };

    await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const updated = await fetchBus();
    setBus(updated);
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
            ເພີ່ມລົດເມ
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExportPDF(bus)}
            sx={{ color: "#0099c0", borderColor: "#0099c0" }}
          >
            ສ້າງລາຍງານ
          </Button>
        </Stack>
      </div>

      <div className="overflow-x-auto">
        <Box sx={{ maxHeight: 565, overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FFF8EB" }}>
                {[
                  "ລະຫັດລົດ",
                  "ທະບຽນ",
                  "ໝາຍເລກ",
                  "ປະເພດ - ບ່ອນນັ່ງ",
                  "ຄົນຂັບ",
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
              {currentItems.map((b, index) => (
                <TableRow
                  key={b.id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell align="center">{b.id}</TableCell>
                  <TableCell align="center">{b.busPlate}</TableCell>
                  <TableCell align="center">{b.busNumber}</TableCell>
                  <TableCell align="center">
                    {b.busTypeName} ({b.busTypeCapacity})
                  </TableCell>
                  <TableCell align="center">{b.driverName}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEditBus(b)}
                        sx={{
                          backgroundColor: "#ffeb3b",
                          "&:hover": { backgroundColor: "#fdd835" },
                          borderRadius: "8px",
                          padding: "6px",
                        }}
                      >
                        <EditIcon sx={{ color: "black" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteBus(b.id)}
                        sx={{
                          backgroundColor: "#f44336",
                          "&:hover": { backgroundColor: "#e53935" },
                          borderRadius: "8px",
                          padding: "6px",
                        }}
                      >
                        <DeleteIcon sx={{ color: "white" }} />
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
          {editData ? "ແກ້ໄຂລົດເມ" : "ເພີ່ມລົດເມ"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BusForm
            initialData={editData}
            onClose={() => setOpenDialog(false)}
            onSave={handleSaveBus}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bus;
