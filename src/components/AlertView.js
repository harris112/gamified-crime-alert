import React from 'react';
import Alert from './Alert';


export default function AlertView({alertsList}) {

  return (
    <>
      <Alert 
      name="Assault"
      postTime="07/04/2021"
      contact="12345678"
      description="Suspect found."
      imageUrl="https://i.stack.imgur.com/y9DpT.jpg"
      />

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