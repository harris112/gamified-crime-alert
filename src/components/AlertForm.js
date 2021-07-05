import React, {useState, useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MapComponent } from './MapComponent';
import { submitAlert } from '../api/api';
import Swal from "sweetalert2";
import Toast from './Toast';

export default function AlertForm({loader}) {

  function handleLocation() {
    if('geolocation' in navigator) {
      function success(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        // const pos = {
        //   lat: latitude,
        //   lng: longitude,
        // };
        
        // const cityCircle = new google.maps.Circle({
        //   strokeColor: "#FF0000",
        //   strokeOpacity: 0.8,
        //   strokeWeight: 2,
        //   fillColor: "#FF0000",
        //   fillOpacity: 0.35,
        //   map: formMap,
        //   center: pos,
        //   radius: 20,
        // });


        // formMap.setCenter(pos);
        // document.getElementById("form-map").style.display = 'block';
        // document.getElementById("location-btn").disabled = true;

      }

      function error() {
        alert('Sorry, no position available.');
      }

      navigator.geolocation.watchPosition(success, error, {enableHighAccuracy: false,maximumAge: 100, timeout: 5000 });

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
            name: Yup.string().required("Please give an appropriate title and category to the alert."),
            description: Yup.string().required("A complete description about the crime details and the suspect you witnessed is required."),
            contact: Yup.string().required("Contact details are required for community verification and for the legal enforcement authorities."),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              submitAlert(values.title, values.description, values.contact)
                .then((user) => {
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

              
              <div className="form-group">
                <button id="location-btn" onClick={handleLocation} class="mdc-button mdc-button--raised general">
                  <small> Add Location </small>
                </button>
                
                <MapComponent 
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0xyzKTLq5StKvjNC5HIuHTJRgeaz9uck&libraries=places&v=weekly"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                />
              </div>


              <br/>
              <button
                type="submit"
                className="mdc-button mdc-button--raised general"
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  <div id="login-spinner" className="spinner-border" role="status"></div>
                  : "Register"}
              </button>

              
            </Form>
          )}
        </Formik>
      </div>
      </div>
    </>
  )
}