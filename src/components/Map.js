import React, {useState, useEffect} from 'react';
import {MapComponent} from './MapComponent';


// function updateMainMap(alertsList) {
//   let last_pos = -1;

//   if (alertsList.length == 0) {
//     // status.innerText = "No alerts to populate the map.";  
//     // setTimeout(() => status.style.display = "none", 10000);
//   }
//   else {  

//     alertsList.forEach( item => {

//       const infowindow = new google.maps.InfoWindow({
//         content: contentString = item.contextString
//       });

//       last_pos = item.position;
//       const marker = new google.maps.Marker({
//         position: item.position,
//         map: mainMap,
//         title: item.title
//       });

//       marker.addListener("click", () => {
//         infowindow.open(mainMap, marker);
//       });
//     });

//     if (last_pos != -1) {
//       mainMap.setCenter(last_pos);
//     }

//   }

// }

export default function Map() {
  return (
    <>
      <p>The <b>red</b> markers represent lost items submitted by other finders. The  <b>blue</b> markers represent police stations fetched in the nearby area (radius of 10,000) of the map center.</p>
      <MapComponent 
      isMarkerShown
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0xyzKTLq5StKvjNC5HIuHTJRgeaz9uck&libraries=places&v=weekly"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `400px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
      />
    </>
  )
}