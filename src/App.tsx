import { useRef } from 'react';
import './App.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import useMap from './hooks/useMap';
import SidebarComponent from './components/SidebarComponent';
import FiltersComponent from './components/FiltersComponent';

const DEFAULTS = {
  longitude: 145.449895817713,
  latitude: -37.9373447811622,
  zoom: 8
}

function App() {
  const mapContainer = useRef(null);
  const {
    selectedProperty,
    handleCloseSidebar,
    handleFiltersChange,
  } = useMap({
    mapContainer, 
    defaults: {
      longitude: DEFAULTS.longitude, 
      latitude: DEFAULTS.latitude,
      zoom: DEFAULTS.zoom
    }
  })

  return (
    <div data-test="map-wrapper" className={`${selectedProperty ? 'sidebar-open map-wrapper' : ' map-wrapper'}`}>
      <div data-test="map" ref={mapContainer} className="map-container" />

      <FiltersComponent handleFiltersChange={handleFiltersChange}/>
      <SidebarComponent 
        selectedProperty={selectedProperty} 
        handleCloseSidebar={handleCloseSidebar} />
    </div>
  );
}

export default App
