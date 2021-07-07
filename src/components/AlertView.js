import React, {useState, useEffect} from 'react';
import Alert from './Alert';
import { getAllAlerts } from '../api/api';

export default function AlertView({user, loading, alertsList}) {

  return (
    <>
      <h3>Crime Logs</h3>
      <p>Displaying all posted crime alerts. <i>Be cautious of any fake alerts and report them to us.</i></p>
      {
        user == null ? "Please login to view our alerts."
        : loading ?        
        <div id="loading">
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
            </div>
          </div>
        </div>
        : alertsList.length === 0 ? 
        <p>No alerts to display.</p> :
        alertsList.map(({id, title, post_time, votes, location, contact, description, comments, uid, uname, ucolor}) =>
            <Alert 
            id={id}
            title={title}
            uid={uid}
            uname={uname}
            ucolor={ucolor}
            comments={comments}
            user_uid={user.uid}
            post_time={post_time}
            votes={votes} 
            location={location}
            contact={contact}
            description={description}
            upvoted={user ? user.upvotes_list.includes(id) : false}
            downvoted={user ? user.downvotes_list.includes(id) : false}
            />
        )
      }      
    </>
  )
}