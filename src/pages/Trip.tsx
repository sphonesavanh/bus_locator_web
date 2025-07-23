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
import { fetchTrip, TripData } from "@/api/tripAPI";
import TripForm from "@/components/shared/pages/TripForm";
import { handleExportPDF } from "@/components/reports/TripReport";

const Trip = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rowsPerPage = 100;

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchTrip();
      setTrips(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trips. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Trips | Bus Tracking System";
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredTrips = trips.filter(
    (trip) =>
      trip.trip_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.bus_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.start_time.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.end_time.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentItems = filteredTrips.slice(
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

  const handleEdit = (trip: TripData) => {
    setEditData(trip);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:4000/api/trip/${id}`, {
      method: "DELETE",
    });
    const updated = await fetchTrip();
    setTrips(updated);
  };

  const handleSave = async (data: TripData, id?: string) => {
    const url = id
      ? `http://localhost:4000/api/trip/${id}`
      : `http://localhost:4000/api/trip`;

    const body = id
      ? {
          bus_id: data.bus_id,
          route_id: data.route_id,
          start_time: data.start_time,
          end_time: data.end_time,
        }
      : {
          bus_id: data.bus_id,
          route_id: data.route_id,
          start_time: data.start_time,
          end_time: data.end_time,
        };

    const response = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("Failed to save trip", await response.text());
    }

    const updated = await fetchTrip();
    setTrips(updated);
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
            ເພີ່ມຖ້ຽວ
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExportPDF(trips)}
            sx={{ color: "#0099c0", borderColor: "#0099c0" }}
          >
            ສ້າງລາຍງານ
          </Button>
        </Stack>
      </div>
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
                    "ລະຫັດຖ້ຽວລົດ",
                    "ລະຫັດເສັ້ນທາງ",
                    "ລະຫັດລົດ",
                    "ເວລາອອກ",
                    "ເວລາສິ້ນສຸດ",
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
                {currentItems.map((trip, index) => (
                  <TableRow
                    key={trip.trip_id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      "&:hover": { backgroundColor: "#f1f5f9" },
                    }}
                  >
                    <TableCell align="center">{trip.trip_id}</TableCell>
                    <TableCell align="center">{trip.routeName}</TableCell>
                    <TableCell align="center">{trip.busPlate}</TableCell>
                    <TableCell align="center">{trip.start_time}</TableCell>
                    <TableCell align="center">{trip.end_time}</TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          onClick={() => handleEdit(trip)}
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
                          onClick={() => handleDelete(trip.trip_id)}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editData ? "ແກ້ໄຂຖ້ຽວ" : "ເພີ່ມຖ້ຽວ"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TripForm
            initialData={editData}
            onClose={() => setOpenDialog(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trip;
