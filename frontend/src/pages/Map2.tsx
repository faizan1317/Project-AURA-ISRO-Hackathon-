import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import { transform } from "ol/proj";
import Geolocation from "ol/Geolocation";
import "ol/ol.css";
import { Box, Fab, Menu, MenuItem, Paper, TextField } from "@mui/material";
import {
  SearchOutlined,
  MyLocationOutlined,
  AddOutlined,
  RemoveOutlined,
  LayersOutlined,
} from "@mui/icons-material";

const Map2 = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const geolocationRef = useRef<Geolocation | null>(null);
  const [activeLayer, setActiveLayer] = useState("osm");
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const open = Boolean(anchorEl);

  const handleLayerMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLayerMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Create map layers
    const osmLayer = new TileLayer({
      visible: activeLayer === "osm",
      source: new OSM(),
    });

    const satelliteLayer = new TileLayer({
      visible: activeLayer === "satellite",
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),
    });

    // Create a vector layer for the location marker
    const markerSource = new VectorSource();
    const markerLayer = new VectorLayer({
      source: markerSource,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, satelliteLayer, markerLayer],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    mapInstanceRef.current = map; // Store map instance in ref

    // Setup geolocation tracking
    const geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: map.getView().getProjection(),
    });

    geolocationRef.current = geolocation; // Store geolocation instance in ref

    geolocation.setTracking(true);

    // Create marker for current location
    const positionFeature = new Feature();
    positionFeature.setStyle(
      new Style({
        image: new Icon({
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
          scale: 0.75,
        }),
      })
    );

    markerSource.addFeature(positionFeature);

    // Update marker position when geolocation changes
    geolocation.on("change:position", () => {
      const coordinates = geolocation.getPosition();
      if (coordinates) {
        positionFeature.setGeometry(
          coordinates ? new Point(coordinates) : undefined
        );
        setCurrentCoords(
          transform(coordinates, "EPSG:3857", "EPSG:4326") as [number, number]
        );
      }
    });

    return () => {
      geolocation.setTracking(false);
      map.setTarget(undefined);
    };
  }, [activeLayer]);

  const handleGoToCurrentLocation = () => {
    if (geolocationRef.current && mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      geolocationRef.current.once("change:position", () => {
        const coordinates = geolocationRef.current?.getPosition();
        if (coordinates) {
          view.setCenter(coordinates);
          view.setZoom(15);
        }
        geolocationRef.current?.setTracking(false); // Stop tracking after finding location
      });
      geolocationRef.current.setTracking(true); // Start tracking to get current position
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    // In a real application, you would use a geocoding service here
    // to convert the searchQuery (e.g., city name, address) into coordinates.
    // For this example, I'll use a placeholder or a simple hardcoded value.
    console.log("Searching for:", searchQuery);

    // Example using OpenStreetMap Nominatim API (requires fetching from an API)
    /*
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const coordinates = transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857');
        mapInstanceRef.current?.getView().setCenter(coordinates);
        mapInstanceRef.current?.getView().setZoom(15);
      } else {
        console.log("Location not found.");
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
    */

    // Placeholder: hardcoded coordinates for a specific location (e.g., New York City)
    const placeholderCoordinates = transform(
      [-74.006, 40.7128],
      "EPSG:4326",
      "EPSG:3857"
    );
    mapInstanceRef.current?.getView().setCenter(placeholderCoordinates);
    mapInstanceRef.current?.getView().setZoom(12);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      view.setZoom(view.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      view.setZoom(view.getZoom() - 1);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100vh",
        }}
      />

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
          borderRadius: "25px", // Added border radius
        }}
      >
        <TextField
          fullWidth
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: <SearchOutlined />,
            sx: { borderRadius: "25px" }, // Added border radius to InputProps
          }}
          sx={{
            "& .MuiInputBase-root": {
              color: "white",
              borderRadius: "25px", // Added border radius
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: "25px", // Added border radius
            },
          }}
        />
      </Paper>

      <Box
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <Fab onClick={handleGoToCurrentLocation} title="Go to Current Location">
          <MyLocationOutlined />
        </Fab>

        <Fab onClick={handleZoomIn} title="Go to Current Location">
          <AddOutlined />
        </Fab>
        <Fab onClick={handleZoomOut} title="Change Map Layer">
          <RemoveOutlined />
        </Fab>

        <Fab onClick={(e) => handleLayerMenuClick(e)} title="Change Map Layer">
          <LayersOutlined />
        </Fab>
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={handleLayerMenuClose}>
        <MenuItem
          onClick={() => {
            setActiveLayer("osm");
            handleLayerMenuClose();
          }}
          selected={activeLayer === "osm"}
        >
          Street Map
        </MenuItem>
        <MenuItem
          onClick={() => {
            setActiveLayer("satellite");
            handleLayerMenuClose();
          }}
          selected={activeLayer === "satellite"}
        >
          Satellite
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Map2;
