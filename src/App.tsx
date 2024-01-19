import { useEffect, useRef } from 'react';
import './App.css'
import 'mapbox-gl/dist/mapbox-gl.css'; 
import mapboxgl, { Map as MapboxMap, NavigationControl, LngLatLike, Marker } from "mapbox-gl";
import properties from './assets/properties.json'


function App() {
  const mapContainer = useRef(null);
  const lng = 145.449895817713;
  const lat = -37.9373447811622;
  const zoom = 8;  

  const publicKey = import.meta.env.VITE_PUBLIC_KEY;
  mapboxgl.accessToken = publicKey;

  useEffect(() => {
    const map = new MapboxMap({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat] as LngLatLike,
      zoom: zoom
    });

    properties.map((property) => {
      const marker = new Marker().setLngLat([property.longitude, property.latitude])
      marker.addTo(map)

      marker.getElement().addEventListener("click", () => {
        map.easeTo({
          center: [property.longitude, property.latitude],
          duration: 1000,
        });
      });
    });
    console.log(map);

    map.addControl(new NavigationControl(), "top-right");
    return () => map.remove();
  });


  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App
