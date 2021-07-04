import React, {useState, useEffect} from 'react';
import {MapComponent} from './MapComponent';

let latitude;
let longitude;


export default function AlertForm({loader}) {

  function onSubmit() {
    let f = document.querySelector("form");
    let fd = new FormData(f);
    let sp = new URLSearchParams(fd);

    let i = 0;
    let form_data = {};

    for (const [key, value] of sp.entries()) {
      form_data[key] = value;
      if (value == ''){
        console.log("Field is empty.");
      } else {
        console.log(key, value);
      }
      i++;
    }

    let record = {...form_data,  latitude: latitude, longitude: longitude};

    
    console.log(record);

    // db.alerts.add(record)
    // .then(() => {
    //   console.log("Saved to DB.")
    //   updateData();
    // })

    // let dbc = await db.alerts.count();

    document.querySelector("#submit-btn").disabled = true;
    setTimeout(() => document.querySelector("#submit-btn").disabled = false, 3000);
  }



  function handleLocation() {

    if('geolocation' in navigator) {
      function success(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        // const pos = {
        //   lat: latitude,
        //   lng: longitude,
        // };
        
        // const cityCircle = new google.maps.Circle({
        //   strokeColor: "#FF0000",
        //   strokeOpacity: 0.8,
        //   strokeWeight: 2,
        //   fillColor: "#FF0000",
        //   fillOpacity: 0.35,
        //   map: formMap,
        //   center: pos,
        //   radius: 20,
        // });


        // formMap.setCenter(pos);
        // document.getElementById("form-map").style.display = 'block';
        // document.getElementById("location-btn").disabled = true;

      }

      function error() {
        alert('Sorry, no position available.');
      }

      navigator.geolocation.watchPosition(success, error, {enableHighAccuracy: false,maximumAge: 100, timeout: 5000 });

    } else {
      alert("getCurrentPosition Error");
    }

  }

  return (
    <>
      <form>

        <div class="form-group">
          <h5>Name</h5>
          <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label">
            <input name="name" class="mdc-text-field__input" type="text" aria-label="Label"/>
          </label>
        </div>
        <br/>

        <div class="form-group">
          <h5>Description</h5>
          <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea mdc-text-field--no-label">
            <span class="mdc-text-field__resizer">
              <textarea name="description" class="mdc-text-field__input" rows="8" cols="40" aria-label="Label"></textarea>
            </span>
          </label>
        </div>
        <br/>
        
        <div class="form-group">
          <h5>Your contact details:</h5>
          <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label">
            <input name="contact_details" class="mdc-text-field__input" type="text" name="contact_details" id="contact_details"/>
          </label>
        </div>

        <br/>
        <br/>

      </form>
      
      <button id="location-btn" onClick={handleLocation} class="mdc-button mdc-button--raised general">
        Add your Location
      </button>
      <br/>

      <MapComponent 
      isMarkerShown
      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `400px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
      />
      
      <br/>

      <button id="submit-btn" onSubmit={onSubmit} class="mdc-button mdc-button--raised general">
        Report Crime
      </button>
    
      <br/><br/><br/>
    </>
  )
}