export interface Property {
  property_id: number;
  council: string;
  council_property_number: string | null;
  full_address: string;
  latitude: number;
  lga_code: number;
  longitude: number;
  postcode: string;
}

export interface UseMapProps {
  mapContainer: React.MutableRefObject<null>;
  defaults: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
}