import React from 'react';

export default function Home() {
  return (
    <>
      <h1>Gamified Crime Alert</h1>
      <button class="mdc-button mdc-button--raised general">
      <a data-toggle="tab" href="#locate">
        View Crime Alerts Log
      </a>
      </button>

      <button class="mdc-button mdc-button--raised general">
      <a data-toggle="tab" href="#form">
        Report a Crime
      </a>
      </button>
    </>
  )
}