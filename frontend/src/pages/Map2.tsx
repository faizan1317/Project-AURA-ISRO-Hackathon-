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
import { IconButton, Menu, MenuItem, Paper } from "@mui/material";
import { MyLocation, Layers } from "@mui/icons-material";

const Map2 = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [activeLayer, setActiveLayer] = useState("osm");
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

    // Setup geolocation tracking
    const geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: map.getView().getProjection(),
    });

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
        map.getView().setCenter(coordinates);
        map.getView().setZoom(15);
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

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100vh",
        }}
      />
      <Paper
        elevation={3}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "5px",
          display: "flex",
          gap: "5px",
        }}
      >
        <IconButton
          onClick={(e) => handleLayerMenuClick(e)}
          size="large"
          title="Change Map Layer"
        >
          <Layers />
        </IconButton>
        <IconButton
          onClick={() => {
            if (mapRef.current) {
              const map = mapRef.current as any;
              const view = map.getView();
              const geolocation = new Geolocation({
                trackingOptions: {
                  enableHighAccuracy: true,
                },
                projection: view.getProjection(),
              });
              geolocation.once("change:position", () => {
                const coordinates = geolocation.getPosition();
                if (coordinates) {
                  view.setCenter(coordinates);
                  view.setZoom(15);
                }
              });
              geolocation.setTracking(true);
            }
          }}
          size="large"
          title="Go to Current Location"
        >
          <MyLocation />
        </IconButton>
      </Paper>

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
