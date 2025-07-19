import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from "@mui/material";
// import Map from "react-map-gl";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const steps = ["Enter Route Details", "Review & Plan"];

// Dummy data for the bar chart
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Best Time to Travel",
    },
  },
};

const labels = [
  "6 AM",
  "8 AM",
  "10 AM",
  "12 PM",
  "2 PM",
  "4 PM",
  "6 PM",
  "8 PM",
];
const data = {
  labels,
  datasets: [
    {
      label: "Exposure Score",
      data: labels.map(() => Math.floor(Math.random() * 100)),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const CommutePlanner = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [viewport, setViewport] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 11,
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Plan Your Commute
        </Typography>

        <Stepper activeStep={activeStep} sx={{ py: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? (
          <Grid container spacing={3}>
            <Grid>
              <TextField
                fullWidth
                label="Starting Point"
                placeholder="Enter location"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Destination"
                placeholder="Enter location"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Preferred Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleNext} sx={{ mt: 2 }}>
                Next
              </Button>
            </Grid>
            <Grid>
              <Box sx={{ height: 400, borderRadius: 1, overflow: "hidden" }}>
                {/* <Map
                  {...viewport}
                  onMove={(evt) => setViewport(evt.viewState)}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken="YOUR_MAPBOX_TOKEN"
                /> */}
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Grid container spacing={3}>
              <Grid>
                <Box sx={{ height: 400, borderRadius: 1, overflow: "hidden" }}>
                  {/* <Map
                    {...viewport}
                    onMove={(evt) => setViewport(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken="YOUR_MAPBOX_TOKEN"
                  /> */}
                </Box>
              </Grid>
              <Grid>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Route Details
                  </Typography>
                  <Typography>Distance: 8.5 km</Typography>
                  <Typography>Duration: 25 mins</Typography>
                  <Typography color="error">Exposure Score: High</Typography>
                </Paper>
                <Bar options={options} data={data} />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button variant="contained" color="primary">
                Save Route
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CommutePlanner;
