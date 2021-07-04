let formMap;
let mainMap;
let latitude;
let longitude;
const SEARCH_RADIUS = 5000;
const SEARCH_API_KEY = 'AIzaSyBTNTN8EvimWfGlpJD8igJYdwtuE8w75NU';

function initMap() {
  formMap = new google.maps.Map(document.getElementById("form-map"), {
    center: { lat: 41.86980309859628, lng: -87.64944472365393 },
    zoom: 15,
    mapTypeId: "terrain",
  });

  mainMap = new google.maps.Map(document.getElementById("main-map"), {
    center: { lat: 41.86980309859628, lng: -87.64944472365393 },
    zoom: 15,
    mapTypeId: "terrain",
  });

  updateData();
}


function updateMainMap(alertsList) {

  const status = document.querySelector("#status");

  // console.log("populating the main map with", alertsList);

  last_pos = -1;

  if (alertsList.length == 0) {
    // status.innerText = "No alerts to populate the map.";  
    // setTimeout(() => status.style.display = "none", 10000);
  }
  else {  

    alertsList.forEach( item => {

      const infowindow = new google.maps.InfoWindow({
        content: contentString = item.contextString
      });

      last_pos = item.position;
      const marker = new google.maps.Marker({
        position: item.position,
        map: mainMap,
        title: item.title
      });

      marker.addListener("click", () => {
        infowindow.open(mainMap, marker);
      });
    });

    if (last_pos != -1) {
      mainMap.setCenter(last_pos);

      var mapCenter = new google.maps.LatLng(last_pos.lat, last_pos.lng);
      // using google place nearby search api to get all police stations 5000 radius around map center
      var request = {
        location: mapCenter,
        radius: '10000',
        type: ['police']
      };

      service = new google.maps.places.PlacesService(mainMap);
      service.nearbySearch(request, fetchPoliceStations); // callback
    }

  }

}

function fetchPoliceStations(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {

    results.forEach(item => {

      const infowindow = new google.maps.InfoWindow({
        content: contentString = `<h3>${item.name}</h3>
        <h5>${item.business_status}</h5>
        <h6>Rating: ${item.rating}</h6>`
      });

      const marker = new google.maps.Marker({
        position: item.geometry.location,
        map: mainMap,
        title: item.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });

      marker.addListener("click", () => {
        infowindow.open(mainMap, marker);
      });

    });
  
  }
}

async function updateData() {
  const card = document.querySelector(".card");
  const loading = document.querySelector("#loading");
  const dataView = document.querySelector("#data");
  const status = document.querySelector("#status");

  card.style.display = 'block'; 
  loading.style.display = 'block';
  dataView.innerHTML = "";
  
  const data = await db.alerts.toArray();

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

  updateMainMap(alertsList);

  card.style.display = 'none'; // hide template card
  setTimeout(() => loading.style.display = 'none', 1500);

}


document.querySelector("#submit-btn").addEventListener("click", async (e) => {
  var canvas = document.getElementById('canvas');
  document.querySelector("#status").innerText = "submitting criminal report...";
  document.querySelector("#status").style.display = "block";
  
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

  record = {...form_data,  latitude: latitude, longitude: longitude}

  
  console.log(record);

  // db.alerts.add(record)
  // .then(() => {
  //   console.log("Saved to DB.")
  //   updateData();
  // })

  // let dbc = await db.alerts.count();

  document.querySelector("#submit-btn").disabled = true;
  setTimeout(() => document.querySelector("#submit-btn").disabled = false, 3000);
});

document.querySelector("#location-btn").addEventListener("click", async (e) => {

  if('geolocation' in navigator) {
    function success(position) {
      console.log("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
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

});

