import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Chip, Slide } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import TimelineIcon from "@mui/icons-material/Timeline";

const dummyData = {
  name: "Indiranagar",
  aqi: 156,
  mainPollutant: "PM2.5",
  healthAdvice:
    "People with respiratory or heart disease, the elderly, and children should avoid prolonged outdoor activities.",
  color: "#ff4444",
};

const LocationDetail = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#00c853";
    if (aqi <= 100) return "#ffd600";
    if (aqi <= 150) return "#ff9100";
    if (aqi <= 200) return "#ff4444";
    if (aqi <= 300) return "#b71c1c";
    return "#880e4f";
  };

  return (
    <Slide direction="up" in={open}>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "60vh",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 3,
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" gutterBottom>
            {dummyData.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: getAQIColor(dummyData.aqi),
                color: "white",
              }}
            >
              <Typography variant="h4">{dummyData.aqi}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Main Pollutant
              </Typography>
              <Chip
                icon={<WarningIcon />}
                label={dummyData.mainPollutant}
                color="warning"
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Health Advice
            </Typography>
            <Typography variant="body1">{dummyData.healthAdvice}</Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<TimelineIcon />}
            onClick={() => navigate("/history")}
            sx={{ mt: 2 }}
          >
            View Full History
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
};

export default LocationDetail;
