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
import { fetchSchedule, ScheduleData } from "@/api/scheduleAPI";
import ScheduleForm from "@/components/shared/pages/ScheduleForm";
import { handleExportPDF } from "@/components/reports/ScheduleReport";

const Schedule: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rowsPerPage = 100;

  useEffect(() => {
    document.title = "Schedule | Bus Tracking System";
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchSchedule();
      setSchedules(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch schedules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedules = schedules.filter((item) =>
    [
      item.schedule_id ?? "",
      item.trip_id,
      item.bus_stop_id,
      item.planned_arrival,
      item.planned_department,
    ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentItems = filteredSchedules.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (schedule: ScheduleData) => {
    setEditData(schedule);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:4000/api/schedule/${id}`, {
      method: "DELETE",
    });
    loadData();
  };

  const handleSave = async (data: ScheduleData, id?: string) => {
    const url = `http://localhost:4000/api/schedule${id ? `/${id}` : ""}`;
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trip_id: data.trip_id,
        bus_stop_id: data.bus_stop_id,
        planned_arrival: data.planned_arrival + ":00",
        planned_department: data.planned_department + ":00",
      }),
    });

    if (!response.ok) {
      console.error("Failed to save schedule", await response.text());
    }

    await loadData();
    setOpenDialog(false);
  };



  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      {/* Header & Actions */}
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
            onClick={() => {
              setEditData(null);
              setOpenDialog(true);
            }}
            sx={{ color: "#0099c0", borderColor: "#0099c0" }}
          >
            ເພີ່ມຕາຕະລາງ
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExportPDF(schedules)}
            sx={{ color: "#0099c0", borderColor: "#0099c0" }}
          >
            ສ້າງລາຍງານ
          </Button>
        </Stack>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-gray-500">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <Box sx={{ maxHeight: 565, overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FFF8EB" }}>
                {[
                  "ລະຫັດຕາຕະລາງ",
                  "ຖ້ຽວລົດ",
                  "ລະຫັດປ້າຍລົດເມ",
                  "ເວລາອອກ",
                  "ເວລາຮອດ",
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
              {currentItems.map((item, index) => (
                <TableRow
                  key={item.schedule_id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell align="center">{item.schedule_id}</TableCell>
                  <TableCell align="center">{item.trip_id}</TableCell>
                  <TableCell align="center">{item.bus_stop_name}</TableCell>
                  <TableCell align="center">
                    {item.planned_department}
                  </TableCell>
                  <TableCell align="center">{item.planned_arrival}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEdit(item)}
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
                        onClick={() => handleDelete(item.schedule_id!)}
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
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editData ? "Edit Schedule" : "Add Schedule"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ScheduleForm
            initialData={editData}
            onClose={() => setOpenDialog(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
