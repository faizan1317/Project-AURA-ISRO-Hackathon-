import { useState } from "react";
import { Box, Fab, TextField, Paper, CircularProgress } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LayersIcon from "@mui/icons-material/Layers";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SearchIcon from "@mui/icons-material/Search";
import BhuvanMap from "../components/BhuvanMap";

const dummyAQIData = [
  { position: [77.5946, 12.9716], aqi: 150 }, // Bangalore
  { position: [72.8777, 19.076], aqi: 180 }, // Mumbai
  { position: [77.209, 28.6139], aqi: 200 }, // Delhi
  { position: [80.2707, 13.0827], aqi: 130 }, // Chennai
  { position: [88.3639, 22.5726], aqi: 160 }, // Kolkata
];

const MapView = () => {
  const [center, setCenter] = useState<[number, number]>([78.9629, 20.5937]); // India center
  const [zoom, setZoom] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleLocationClick = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setCenter(newCenter);
          setZoom(12);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    }
  };

  return (
    <Box sx={{ height: "100vh", position: "relative" }}>
      <BhuvanMap center={center} zoom={zoom} />

      {/* Search Bar */}
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 400,
          p: 1,
          bgcolor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search location..."
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          sx={{
            "& .MuiInputBase-root": {
              color: "white",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
          }}
        />
      </Paper>

      {/* FAB Buttons */}
      <Box
        sx={{
          position: "absolute",
          right: 16,
          bottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Fab
          color="primary"
          aria-label="my location"
          onClick={handleLocationClick}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : <MyLocationIcon />}
        </Fab>
        <Fab color="primary" aria-label="layers">
          <LayersIcon />
        </Fab>
        <Fab color="secondary" aria-label="report">
          <ReportProblemIcon />
        </Fab>
      </Box>

      {/* Legend */}
      <Paper
        sx={{
          position: "absolute",
          left: 16,
          bottom: 16,
          p: 2,
          bgcolor: "rgba(0, 0, 0, 0.8)",
          color: "white",
        }}
      >
        <Box sx={{ fontSize: 14, fontWeight: "bold", mb: 1 }}>AQI Legend</Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#00e400",
                borderRadius: 1,
              }}
            />
            <span>Good (0-50)</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#ffff00",
                borderRadius: 1,
              }}
            />
            <span>Moderate (51-100)</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#ff7e00",
                borderRadius: 1,
              }}
            />
            <span>Unhealthy (101-150)</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#ff0000",
                borderRadius: 1,
              }}
            />
            <span>Very Unhealthy (151-200)</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#8f3f97",
                borderRadius: 1,
              }}
            />
            <span>Hazardous (201+)</span>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MapView;
