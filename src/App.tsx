import { useEffect, useRef, useState } from 'react';
import './App.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { Map as MapboxMap, NavigationControl, LngLatLike, Marker } from "mapbox-gl";
import properties from './assets/properties.json'
import lgas from './assets/lgas.json'

interface Property {
  property_id: number;
  council: string;
  council_property_number: string | null;
  full_address: string;
  latitude: number;
  lga_code: number;
  longitude: number;
  postcode: string;
}

function App() {
  const mapContainer = useRef(null);
  const lng = 145.449895817713;
  const lat = -37.9373447811622;
  const zoom = 8;
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const publicKey = import.meta.env.VITE_PUBLIC_KEY;
  mapboxgl.accessToken = publicKey;

  useEffect(() => {
    initializeMap()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeMap = () => {
    let newMap = new MapboxMap({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat] as LngLatLike,
      zoom: zoom
    });

    newMap = addNewMarkers(properties, newMap)
    newMap.addControl(new NavigationControl(), "top-right");
    setMap(newMap);
    return () => newMap.remove();
  }

  const addNewMarkers = (newProperties: Property[], existingMap?: MapboxMap) => {
    const newMap = existingMap || new MapboxMap({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat] as LngLatLike,
      zoom: zoom
    });

    removeMarkers();
    
    const newMarkers = newProperties.map((property, propertyIndex) => {
      const marker = new Marker().setLngLat([property.longitude, property.latitude]).addTo(newMap);
      marker.getElement().addEventListener("click", () => {
        const longitude = property.longitude
        const latitude = property.latitude
        setMapCenter(longitude, latitude, newMap);
        setSelectedProperty(property as Property)
      });
      marker.getElement().setAttribute('data-test', 'marker-' + propertyIndex);
      marker.getElement().setAttribute('data-test-postcode', 'postcode-' + property.postcode);
      return marker;
    });

    setMapCenter(newProperties[0].longitude, newProperties[0].latitude, newMap);
    setMarkers(newMarkers);
    return newMap
  };

  const handleCloseSidebar = () => {
    if(selectedProperty) setMapCenter(selectedProperty?.longitude, selectedProperty.latitude);
    setSelectedProperty(undefined)
  }

  const removeMarkers = () => {
    markers.forEach((marker: Marker) => {
      marker.remove();
    });
    setMarkers([]);
  };

  const handleFiltersChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedProperty(undefined)
    if(!value) {
      addNewMarkers(properties)
      return;
    }
    const newProperties = properties.filter(property => property.lga_code === Number(value))
    addNewMarkers(newProperties)
  }

  const setMapCenter = (longitude: number, latitude: number, existingMap?: MapboxMap) => {
    const newMap = existingMap || map
    newMap?.easeTo({
      center: [longitude, latitude],
      duration: 1000,
    });
  }


  return (
    <div data-test="map-wrapper" className={`${selectedProperty ? 'sidebar-open' : ''}`}>
      <div data-test="map" ref={mapContainer} className="map-container" />

      <div className='filter-wrapper'>
        <select data-test="filters" name="filters" id="filters" onChange={handleFiltersChange}>
          <option value="">Filter by Location</option>
          {lgas.map(item => (
            <option value={item.code} key={item.code}>{item.long_name}</option>
          ))}
        </select>
      </div>

      <div className="sidebar">
        {selectedProperty && 
          <>
            <a data-test="close-button" href="#" onClick={handleCloseSidebar} className='close-button'>x</a>
            <table className="content">
              <tbody>
                <tr>
                  <td className='label'>Address</td>
                  <td>{selectedProperty.full_address}</td>
                </tr>
                <tr>
                  <td className='label'>Council</td>
                  <td>{selectedProperty.council}</td>
                </tr>
                <tr>
                  <td className='label'>Post Code</td>
                  <td>{selectedProperty.postcode}</td>
                </tr>
              </tbody>
            </table>
          </>
        }
      </div>
    </div>
  );
}

export default App
