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
  pollInterval = 5000,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const stopMarkers = useRef<mapboxgl.Marker[]>([]);
  const busMarker = useRef<mapboxgl.Marker | null>(null);
  const [stops, setStops] = useState<[number, number][]>([]);

  // 1) initialize Mapbox map once
  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [102.61517, 17.96409],
      zoom: 14,
    });
    return () => map.current?.remove();
  }, []);

  // 2) whenever routeId changes: draw route, stops, and bus marker
  useEffect(() => {
    const m = map.current;
    if (!m) return;

    // 1) Remove old markers
    stopMarkers.current.forEach((mk) => mk.remove());
    stopMarkers.current = [];
    busMarker.current?.remove();

    const load = async () => {
      const routeGeo = await fetchRoutePath(routeId);
      const rawStops = await fetchBusStopByRoute(routeId);
      if (!routeGeo) return;

      // 2) Clean up previous route source + layer
      if (m.getLayer("route-line")) {
        m.removeLayer("route-line");
      }
      if (m.getSource("route")) {
        m.removeSource("route");
      }

      // 3) Draw new route
      let coords: [number, number][] = [];
      if (routeGeo.type === "Feature") {
        coords = routeGeo.geometry.coordinates as [number, number][];
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

      // 4) Draw bus‐stop icons (always [lng, lat])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stopCoords = rawStops.map((s: any) => [
        s.bus_stop_lat,
        s.bus_stop_lng,
      ]) as [number, number][];
      setStops(stopCoords);
      stopCoords.forEach((pt) => {
        const el = document.createElement("div");
        Object.assign(el.style, {
          width: "40px",
          height: "40px",
          backgroundImage: "url('/bus-stop-icon.png')",
          backgroundSize: "cover",
        });
        const mk = new mapboxgl.Marker(el).setLngLat(pt).addTo(m);
        stopMarkers.current.push(mk);
      });

      // 5) Place bus icon at the very first coordinate
      const start = coords[0] ?? stopCoords[0] ?? m.getCenter().toArray();
      const busEl = document.createElement("div");
      Object.assign(busEl.style, {
        width: "32px",
        height: "32px",
        backgroundImage: "url('/bus-icon.png')",
        backgroundSize: "cover",
      });
      busMarker.current = new mapboxgl.Marker(busEl).setLngLat(start).addTo(m);
    };

    if (m.isStyleLoaded()) load();
    else m.once("load", load);
  }, [routeId]);

  // 3) poll tracking status and move bus marker
  useEffect(() => {
    if (!trip_id || stops.length === 0) return;

    let alive = true;
    const parseStatus = (st?: string) => {
      if (!st) return null;
      if (st === "bus_station") return 0;
      if (st === "final_destination") return stops.length - 1;
      const m = st.match(/^(?:go_to|back_to)_bus_stop_(\d+)$/);
      return m ? Math.min(stops.length - 1, parseInt(m[1], 10)) : null;
    };

    const poll = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/tracking/${trip_id}`
        );
        if (!res.ok) return;
        const { status } = await res.json();
        console.log("Polled status: ", status);
        const idx = parseStatus(status);
        console.log("Moving index: ", idx);
        if (alive && busMarker.current && idx != null) {
          busMarker.current.setLngLat(stops[idx]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    poll();
    const iv= setInterval(poll, pollInterval);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [trip_id, stops, pollInterval]);

  return <div ref={mapContainer} className="w-full h-full rounded shadow-lg" />;
};

export default Tracking;
