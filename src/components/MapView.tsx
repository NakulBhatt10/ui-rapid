import React, { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, LayerGroup, Polyline } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Fix default marker icons in bundlers:
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
(L.Marker.prototype as any).options.icon = DefaultIcon;

interface MapViewProps {
  /** Accepts either [lng, lat] or [lat, lng] — we normalize internally */
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    position: [number, number];              // [lat, lng]
    popup: string;
    type?: string;
  }>;
  heatmapData?: Array<[number, number, number]>;  // [lat, lng, intensity 0..1]
  showHeatmap?: boolean;
  showPopulationDensity?: boolean;
  showEvacuationRoutes?: boolean;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  center = [78.9629, 20.5937], // India as [lng, lat] (we normalize below)
  zoom = 5,
  markers = [],
  heatmapData = [],
  showHeatmap = true,
  showPopulationDensity = false,
  showEvacuationRoutes = true,
  className = 'h-96 w-full rounded-lg',
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  // Layer refs
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const heatLayerRef = useRef<any | null>(null);         // leaflet.heat
  const populationHeatRef = useRef<any | null>(null);     // leaflet.heat
  const routesRef = useRef<Array<Polyline>>([]);

  // Demo heatmap data (generated once)
  const demoHeatRef = useRef<Array<[number, number, number]>>([]);

  // ---------- Helpers

  // Normalize incoming center to [lat, lng]
  const toLatLng = (c: [number, number]): [number, number] => {
    const [a, b] = c;
    // Heuristic: if first looks like longitude (|x|>60) and second like latitude (|y|<=60),
    // treat as [lng, lat] and flip. Else assume [lat, lng].
    if (Math.abs(a) > 60 && Math.abs(b) <= 60) return [b, a];
    return [a, b];
  };

  // Optional: keep map within India-ish bounds (with padding)
  const INDIA_BOUNDS = L.latLngBounds([[6, 68], [36, 98]]);

  const withViewLock = (fn: () => void) => {
    if (!mapRef.current) return;
    const c = mapRef.current.getCenter();
    const z = mapRef.current.getZoom();
    fn();
    mapRef.current.invalidateSize();
    mapRef.current.setView(c, z, { animate: false });
  };

  // random helpers
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  const jitterByKm = (lat: number, lng: number, km: number) => {
    const dLat = km / 110.574; // deg
    const dLng = km / (111.320 * Math.cos((lat * Math.PI) / 180));
    return [lat + rand(-dLat, dLat), lng + rand(-dLng, dLng)] as [number, number];
  };

  // Generate clustered demo heatmap across India
  const ensureDemoHeat = () => {
    if (demoHeatRef.current.length) return;

    type Cluster = { name: string; lat: number; lng: number; pts: number; base: number; spreadKm: number };
    const clusters: Cluster[] = [
      { name: 'Delhi',            lat: 28.6139, lng: 77.2090, pts: 140, base: 0.55, spreadKm: 25 },
      { name: 'Mumbai',           lat: 19.0760, lng: 72.8777, pts: 160, base: 0.65, spreadKm: 20 },
      { name: 'Bengaluru',        lat: 12.9716, lng: 77.5946, pts: 120, base: 0.45, spreadKm: 18 },
      { name: 'Hyderabad',        lat: 17.3850, lng: 78.4867, pts: 120, base: 0.50, spreadKm: 18 },
      { name: 'Chennai',          lat: 13.0827, lng: 80.2707, pts: 120, base: 0.55, spreadKm: 16 },
      { name: 'Kolkata',          lat: 22.5726, lng: 88.3639, pts: 130, base: 0.60, spreadKm: 20 },
      { name: 'Ahmedabad',        lat: 23.0225, lng: 72.5714, pts: 100, base: 0.40, spreadKm: 18 },
      { name: 'Pune',             lat: 18.5204, lng: 73.8567, pts: 100, base: 0.45, spreadKm: 16 },
      { name: 'Jaipur',           lat: 26.9124, lng: 75.7873, pts: 90,  base: 0.40, spreadKm: 16 },
      { name: 'Lucknow',          lat: 26.8467, lng: 80.9462, pts: 90,  base: 0.40, spreadKm: 16 },
      { name: 'Patna',            lat: 25.5941, lng: 85.1376, pts: 80,  base: 0.40, spreadKm: 14 },
      { name: 'Bhopal',           lat: 23.2599, lng: 77.4126, pts: 80,  base: 0.38, spreadKm: 14 },
      { name: 'Nagpur',           lat: 21.1458, lng: 79.0882, pts: 80,  base: 0.42, spreadKm: 14 },
      { name: 'Surat',            lat: 21.1702, lng: 72.8311, pts: 80,  base: 0.40, spreadKm: 14 },
      { name: 'Visakhapatnam',    lat: 17.6868, lng: 83.2185, pts: 90,  base: 0.45, spreadKm: 14 },
      { name: 'Kochi',            lat: 9.9312,  lng: 76.2673, pts: 70,  base: 0.35, spreadKm: 12 },
      { name: 'Thiruvananthapuram',lat: 8.5241, lng: 76.9366, pts: 60,  base: 0.35, spreadKm: 12 },
      { name: 'Coimbatore',       lat: 11.0168, lng: 76.9558, pts: 70,  base: 0.36, spreadKm: 12 },
      { name: 'Guwahati',         lat: 26.1445, lng: 91.7362, pts: 70,  base: 0.40, spreadKm: 12 },
      { name: 'Chandigarh',       lat: 30.7333, lng: 76.7794, pts: 60,  base: 0.38, spreadKm: 12 },
      { name: 'Srinagar',         lat: 34.0837, lng: 74.7973, pts: 50,  base: 0.35, spreadKm: 10 },
      { name: 'Ranchi',           lat: 23.3441, lng: 85.3096, pts: 60,  base: 0.38, spreadKm: 12 },
      { name: 'Bhubaneswar',      lat: 20.2961, lng: 85.8245, pts: 70,  base: 0.42, spreadKm: 12 },
      { name: 'Varanasi',         lat: 25.3176, lng: 82.9739, pts: 60,  base: 0.40, spreadKm: 10 },
      { name: 'Indore',           lat: 22.7196, lng: 75.8577, pts: 70,  base: 0.38, spreadKm: 10 },
      { name: 'Vijayawada',       lat: 16.5062, lng: 80.6480, pts: 60,  base: 0.40, spreadKm: 10 },
      { name: 'Rajkot',           lat: 22.3039, lng: 70.8022, pts: 60,  base: 0.35, spreadKm: 10 },
      { name: 'Mysuru',           lat: 12.2958, lng: 76.6394, pts: 60,  base: 0.36, spreadKm: 10 },
      { name: 'Madurai',          lat: 9.9252,  lng: 78.1198, pts: 60,  base: 0.36, spreadKm: 10 },
      { name: 'Agra',             lat: 27.1767, lng: 78.0081, pts: 60,  base: 0.38, spreadKm: 10 },
      { name: 'Prayagraj',        lat: 25.4358, lng: 81.8463, pts: 60,  base: 0.38, spreadKm: 10 },
      { name: 'Udaipur',          lat: 24.5854, lng: 73.7125, pts: 50,  base: 0.36, spreadKm: 10 },
      { name: 'Shillong',         lat: 25.5788, lng: 91.8933, pts: 50,  base: 0.36, spreadKm: 10 },
    ];

    const pts: Array<[number, number, number]> = [];
    clusters.forEach((c) => {
      for (let i = 0; i < c.pts; i++) {
        const [lat, lng] = jitterByKm(c.lat, c.lng, c.spreadKm);
        const intensity = Math.max(0.05, Math.min(1, c.base + rand(-0.25, 0.35)));
        pts.push([lat, lng, intensity]);
      }
    });

    // sprinkle a few random corridor/outlier points to fill gaps
    for (let i = 0; i < 120; i++) {
      // bounding box of mainland India (rough)
      const lat = rand(8.0, 34.5);
      const lng = rand(68.0, 97.5);
      const intensity = Math.max(0.05, Math.min(1, rand(0.15, 0.6)));
      pts.push([lat, lng, intensity]);
    }

    demoHeatRef.current = pts;
  };

  // ---------- Init map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const latLng = toLatLng(center);

    const map = L.map(mapContainer.current, {
      zoomControl: true,
      attributionControl: true,
      maxBounds: INDIA_BOUNDS.pad(0.25),   // optional: keep focus on India
      maxBoundsViscosity: 0.8,             // optional: snap back when panned out
    }).setView(latLng, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.scale().addTo(map);
    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Build demo data once
    ensureDemoHeat();

    // Initial layers
    addMarkers();
    addHeatmap();
    addPopulationDensity();
    addEvacuationRoutes();

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      heatLayerRef.current = null;
      populationHeatRef.current = null;
      routesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // external center/zoom updates
  useEffect(() => {
    if (mapRef.current) {
      const latLng = toLatLng(center);
      mapRef.current.setView(latLng, zoom, { animate: false });
    }
  }, [center, zoom]);

  // ---------- Markers (default Leaflet pin)
  const addMarkers = () => {
    if (!mapRef.current || !markerLayerRef.current) return;
    markerLayerRef.current.clearLayers();

    markers.forEach((m) => {
      const latLng: [number, number] = [m.position[0], m.position[1]];
      L.marker(latLng)
        .bindPopup(`<div class="text-sm font-medium">${m.popup}</div>`)
        .addTo(markerLayerRef.current!);
    });
  };

  // ---------- Heatmap (uses provided data, else demo clustered data)
  const addHeatmap = () => {
    if (!mapRef.current) return;

    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    if (!showHeatmap) return;

    const points = (heatmapData && heatmapData.length)
      ? heatmapData
      : demoHeatRef.current;

    if (!points.length) return;

    // @ts-expect-error leaflet.heat augments L
    const layer = (L as any).heatLayer(points, {
      radius: 22,
      blur: 18,
      maxZoom: 17,
    });
    layer.addTo(mapRef.current);
    heatLayerRef.current = layer;
  };

  // ---------- Population density (kept optional demo)
  const addPopulationDensity = () => {
    if (!mapRef.current) return;

    if (populationHeatRef.current) {
      mapRef.current.removeLayer(populationHeatRef.current);
      populationHeatRef.current = null;
    }
    if (!showPopulationDensity) return;

    const populationDataLngLat: Array<[number, number, number]> = [
      [77.2090, 28.6139, 0.9], [72.8777, 19.0760, 0.8], [88.3639, 22.5726, 0.7],
      [80.2707, 13.0827, 0.6], [77.5946, 12.9716, 0.5], [78.4867, 17.3850, 0.5],
    ];
    const populationDataLatLng = populationDataLngLat.map(
      ([lng, lat, w]) => [lat, lng, w] as [number, number, number]
    );

    // @ts-expect-error leaflet.heat augments L
    const layer = (L as any).heatLayer(populationDataLatLng, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
    });
    layer.addTo(mapRef.current);
    populationHeatRef.current = layer;
  };

  // ---------- Evacuation routes (LOTS of multi-segment polylines across India)
  const addEvacuationRoutes = () => {
    if (!mapRef.current) return;

    routesRef.current.forEach((r) => r.remove());
    routesRef.current = [];

    if (!showEvacuationRoutes) return;

    // Each route is an array of [lng, lat] points (we convert to [lat, lng] below).
    const routes: Array<Array<[number, number]>> = [
      // North / NW corridors
      [[77.2090,28.6139],[76.7794,30.7333],[74.8723,31.6340]],                      // Delhi → Chandigarh → Amritsar
      [[77.2090,28.6139],[75.7873,26.9124],[73.7125,24.5854],[72.5714,23.0225]],    // Delhi → Jaipur → Udaipur → Ahmedabad
      [[77.2090,28.6139],[78.0081,27.1767],[80.9462,26.8467],[82.9739,25.3176],[85.1376,25.5941],[88.3639,22.5726]], // Delhi → Agra → Lucknow → Varanasi → Patna → Kolkata

      // West / Central
      [[72.8777,19.0760],[73.8567,18.5204],[74.1240,17.6599]],                      // Mumbai → Pune → Satara (approx)
      [[72.5714,23.0225],[73.8567,18.5204],[75.8577,22.7196],[77.4126,23.2599]],    // Ahmedabad → Pune → Indore → Bhopal
      [[79.0882,21.1458],[81.6296,21.2514],[83.2185,17.6868]],                      // Nagpur → Raipur → Visakhapatnam

      // South
      [[77.5946,12.9716],[76.6394,12.2958],[76.2673,9.9312],[76.9366,8.5241]],      // Bengaluru → Mysuru → Kochi → Trivandrum
      [[77.5946,12.9716],[78.4867,17.3850],[80.2707,13.0827]],                      // Bengaluru → Hyderabad → Chennai
      [[78.4867,17.3850],[80.6480,16.5062],[83.2185,17.6868]],                      // Hyderabad → Vijayawada → Visakhapatnam
      [[78.1198,9.9252],[80.2707,13.0827],[76.9558,11.0168]],                        // Madurai → Chennai → Coimbatore

      // East
      [[88.3639,22.5726],[85.8245,20.2961],[86.4194,23.7957]],                      // Kolkata → Bhubaneswar → Jamshedpur (approx)
      [[88.3639,22.5726],[91.8933,25.5788],[91.7362,26.1445]],                      // Kolkata → Shillong → Guwahati

      // North/North-East
      [[77.2090,28.6139],[76.7794,30.7333],[74.7973,34.0837]],                      // Delhi → Chandigarh → Srinagar
      [[80.9462,26.8467],[81.8463,25.4358],[82.9739,25.3176]],                      // Lucknow → Prayagraj → Varanasi
    ];

    routes.forEach((route) => {
      const latLngRoute = route.map(([lng, lat]) => [lat, lng]) as [number, number][];
      const poly = L.polyline(latLngRoute, {
        color: '#ff6600',
        weight: 4,
        opacity: 0.9,
        dashArray: '4,4',
        lineJoin: 'round',
      }).addTo(mapRef.current!);
      routesRef.current.push(poly);
    });
  };

  // ---------- React to prop changes (keep view locked)
  useEffect(() => { withViewLock(() => addMarkers()); }, [markers]);                // eslint-disable-line
  useEffect(() => { withViewLock(() => { ensureDemoHeat(); addHeatmap(); }); }, [showHeatmap, heatmapData]); // eslint-disable-line
  useEffect(() => { withViewLock(() => addPopulationDensity()); }, [showPopulationDensity]); // eslint-disable-line
  useEffect(() => { withViewLock(() => addEvacuationRoutes()); }, [showEvacuationRoutes]);  // eslint-disable-line

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
    </div>
  );
};
