import React, { useEffect, useState } from 'react';
import { postComment, upvoteAlert, downvoteAlert, downvoteFromUpvoteAlert, upvoteFromDownvoteAlert, removeDownvote, removeUpvote } from '../api/api';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Alert({id, title, post_time, votes, contact, description, user_uid, uid, comments, uname, ucolor, location, upvoted, downvoted}) {
  const [upvotedState, setUpvotedState] = useState(upvoted);
  const [downvotedState, setDownvotedState] = useState(downvoted);
  const [votesState, setVotesState] = useState(votes);
  const [commentsOpen, setCommentsOpen] = useState(false);
  
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
    <>
    <div className="card" >
      <div className="card-body">
        <h6 className="card-subtitle2" style={{color: ucolor}}>{uname}</h6>
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

        &nbsp;&nbsp;
        <button id="comment-btn" onClick={() => setCommentsOpen(!commentsOpen)} class={commentsOpen ? "stat-item-marked" : "stat-item"}> <i class="fa fa-comments icon"></i></button>
      </div>
    </div>
      <div className="comments-list">
        {
          commentsOpen &&
          comments.map(({description, post_time, uid, uname, ucolor}) => {
            return (
            <div className="comment-body">
              <h6 className="comment-name" style={{color: ucolor}} >{uname}</h6>
              <h6 className="comment-time" >{post_time}</h6>
              <h5 className="comment-desc">{description}</h5>
            </div>
            );
          })
        }
      {
        commentsOpen &&
        <Formik
          initialValues={{ comment: "" }}
          validationSchema={Yup.object({
            comment: Yup.string(),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              postComment(id, uid, values.comment)
                .then((res) => {
                  setSubmitting(false);
                })
                .catch((error) => {
                  setSubmitting(false);
                });
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <div className="row">

                <div className="col-sm-8 form-group">
                  <small>
                    Comment
                  </small>
                  <Field
                    type="text"
                    name="comment"
                    placeholder="Enter your comment here"
                    className={`form-control ${
                      touched.comment && errors.comment ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="comment"
                    className="invalid-feedback"
                  />
                </div>

                <br/>
                <button type="submit" className="col-sm-2 comment-submit mdc-button mdc-button--raised general" disabled={isSubmitting}
                >
                  {isSubmitting ? 
                    <div id="login-spinner" className="spinner-border" role="status"></div>
                    : "Post"}
                </button>
              </div>

              
            </Form>
          )}
        </Formik>
      }
      </div>

    </>
  )
}