import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const pollutants = ["PM2.5", "PM10", "NO2", "SO2", "O3", "CO"];
const timeRanges = ["24h", "7d", "30d", "1y"];

// Dummy data
const generateData = (days: number) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    data.push(Math.floor(Math.random() * 200) + 50);
  }
  return data;
};

const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const HistoricalTrends = () => {
  const [pollutant, setPollutant] = useState(pollutants[0]);
  const [timeRange, setTimeRange] = useState("24h");
  const [timeLapse, setTimeLapse] = useState(false);

  const data = {
    labels,
    datasets: [
      {
        label: pollutant,
        data: generateData(24),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Historical Air Quality Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Historical Trends
        </Typography>

        <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {timeRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={pollutant}
            exclusive
            onChange={(_, value) => value && setPollutant(value)}
            size="small"
          >
            {pollutants.map((p) => (
              <ToggleButton key={p} value={p}>
                {p}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <FormControlLabel
            control={
              <Switch
                checked={timeLapse}
                onChange={(e) => setTimeLapse(e.target.checked)}
              />
            }
            label="Time-Lapse Correlator"
          />
        </Box>

        <Box sx={{ height: 400 }}>
          <Line options={options} data={data} />
        </Box>
      </Paper>
    </Container>
  );
};

export default HistoricalTrends;
