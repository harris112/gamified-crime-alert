import React from 'react';

export default function Home() {
  return (
    <>
      <h1 className="title-text">CRIME FIGHTERS</h1>
      <h4>Take justice in your own hands.</h4>
      
      <div style={{marginTop: 20}}></div>
      <button className="mdc-button mdc-button--raised general">
      <a data-toggle="tab" href="#view">
        View Crime Alerts
      </a>
      </button>

      <button className="mdc-button mdc-button--raised general">
      <a data-toggle="tab" href="#form">
        Report a Crime
      </a>
      </button>

      <div style={{marginTop: 30}}></div>
      <img width="340px" height="200px" src="https://pngimg.com/uploads/handcuffs/handcuffs_PNG33.png" alt="logo"/>
      <div style={{marginTop: 20}}></div>
      
      <h6>Join our gamified crime alert community today.</h6>
      <button className="mdc-button mdc-button--raised general">
      <a data-toggle="tab" href="#register">
        Register Now
      </a>
      </button>

    </>
  )
}