import React from 'react';
import './App.css';
import Home from './components/Home';
import Alerts from './components/Alerts';
import Map from './components/Map';
import AlertForm from './components/Form';


function App() {
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
       <Home/>
      </div>
      
      <div id="view" class="tab-pane fade">
        <Alerts/>
      </div>

      <div id="locate" class="tab-pane fade">
        <Map/>
      </div>

      <div id="form" class="tab-pane fade">
        <AlertForm/>
      </div>

    <script src="main.js"></script>
    </div>

    </div>
  );
}

export default App;