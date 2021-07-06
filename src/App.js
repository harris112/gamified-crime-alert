import React, {useState, useEffect} from 'react';
import './App.css';
import Home from './components/Home';
import AlertView from './components/AlertView';
import Map from './components/Map';
import AlertForm from './components/AlertForm';
import Login from './components/Login';
import Register from './components/Register';
import Shop from './components/Shop';
import { getLoggedInUser, getUserDetails, getAllAlerts } from "./api/api";


function App() {
  const [authStatusLoaded, setAuthStatusLoaded] = useState(false); // used to wait if any user is logged in
  const [user, setUser] = useState(null);
  const [alertsList, setAlertList] = useState([]);
  const [loading, setLoading] = useState(true);


  // Setting user state if user logged in.
  useEffect(() => {
    getLoggedInUser()
      .then(async (user) => {
        let details = await getUserDetails(user.uid);
        setUser({ ...user, ...details });
        setAuthStatusLoaded(true);
      })
      .catch(() => {
        setUser(null);
        setAuthStatusLoaded(true);
      });
    
    getAllAlerts()
    .then(async (alertDocs) => {
        setAlertList(alertDocs);
        setLoading(false);
      })
      .catch(() => {
        setAlertList([]);
        setLoading(false);
      });
  }, []);

  // if authentication has not been loaded yet
  if (!authStatusLoaded) {
    return (
      <div id="loading-spinner" className="spinner-border" role="status"></div>
    );
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
        <a className="navbar-brand title-text" href="#home">Crime Fighters</a>
        <button className="navbar-toggler" type="button" data-target="#collapsibleNavbar" data-toggle="collapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="nav nav-tabs navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" data-toggle="tab" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#login">{user == null ? "Login" : "Profile"}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#form">Report a Crime</a>
            </li>
            <li className="nav-item">
              <a className="nav-link"data-toggle="tab" href="#view">View Crime Log</a>
            </li>
            <li className="nav-item">
              <a className="nav-link"data-toggle="tab" href="#locate">Locate</a>
            </li>    
            <li className="nav-item">
              <a className="nav-link"data-toggle="tab" href="#shop">Shop</a>
            </li>   
          </ul>
      </div>  
    </nav>

    <div className="tab-content container" id="main">

      <div id="home" className="tab-pane fade in active show">
        <Home user={user}/>
      </div>

      <div id="login" className="tab-pane fade">
        <Login user={user}/>
      </div>

      <div id="register" className="tab-pane fade">
        <Register user={user}/>
      </div>

      <div id="view" className="tab-pane fade">
        <AlertView user={user} alertsList={alertsList} loading={loading}/>
      </div>

      <div id="locate" className="tab-pane fade">
        <Map user={user} alertsList={alertsList} loading={loading}/>
      </div>

      <div id="form" className="tab-pane fade">
        <AlertForm user={user}/>
      </div>

      <div id="shop" className="tab-pane fade">
        <Shop user={user}/>
      </div>


    </div>

    </div>
  );
}

export default App;