import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchBusRoutes, BusRouteData } from "@/api/busRouteAPI";
import BusRouteForm from "@/components/shared/pages/BusRouteForm";
import { handleExportPDF } from "@/components/reports/RouteReport";

const BusRoute = () => {
  const [busRoutes, setBusRoutes] = useState<BusRouteData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<BusRouteData | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<BusRouteData | null>(null);

  useEffect(() => {
    document.title = "Route | Bus Locator";
    fetchBusRoutes()
      .then(setBusRoutes)
      .catch((error) => console.error(error));
  }, []);

  const filteredBusRoutes = busRoutes.filter(
    (route) =>
      route.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredBusRoutes.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const currentItems = filteredBusRoutes.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEditRoute = (route: BusRouteData) => {
    setEditData(route);
    setOpenDialog(true);
  };

  const handleRequestDeleteRoute = (route: BusRouteData) => {
    setRouteToDelete(route);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (routeToDelete) {
      await fetch(`http://localhost:4000/api/busroutes/${routeToDelete.id}`, {
        method: "DELETE",
      });
      const updated = await fetchBusRoutes();
      setBusRoutes(updated);
    }
    setConfirmDeleteOpen(false);
    setRouteToDelete(null);
  };

  const handleSaveBusRoute = async (data: BusRouteData, id?: string) => {
    if (id) {
      // update
      await fetch(`http://localhost:4000/api/busroutes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
        }),
      });
    } else {
      // add
      await fetch(`http://localhost:4000/api/busroutes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }

    const updated = await fetchBusRoutes();
    setBusRoutes(updated);
    setOpenDialog(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      {/* Search and Buttons */}
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
            ເພີ່ມເສັ້ນທາງ
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExportPDF(busRoutes)}
            sx={{ color: "#0099c0", borderColor: "#0099c0" }}
          >
            ສ້າງລາຍງານ
          </Button>
        </Stack>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Box sx={{ maxHeight: 565, overflowY: "auto", padding: "0 20px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FFF8EB" }}>
                {["ລະຫັດເສັ້ນທາງ", "ຊື່ເສັ້ນທາງ", "ການຈັດການ"].map(
                  (label, index) => (
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
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((route, index) => (
                <TableRow
                  key={route.id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell align="center">{route.id}</TableCell>
                  <TableCell align="center">{route.name}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEditRoute(route)}
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
                        onClick={() => handleRequestDeleteRoute(route)}
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
          {editData ? "ແກ້ໄຂເສັ້ນທາງ" : "ເພີ່ມເສັ້ນທາງ"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BusRouteForm
            initialData={editData}
            onClose={() => setOpenDialog(false)}
            onSave={handleSaveBusRoute}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>ຢືນຢັນການລຶບ</DialogTitle>
        <DialogContent>
          <Typography>
            ທ່ານຕ້ອງການທີ່ຈະລຶບເສັ້ນທາງ <b>{routeToDelete?.name}</b> ຫຼື ບໍ່?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit">
            ບໍ່
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            ແມ່ນ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BusRoute;
