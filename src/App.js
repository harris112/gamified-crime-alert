import React, {useState, useEffect} from 'react';
import './App.css';
import Home from './components/Home';
import AlertView from './components/AlertView';
import Map from './components/Map';
import AlertForm from './components/AlertForm';
import Login from './components/Login';
import { getLoggedInUser, getUserDetails } from "./api/api";


function App() {
  const [authStatusLoaded, setAuthStatusLoaded] = useState(false); // used to wait if any user is logged in
  const [user, setUser] = useState(null);

  // Setting user state if user logged in.
  useEffect(() => {
    getLoggedInUser()
      .then(async (user) => {
        // Setting user type
        let details;
        details = await getUserDetails(user.uid);
        setUser({ ...user, details });
        setAuthStatusLoaded(true);
      })
      .catch(() => {
        setUser(null);
        setAuthStatusLoaded(true);
      });
  }, []);

  // if authentication has not been loaded yet
  if (!authStatusLoaded) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
        <a class="navbar-brand" href="#home">Gamified Crime Alert Portal</a>
        <button class="navbar-toggler" type="button" data-target="#collapsibleNavbar" data-toggle="collapse">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
          <ul class="nav nav-tabs navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" data-toggle="tab" href="#home">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#login">Login</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#form">Report a Crime</a>
            </li>
            <li class="nav-item">
              <a class="nav-link"data-toggle="tab" href="#view">View Crime Log</a>
            </li>
            <li class="nav-item">
              <a class="nav-link"data-toggle="tab" href="#locate">Locate</a>
            </li>    
          </ul>
      </div>  
    </nav>

    <div class="tab-content container" id="main">

      <div id="home" class="tab-pane fade in active show">
        <Home user={user}/>
      </div>

      <div id="login" class="tab-pane fade">
        <Login user={user}/>
      </div>

      {/* <div id="register" class="tab-pane fade in active show">
        <Register user={user}/>
      </div> */}
      
      <div id="view" class="tab-pane fade">
        <AlertView user={user}/>
      </div>

      <div id="locate" class="tab-pane fade">
        <Map user={user}/>
      </div>

      <div id="form" class="tab-pane fade">
        <AlertForm user={user}/>
      </div>

    </div>

    </div>
  );
}

export default App;