import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

interface BhuvanMapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  style?: React.CSSProperties;
}

const BhuvanMap = ({
  center = [78.9629, 20.5937], // India's center coordinates
  zoom = 5,
  style,
}: BhuvanMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // OpenStreetMap layer as fallback
    const osmSource = new OSM();

    // Bhuvan WMS layer source with local proxy
    const bhuvanSource = new TileWMS({
      url: "http://localhost:5000/api/bhuvan-proxy/wms", // Use local development server
      params: {
        LAYERS: "india3,india5",
        VERSION: "1.1.1",
        FORMAT: "image/jpeg",
      },
      serverType: "geoserver",
      crossOrigin: "anonymous",
    });

    // Create the map instance with both layers
    const map = new Map({
      target: mapRef.current,
      layers: [
        // Base OSM layer
        new TileLayer({
          source: osmSource,
          zIndex: 0,
        }),
        // Bhuvan layer on top
        new TileLayer({
          source: bhuvanSource,
          zIndex: 1,
        }),
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        minZoom: 4,
        maxZoom: 20,
      }),
      controls: [], // Remove all default controls
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  return (
    <Box
      ref={mapRef}
      sx={{
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
};

export default BhuvanMap;
