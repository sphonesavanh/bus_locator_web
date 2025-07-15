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
import { fetchBusType, BusTypeData } from "@/api/busTypeAPI";
import BusTypeForm from "@/components/shared/pages/BusTypeForm";
import { handleExportPDF } from "@/components/reports/BusTypeReport";

const BusType = () => {
  const [busTypes, setBusTypes] = useState<BusTypeData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<BusTypeData | null>(null);

  useEffect(() => {
    document.title = "Bus Type | Bus Tracking System";
    loadBusTypes();
  }, []);

  const loadBusTypes = async () => {
    try {
      const data = await fetchBusType();
      setBusTypes(data);
    } catch (error) {
      console.error("Failed to fetch bus types", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEdit = (busType: BusTypeData) => {
    setEditData(busType);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:4000/api/bustype/${id}`, {
      method: "DELETE",
    });
    await loadBusTypes();
  };

  const handleSave = async (data: BusTypeData, id?: string) => {
    const url = id
      ? `http://localhost:4000/api/bustype/${id}`
      : `http://localhost:4000/api/bustype`;

    await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    await loadBusTypes();
    setOpenDialog(false);
  };

  const filteredBusTypes = busTypes.filter(
    (bt) =>
      bt.bus_type_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bt.bus_type_capacity?.toString().includes(searchQuery)
  );

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
            ເພີ່ມປະເພດລົດເມ
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExportPDF(busTypes)}
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
                {["ລະຫັດ", "ປະເພດ", "ຈຳນວນບ່ອນນັ່ງ", "ຈັດການ"].map(
                  (label, i) => (
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
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBusTypes.map((bt, index) => (
                <TableRow
                  key={bt.bus_type_id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell align="center">{bt.bus_type_id}</TableCell>
                  <TableCell align="center">{bt.bus_type_name}</TableCell>
                  <TableCell align="center">{bt.bus_type_capacity}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEdit(bt)}
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
                        onClick={() => handleDelete(bt.bus_type_id)}
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
          {editData ? "ແກ້ໄຂປະເພດລົດເມ" : "ເພີ່ມປະເພດລົດເມ"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BusTypeForm
            initialData={editData}
            onClose={() => setOpenDialog(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusType;
