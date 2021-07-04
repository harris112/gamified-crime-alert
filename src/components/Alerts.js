import React from 'react';

export default function Alerts() {
  return (
    <>
      <div class="card" >
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <img class="card-img" src="https://i.stack.imgur.com/y9DpT.jpg" />
          <p class="card-text">Card text</p>
          <div class="card-extra">Card extra</div>
        </div>
      </div>

      <div id="loading">
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
          </div>
        </div>
      </div>

      <div id="data"></div>
    </>
  )
}