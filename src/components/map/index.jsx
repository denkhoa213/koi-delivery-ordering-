// import React, { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import "leaflet-routing-machine";

// function MapComponent({ setDistance }) {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     // Initialize map
//     const map = L.map(mapRef.current).setView([10.762622, 106.660172], 13);

//     // Add OpenStreetMap tile layer
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 18,
//       attribution: "&copy; OpenStreetMap contributors",
//     }).addTo(map);

//     // Add search functionality
//     const routingControl = L.Routing.control({
//       waypoints: [],
//       routeWhileDragging: true,
//     }).addTo(map);

//     routingControl.on("routesfound", function (e) {
//       const route = e.routes[0];
//       const distance = route.summary.totalDistance / 1000; // Distance in km
//       setDistance(distance);
//     });

//     return () => map.remove();
//   }, [setDistance]);

//   return <div id="map" ref={mapRef} style={{ height: "240px" }}></div>;
// }

// export default MapComponent;
