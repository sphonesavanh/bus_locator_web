import { TextField, Button, Stack } from "@mui/material";
import { useState, useEffect } from "react";

interface RouteAddProps {
  mode: "add" | "edit";
  initialData?: {
    id: string;
    name: string;
    startPoint: string;
    endPoint: string;
  }
  onClose: () => void;
}

const RouteAdd = ({ mode, initialData, onClose }: RouteAddProps) => {
  const [routeId, setRouteId] = useState("");
  const [routeName, setRouteName] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setRouteId(initialData.id);
      setRouteName(initialData.name);
      setStartPoint(initialData.startPoint);
      setEndPoint(initialData.endPoint);
    }
  }, [mode, initialData])

  const handleSubmit = () => {
    const newRoute = { 
        id: routeId,
        name: routeName,
        startPoint: startPoint,
        endPoint: endPoint
     };
    console.log(mode === "edit" ? "Edited route:" : "Added route:", newRoute);
    onClose(); // Close after submitting
  };

  return (
    <Stack spacing={2} sx={{ minWidth: 300 }}>
      <TextField
        label="Route ID"
        value={routeId}
        onChange={(e) => setRouteId(e.target.value)}
        fullWidth
        disabled={mode === "edit"} // Disable editing if in edit mode
      />
      <TextField
        label="Route Name"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Start Point"
        value={startPoint}
        onChange={(e) => setStartPoint(e.target.value)}
        fullWidth
      />
      <TextField
        label="End Point"
        value={endPoint}
        onChange={(e) => setEndPoint(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit}>
        {mode === "edit" ? "Update" : "Save"}
      </Button>
    </Stack>
  );
};

export default RouteAdd;
