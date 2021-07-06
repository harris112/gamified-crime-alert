import React, {useState, useEffect} from 'react';
import {MainMap} from './MapComponents';

export default function Map({user, alertsList, loading}) {
  const [initLocation, setInitLocation] = useState(null);

  useEffect(() => {
    const alertWithLoc = alertsList.find(alert => alert.location !== null);
    if (alertWithLoc === undefined) {
      setInitLocation(null);
    }
    else {
      setInitLocation(alertWithLoc.location);
    }
    
  }, [alertsList]);

  return (
    <>
      <h3>Locate</h3>
      <p>The <b>markers</b> represent all crime alerts submitted by other Crime Fighters.</p>
      {
        (!loading && alertsList.length !== 0) &&
        <MainMap 
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDljegl-khc3VGfDMlG_2BpPF21jyFy5Ss&libraries=places&v=weekly"
        location={initLocation}
        markerList={alertsList.map(alert => alert.location)}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `330px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        />
      }
      <br/>
      <br/>
    </>
  )
}