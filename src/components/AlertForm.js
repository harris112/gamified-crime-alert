import React, {useState, useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MapComponent } from './MapComponents';
import { submitAlert } from '../api/api';
import Swal from "sweetalert2";
import Toast from './Toast';
import firebase from "firebase/app";


export default function AlertForm({user}) {
  const [location, setLocation] = useState(null);

  function handleLocation() {
    if('geolocation' in navigator) {
      function success(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        
        const gp = new firebase.firestore.GeoPoint(lat, lng);
        setLocation(gp);
      }

      function error() {
        alert('Sorry, no position available.');
      }
      navigator.geolocation.getCurrentPosition(success, error);
    } 
    else {
      alert("getCurrentPosition Error");
    }
  }

  return (
    <>
      <div className="container">
      <h3>Report a Crime</h3>
      <p>When a criminal activity is suspected, members are encouraged to report to authorities, and not to intervene. <br/><i>Any false reports will be downvoted and bad reputation can lead to an account ban so please refrain from such activity.</i></p>
      <div className="formik">
        <Formik
          initialValues={{ title: "", description: "", contact: ""}}
          validationSchema={Yup.object({
            title: Yup.string().required("Please give an appropriate title and category to the alert."),
            description: Yup.string().required("A complete description about the crime details and the suspect you witnessed is required."),
            contact: Yup.string().required("Contact details are required for community verification and for the legal enforcement authorities."),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              const alertData = {
                title: values.title, 
                description: values.description, 
                contact: values.contact, 
                post_time: new Date().toLocaleString(),
                uid: user.uid,
                votes: 0,
                location: location
                };

              console.log(alertData);
              submitAlert(user.uid, alertData)
                .then((res) => {
                  setSubmitting(false);
                  Toast.fire({
                    icon: 'success',
                    title: 'Submitted the crime alert successfully.'
                  })
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                })
                .catch((error) => {
                  setSubmitting(false);
                  Swal.fire({
                    title: "Invalid details. Please try again.",
                    text: error.message,
                    icon: "error",
                    timer: 2500
                  })
                });
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form className="spaced-form">
              <div className="form-group">
                <small>
                  Title
                </small>
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  className={`form-control ${
                    touched.title && errors.title ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  component="div"
                  name="title"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group">
                <small>
                  Description
                </small>
                <Field
                  type="text"
                  name="description"
                  placeholder="Enter description"
                  className={`form-control ${
                    touched.description && errors.description ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  component="div"
                  name="description"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group">
                <button id="location-btn" onClick={handleLocation} className="mdc-button mdc-button--raised general">
                  <small> Add Location </small>
                </button>
                {
                  location !== undefined && location !== null &&
                  <MapComponent 
                  isMarkerShown
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDljegl-khc3VGfDMlG_2BpPF21jyFy5Ss&libraries=places&v=weekly"
                  location={location}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  />
                }
              </div>

              <div className="form-group">
                <small>
                  Contact
                </small>
                <Field
                  type="text"
                  name="contact"
                  placeholder="Enter contact details"
                  className={`form-control ${
                    touched.contact && errors.contact ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  component="div"
                  name="contact"
                  className="invalid-feedback"
                />
              </div>

              <button type="submit" className="mdc-button mdc-button--raised general" disabled={isSubmitting}>
                {isSubmitting ? 
                  <div id="login-spinner" className="spinner-border" role="status"></div>
                  : "Report Crime"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      </div>
    </>
  )
}