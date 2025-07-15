import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import "../index.css";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchLostNFound,
  createLostNFound,
  updateLostNFound,
  deleteLostNFound,
  fetchRoutesDrop,
  fetchBusesDrop,
  fetchUsersDrop,
  LostNFoundData,
  LostNFoundSubmitData,
} from "@/api/lostnfoundAPI";
import LostNFoundForm from "@/components/shared/pages/LostNFoundForm";
import { handleExportPDF } from "@/components/reports/LostNFoundReport";

const LostNFound = () => {
  const [lostNFound, setLostNFound] = useState<LostNFoundData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<LostNFoundData | null>(null);

  const [routeOptions, setRouteOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [busOptions, setBusOptions] = useState<{ id: string; plate: string }[]>(
    []
  );
  const [userOptions, setUserOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const rowsPerPage = 100;

  useEffect(() => {
    document.title = "Lost N Found | Bus Locator";

    // Fetch Lost & Found data
    fetchLostNFound().then(setLostNFound).catch(console.error);

    // Fetch dropdown data using API helper functions
    fetchRoutesDrop()
      .then((data) =>
        setRouteOptions(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((route: any) => ({
            id: route.route_id, // backend key -> frontend key
            name: route.route_name, // backend key -> frontend key
          }))
        )
      )
      .catch(console.error);

    fetchBusesDrop()
      .then((data) =>
        setBusOptions(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((bus: any) => ({
            id: bus.bus_id, // backend key -> frontend key
            plate: bus.bus_plate, // backend key -> frontend key
          }))
        )
      )
      .catch(console.error);

    fetchUsersDrop()
      .then((data) =>
        setUserOptions(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((user: any) => ({
            id: user.user_id, // backend key -> frontend key
            name: user.user_name, // backend key -> frontend key
          }))
        )
      )
      .catch(console.error);
  }, []);

  const filteredLostNFoundData = lostNFound.filter((lost) =>
    [
      lost.route_name,
      lost.bus_plate,
      lost.user_name,
      lost.user_email,
      lost.user_tel,
      lost.description,
      lost.lost_date.toString(),
      lost.status,
    ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentItems = filteredLostNFoundData.slice(
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

  const handleEdit = (lost: LostNFoundData) => {
    setEditData(lost);
    setOpenDialog(true);
  };

  const handleSave = async (data: LostNFoundSubmitData, id?: string) => {
    if (id) {
      await updateLostNFound(id, data);
    } else {
      await createLostNFound(data);
    }
    const updated = await fetchLostNFound();
    setLostNFound(updated);
    setOpenDialog(false);
  };

  const handleDelete = async (id: string) => {
    await deleteLostNFound(id);
    const updated = await fetchLostNFound();
    setLostNFound(updated);
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
            ເພີ່ມຂໍ້ມູນເຄື່ອງເສຍ
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExportPDF(lostNFound)}
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
                  "ລະຫັດເຄື່ອງເສຍ",
                  "ທະບຽນລົດ",
                  "ຊື່ຜູ້ໃຊ້ງານ",
                  "ອີເມວ",
                  "ເບີໂທ",
                  "ລາຍລະອຽດ",
                  "ວັນທີເສຍ",
                  "ສະຖານະ",
                  "ການຈັດການ",
                ].map((label, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontFamily: '"Noto Sans Lao", sans-serif',
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "black",
                      fontSize: "1rem",
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
                  key={item.lost_id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell align="center">{item.lost_id}</TableCell>
                  <TableCell align="center">{item.bus_plate}</TableCell>
                  <TableCell align="center">{item.user_name}</TableCell>
                  <TableCell align="center">{item.user_email}</TableCell>
                  <TableCell align="center">{item.user_tel}</TableCell>
                  <TableCell align="center">{item.description}</TableCell>
                  <TableCell align="center">
                    {new Date(item.lost_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                        item.status === "ເຫັນແລ້ວ"
                          ? "bg-green-200 text-green-800"
                          : item.status === "ດຳເນີນການ"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEdit(item)}
                        sx={{
                          backgroundColor: "#ffeb3b",
                          "&:hover": { backgroundColor: "#fdd835" },
                          borderRadius: "8px",
                          color: "#000",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(item.lost_id)}
                        sx={{
                          backgroundColor: "#f44336",
                          "&:hover": { backgroundColor: "#e53935" },
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      >
                        <DeleteIcon />
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
          {editData ? "ແກ້ໄຂຂໍ້ມູນເຄື່ອງເສຍ" : "ເພີ່ມເຄື່ອງເສຍ"}
        </DialogTitle>
        <DialogContent>
          <LostNFoundForm
            initialData={editData}
            onClose={() => setOpenDialog(false)}
            onSave={handleSave}
            routeOptions={routeOptions}
            busOptions={busOptions}
            userOptions={userOptions}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LostNFound;
