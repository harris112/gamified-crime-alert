//Defining the data base
var db = new Dexie("item_database");
db.version(1).stores({
  alerts: 'name, description, contact_details, latitude, longitude'
});

//clear the tables when page loads
db.version(2).stores({
  alerts: 'name, description, contact_details, latitude, longitude'
});

function clearDB() {
  db.alerts.clear();
  location.reload();
}