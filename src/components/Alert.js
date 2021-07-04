import React from 'react';

export default function Alert({uid, name, postTime, description, imageUrl, contact}) {
  return (
    <div class="card" >
      <div class="card-body">
        <h5 class="card-title">{name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{postTime}</h6>
        <img class="card-img" src={imageUrl}/>
        <p class="card-text">{description}</p>
        <div class="card-extra">{contact}</div>
      </div>
    </div>
  )
}