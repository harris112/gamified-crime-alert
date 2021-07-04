import React from 'react';


let formMap;
let latitude;
let longitude;


async function updateData() {
    const card = document.querySelector(".card");
    const loading = document.querySelector("#loading");
    const dataView = document.querySelector("#data");

    card.style.display = 'block'; 
    loading.style.display = 'block';
    dataView.innerHTML = "";
    
    const data = []; //await db.alerts.toArray();

    if (data.length == 0) {
      dataView.innerHTML = "No alerts found.";
    }

    let alertsList = []; // markers info list


    data.forEach(row => { // item
      const {name, description, contact_details} = row;

      let cardClone = card.cloneNode(true);
      let cardBody = cardClone.childNodes[1];
      let [, cardTitle,, cardSubtitle,, cardImg,, cardText,, cardExtra,] = cardBody.childNodes;
      cardTitle.innerText = name;
      cardSubtitle.innerText = row.description ? row.description : '';
      
      let cardDetails = `
      Contact: ${contact_details ? contact_details : ''}
      `;
      let contextString =`
      <h3>${name}</h3>
      <h5>${description}</h5>
      <br/>
      <h6>
      <b>Contact Details:</b> ${contact_details ? contact_details : ''}
      </h6>
      `; 

      cardExtra.innerText = row.latitude ? `Lat: ${row.latitude}, Lng: ${row.latitude}`: '';

      cardText.innerText = cardDetails;

      dataView.appendChild(cardClone);

      if (row.latitude) { // make a map out of it as well
        alertsList.push({
          position: {'lat': parseFloat(row.latitude), 'lng': parseFloat(row.longitude)},
          title: `${name}`,
          contextString: contextString
        })
      }
    });

    console.log(alertsList);

    // updateMainMap(alertsList);

    card.style.display = 'none'; // hide template card
    setTimeout(() => loading.style.display = 'none', 1500);

  }

export default function AlertForm({loader}) {

  loader.load().then(() => {
    formMap = new google.maps.Map(document.getElementById("form-map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  });

  function onSubmit() {
    var canvas = document.getElementById('canvas');

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

        const pos = {
          lat: latitude,
          lng: longitude,
        };
        
        const cityCircle = new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: formMap,
          center: pos,
          radius: 20,
        });


        formMap.setCenter(pos);
        document.getElementById("form-map").style.display = 'block';
        document.getElementById("location-btn").disabled = true;

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
      
      <button id="location-btn" onClick="handleLocation" class="mdc-button mdc-button--raised general">
        Add your Location
      </button>
      <br/>
      <div id="form-map">MAP</div>
      <br/>

      <button id="submit-btn" onSubmit="onSubmit" class="mdc-button mdc-button--raised general">
        Report Crime
      </button>
    
      <br/><br/><br/>
    </>
  )
}