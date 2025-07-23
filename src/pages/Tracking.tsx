import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { fetchRoutePath } from "@/api/routePathAPI";
import { fetchBusStopByRoute } from "@/api/busStopPathAPI";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoibm90aGluZzA0IiwiYSI6ImNtMXFwYnE4cTAyNzEybXM1NHZmODVpdmoifQ.z-ZxZebYH0bX4WPT2dTabA";

interface TrackingProps {
  trip_id?: string;
  routeId: string;
  pollInterval?: number;
}

const Tracking: React.FC<TrackingProps> = ({
  trip_id,
  routeId,
  pollInterval = 3000,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const stopMarkers = useRef<mapboxgl.Marker[]>([]);
  const busMarker = useRef<mapboxgl.Marker | null>(null);
  const [stops, setStops] = useState<[number, number][]>([]);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [currentStopIdx, setCurrentStopIdx] = useState(0);
  const animating = useRef(false);

  // Animate the bus smoothly along intermediate route points
  const animateBusAlongRoute = async (fromIdx: number, toIdx: number) => {
    if (animating.current || !busMarker.current) return;
    animating.current = true;

    console.log(`🚍 Animating from stop ${fromIdx} to ${toIdx}`);

    const fromCoord = stops[fromIdx];
    const toCoord = stops[toIdx];

    if (fromIdx === toIdx) {
      console.log(`📦 Bus already at stop ${toIdx}`);
      busMarker.current.setLngLat(toCoord);
      animating.current = false; // ✅ Unlock
      return;
    }

    const findClosestIndex = (target: [number, number]) => {
      let minDist = Infinity;
      let closestIdx = 0;
      routeCoords.forEach((coord, idx) => {
        const dist = Math.hypot(coord[0] - target[0], coord[1] - target[1]);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });
      return closestIdx;
    };

    const startIdx = findClosestIndex(fromCoord);
    const endIdx = findClosestIndex(toCoord);

    let segment: [number, number][] = [];
    if (startIdx <= endIdx) {
      segment = routeCoords.slice(startIdx, endIdx + 1);
    } else {
      segment = routeCoords.slice(endIdx, startIdx + 1).reverse();
    }

    console.log(`🛣 Animating along ${segment.length} points`);

    for (let i = 0; i < segment.length; i++) {
      busMarker.current.setLngLat(segment[i]);
      await new Promise((res) => setTimeout(res, 100));
    }

    animating.current = false;
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    document.title = "Tracking | Bus Tracking System";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [102.61517, 17.96409],
      zoom: 14,
    });
    return () => map.current?.remove();
  }, []);

  // Draw route and markers when routeId changes
  useEffect(() => {
    const m = map.current;
    if (!m) return;

    // Remove old markers
    stopMarkers.current.forEach((mk) => mk.remove());
    stopMarkers.current = [];
    busMarker.current?.remove();

    const load = async () => {
      const routeGeo = await fetchRoutePath(routeId);
      const rawStops = await fetchBusStopByRoute(routeId);
      if (!routeGeo) return;

      // Clean up previous layers
      if (m.getLayer("route-line")) m.removeLayer("route-line");
      if (m.getSource("route")) m.removeSource("route");

      // Draw route
      let coords: [number, number][] = [];
      if (routeGeo.type === "Feature") {
        coords = routeGeo.geometry.coordinates as [number, number][];
        setRouteCoords(coords);
        m.addSource("route", { type: "geojson", data: routeGeo });
        m.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#ff0000", "line-width": 4 },
        });
        const bounds = coords.reduce(
          (b, pt) => b.extend(pt),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        );
        m.fitBounds(bounds, { padding: 40 });
      }

      // Draw bus-stop icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stopCoords = rawStops.map((s: any) => [
        s.bus_stop_lat,
        s.bus_stop_lng,
      ]) as [number, number][];
      setStops(stopCoords);

      stopCoords.forEach((pt, idx) => {
        const el = document.createElement("div");
        Object.assign(el.style, {
          width: "40px",
          height: "40px",
          backgroundImage: "url('/bus-stop-icon.png')",
          backgroundSize: "cover",
        });
        const mk = new mapboxgl.Marker(el).setLngLat(pt).addTo(m);
        console.log(`📍 Stop marker ${idx} at ${pt[0]}, ${pt[1]}`);
        stopMarkers.current.push(mk);
      });

      // 🟢 Flutter-style bus placement
      const isBackTrip = routeId.endsWith("-1");
      const initialStopIdx = isBackTrip ? stopCoords.length - 1 : 0;

      const busEl = document.createElement("div");
      Object.assign(busEl.style, {
        width: "32px",
        height: "32px",
        backgroundImage: "url('/bus-icon.png')",
        backgroundSize: "cover",
      });
      const start = stopCoords[initialStopIdx] ?? m.getCenter().toArray();
      busMarker.current = new mapboxgl.Marker(busEl).setLngLat(start).addTo(m);
      setCurrentStopIdx(initialStopIdx);
      console.log(`🚍 Bus marker initialized at stop index: ${initialStopIdx}`);
    };

    if (m.isStyleLoaded()) load();
    else m.once("load", load);
  }, [routeId]);

  // Poll tracking status and animate the bus marker
  useEffect(() => {
    if (!trip_id || stops.length === 0 || routeCoords.length === 0) return;

    let alive = true;

    const parseStatus = (st?: string) => {
      if (!st) return null;

      const prefix = `${routeId}_`;
      if (st.startsWith(prefix)) {
        st = st.replace(prefix, "");
      }
      if (st === "bus_station") return 0;
      if (st === "final_destination") return stops.length - 1;

      const m = st.match(/^(?:go_to|back_to)_bus_stop_(\d+)$/);
      if (!m) return null;

      const stopIdx = parseInt(m[1], 10);
      return Math.max(0, Math.min(stopIdx, stops.length - 1));
    };

    const poll = async () => {
      try {
        console.log("🔄 Polling trip_id:", trip_id);
        const res = await fetch(
          `http://localhost:4000/api/tracking/${trip_id}`
        );
        if (!res.ok) return;
        const { status } = await res.json();
        console.log("✅ Polled status:", status);

        const idx = parseStatus(status);

        if (
          alive &&
          idx != null &&
          idx !== currentStopIdx &&
          !animating.current
        ) {
          console.log(`📦 Animating from stop ${currentStopIdx} to ${idx}`);
          await animateBusAlongRoute(currentStopIdx, idx);
          setCurrentStopIdx(idx);
        }
      } catch (err) {
        console.error("❌ Poll error:", err);
      }
    };

    poll();
    const iv = setInterval(poll, pollInterval);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [trip_id, stops, routeCoords, pollInterval, currentStopIdx]);

  return <div ref={mapContainer} className="w-full h-full rounded shadow-lg" />;
};

export default Tracking;
