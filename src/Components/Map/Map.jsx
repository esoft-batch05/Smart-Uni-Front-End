import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapStyles = {        
  height: "85vh",
  width: "80%",
  borderRadius: "15px"  // Add border-radius here
};

const defaultCenter = {
  lat: 6.954537410506536, 
  lng: 79.84585471942049
}

const Map = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBoJWBnUosInX81aBgF48RKuYGQLJ32OlQ">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  )
}

export default Map;
