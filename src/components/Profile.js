import React from "react";
import { logout } from "../api/api";

export default function Profile({name, image_url, email, rank, rep, coins}) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <img id="profile-img" src={image_url} alt={name}/><br/>
        <h3>{name}</h3>
        <div>{email}</div>
        <div><b>Rank:</b> {rank}</div>
        <div><b>Reputation:</b> {rep}</div>
        <div><b>Coins:</b> {coins}</div>
        <br/>
        <button style={{marginLeft: 15}} onClick={logout} className="mdc-button mdc-button--raised general">Logout</button>
      </div>
    );
}