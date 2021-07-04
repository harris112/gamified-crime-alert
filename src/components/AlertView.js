import React, {useState, useEffect} from 'react';
import Alert from './Alert';


export default function AlertView() {
  let alertsList = [{ title:"Assault", uid:"MHwynXtEP6Sgf2BwIFlBeI29SfD3", postTime:"07/04/2021", contact:"12345678", description:"Suspect found.", imageUrl:"https://i.stack.imgur.com/y9DpT.jpg"}, { title:"Assault", uid:"MHwynXtEP6Sgf2BwIFlBeI29SfD3", postTime:"07/04/2021", contact:"12345678", description:"Suspect found.", imageUrl:"https://i.stack.imgur.com/y9DpT.jpg"} ];

  return (
    <>
      {
        alertsList.length === 0 ? 
        <p>No alerts to display.</p> :
        alertsList.map(({title, postTime, contact, description, imageUrl, uid}) =>
            <Alert 
            title={title}
            uid={uid}
            postTime={postTime}
            contact={contact}
            description={description}
            imageUrl={imageUrl}
            />
        )
      }
      

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