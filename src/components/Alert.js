import React, { useEffect, useState } from 'react';
import { upvoteAlert, downvoteAlert, downvoteFromUpvoteAlert, upvoteFromDownvoteAlert, removeDownvote, removeUpvote } from '../api/api';

export default function Alert({id, title, post_time, votes, contact, description, user_uid, uid, location, upvoted, downvoted}) {
  const [upvotedState, setUpvotedState] = useState(upvoted);
  const [downvotedState, setDownvotedState] = useState(downvoted);
  const [votesState, setVotesState] = useState(votes);
  
  useEffect(() => {
    setUpvotedState(upvoted);
    setDownvotedState(downvoted);
    setVotesState(votes);
  }, [upvoted, downvoted, votes]);

  function handleUpvote() {
    if (!upvotedState) {
      if (downvotedState) {
        upvoteFromDownvoteAlert(id, user_uid);
        setVotesState(votesState+2);
      }
      else {
        upvoteAlert(id, user_uid);
        setVotesState(votesState+1);
      }
      setUpvotedState(true);
      setDownvotedState(false);
    }
    else { //unvote
      removeUpvote(id, user_uid);
      setVotesState(votesState-1);
      setUpvotedState(false);
    }
  }

  function handleDownvote() {
    if (!downvotedState) {
      if (upvotedState) {
        downvoteFromUpvoteAlert(id, user_uid);
        setVotesState(votesState-2);
      }
      else {
        downvoteAlert(id, user_uid);
        setVotesState(votesState-1);
      }
      setDownvotedState(true);
      setUpvotedState(false);
    }
    else { //unvote
      removeDownvote(id, user_uid);
      setVotesState(votesState+1);
      setDownvotedState(false);
    }
  }

  return (
    <div className="card" >
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle">{post_time}</h6>
        <p className="card-text">{description}</p>
        <div className="card-minor">
          <div className="card-extra">{contact}</div>
          {
            location != null &&
            <div className="card-loc">{location.latitude}, {location.longitude}</div>
          }
        </div>
        <button onClick={handleUpvote} class={upvotedState === true ? "stat-item-marked" : "stat-item"}> <i class="fa fa-thumbs-up icon"></i></button> &nbsp;{votesState}&nbsp;&nbsp;
        <button onClick={handleDownvote} class={downvotedState === true ? "stat-item-marked" : "stat-item"}> <i class="fa fa-thumbs-down icon"></i></button>
      </div>
    </div>
  )
}