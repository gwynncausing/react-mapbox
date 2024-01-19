import { useEffect, useState } from "react";
import mapboxgl, {
  Map as MapboxMap,
  NavigationControl,
  LngLatLike,
  Marker,
} from "mapbox-gl";
import properties from "../assets/properties.json";
import { Property, UseMapProps } from "../types";


const useMap = ({ mapContainer, defaults }: UseMapProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const publicKey = import.meta.env.VITE_PUBLIC_KEY;
  mapboxgl.accessToken = publicKey;

  useEffect(() => {
    initializeMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeMap = () => {
    let newMap = new MapboxMap({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [defaults.longitude, defaults.latitude] as LngLatLike,
      zoom: defaults.zoom,
    });

    newMap = addNewMarkers(properties, newMap);
    newMap.addControl(new NavigationControl(), "top-right");
    setMap(newMap);
    return () => newMap.remove();
  };

  const addNewMarkers = (
    newProperties: Property[],
    existingMap?: MapboxMap
  ) => {
    const newMap =
      existingMap ||
      new MapboxMap({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [defaults.longitude, defaults.latitude] as LngLatLike,
        zoom: defaults.zoom,
      });

    removeMarkers();

    const newMarkers = newProperties.map((property, propertyIndex) => {
      const marker = new Marker()
        .setLngLat([property.longitude, property.latitude])
        .addTo(newMap);
      marker.getElement().addEventListener("click", () => {
        const longitude = property.longitude;
        const latitude = property.latitude;
        setMapCenter(longitude, latitude, newMap);
        setSelectedProperty(property as Property);
      });
      marker.getElement().setAttribute("data-test", "marker-" + propertyIndex);
      marker
        .getElement()
        .setAttribute("data-test-postcode", "postcode-" + property.postcode);
      return marker;
    });

    setMapCenter(newProperties[0].longitude, newProperties[0].latitude, newMap);
    setMarkers(newMarkers);
    return newMap;
  };

  const handleCloseSidebar = () => {
    if (selectedProperty)
      setMapCenter(selectedProperty?.longitude, selectedProperty.latitude);
    setSelectedProperty(undefined);
  };

  const removeMarkers = () => {
    markers.forEach((marker: Marker) => {
      marker.remove();
    });
    setMarkers([]);
  };

  const handleFiltersChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedProperty(undefined);
    if (!value) {
      addNewMarkers(properties);
      return;
    }
    const newProperties = properties.filter(
      (property) => property.lga_code === Number(value)
    );
    addNewMarkers(newProperties);
  };

  const setMapCenter = (
    longitude: number,
    latitude: number,
    existingMap?: MapboxMap
  ) => {
    const newMap = existingMap || map;
    newMap?.easeTo({
      center: [longitude, latitude],
      duration: 1000,
    });
  };

  return {
    selectedProperty,
    handleCloseSidebar,
    handleFiltersChange,
  };
};

export default useMap;