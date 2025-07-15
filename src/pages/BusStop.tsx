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

import { fetchBusStops, BusStopData } from "@/api/busStopAPI";
import BusStopForm from "@/components/shared/pages/BusStopForm";
import { handleExportPDF } from "@/components/reports/BusStopReport";

const BusStop = () => {
  const [busStops, setBusStops] = useState<BusStopData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<BusStopData | null>(null);

  useEffect(() => {
    document.title = "Bus Stops | Bus Tracking System";
    (async () => {
      try {
        setLoading(true);
        const data = await fetchBusStops();
        setBusStops(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bus stops. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 1️⃣ Filter
  const filtered = busStops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.lat.toString().includes(searchQuery) ||
      stop.lng.toString().includes(searchQuery)
  );

  // 2️⃣ Paginate
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + rowsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEdit = (stop: BusStopData) => {
    setEditData(stop);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:4000/api/busstops/${id}`, {
      method: "DELETE",
    });
    const updated = await fetchBusStops();
    setBusStops(updated);
  };

  const handleSaveBusStop = async (data: BusStopData, id?: string) => {
    const url = id
      ? `http://localhost:4000/api/busstops/${id}`
      : `http://localhost:4000/api/busstops`;

    await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        lat: data.lat,
        lng: data.lng,
      }),
    });

    const updated = await fetchBusStops();
    setBusStops(updated);
    setOpenDialog(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      {/* Toolbar */}
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
            ເພີ່ມປ້າຍລົດເມ
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExportPDF(busStops)}
            sx={{ color: "#0099c0", borderColor: "#0099c0" }}
          >
            ສ້າງລາຍງານ
          </Button>
        </Stack>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center text-gray-500">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <Box sx={{ maxHeight: 565, overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#FFF8EB" }}>
                  {[
                    "ລະຫັດປ້າຍລົດ",
                    "ຊື່ປ້າຍລົດ",
                    "Latitude",
                    "Longitude",
                    "ການຈັດການ",
                  ].map((label, idx) => (
                    <TableCell
                      key={idx}
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
                {currentItems.map((stop, idx) => (
                  <TableRow
                    key={stop.id || idx}
                    hover
                    sx={{
                      backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      "&:hover": { backgroundColor: "#f1f5f9" },
                    }}
                  >
                    <TableCell align="center">{stop.id}</TableCell>
                    <TableCell align="center">{stop.name}</TableCell>
                    <TableCell align="center">{stop.lat}</TableCell>
                    <TableCell align="center">{stop.lng}</TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          onClick={() => handleEdit(stop)}
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
                          onClick={() => handleDelete(stop.id)}
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
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editData ? "ແກ້ໄຂປ້າຍລົດເມ" : "ເພີ່ມປ້າຍລົດເມ"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BusStopForm
            initialData={editData}
            onClose={() => setOpenDialog(false)}
            onSave={handleSaveBusStop}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusStop;
