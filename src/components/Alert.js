import React from 'react';

export default function Alert({uid, name, postTime, description, imageUrl, contact}) {
  return (
    <div className="card" >
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{postTime}</h6>
        <img className="card-img" src={imageUrl}/>
        <p className="card-text">{description}</p>
        <div className="card-extra">{contact}</div>
      </div>
    </div>
  )
}