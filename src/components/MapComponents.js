import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

export const MapComponent = withScriptjs(withGoogleMap(({isMarkerShown, location}) => {
    if (!location) {
      return <></>;
    }   

    return <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: location.latitude, lng: location.longitude }}
    >
      {isMarkerShown && <Marker position={{ lat: location.latitude, lng: location.longitude }} />}
    </GoogleMap>;
  } 
))

export const MainMap = withScriptjs(withGoogleMap(({markerList, location}) => {
  
  return <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: location.latitude, lng: location.longitude }}
    >
    { 
      markerList.map(markerLoc => {
        if (markerLoc !== null) {
          return <Marker position={{ lat: markerLoc.latitude, lng: markerLoc.longitude }}/>
        }
      })  
    }
  </GoogleMap>;
} 
))