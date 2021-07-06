import React from "react";
import { logout, rankList, rankColor } from "../api/api";


export default function Profile({name, image_url, email, rep, coins}) {
    const rankIndex = Math.min(Math.floor(rep / 200), rankList.length-1);
    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <img id="profile-img" src={image_url} alt={name} style={{
          borderColor: rankColor[rankIndex], 
          borderStyle: 'outset',
          borderWidth: '0.36rem'
          }}/><br/>
        <h3>{name}</h3>
        <div>{email}</div>
        <div><b>Rank:</b> {rankList[rankIndex]}</div>
        <div><b>Reputation:</b> {rep}</div>
        <div><b>Coins:</b> {coins}</div>
        <br/>
        <button style={{marginLeft: 15}} onClick={logout} className="mdc-button mdc-button--raised general">Logout</button>
      </div>
    );
}