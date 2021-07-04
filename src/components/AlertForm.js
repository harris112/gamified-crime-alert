import React, {useState, useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MapComponent } from './MapComponent';
import { submitAlert } from '../api/api';
import Swal from "sweetalert2";


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

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  return (
    <>
      <Formik
        initialValues={{ title: "", description: "", contact: "" }}
        validationSchema={Yup.object({
          title: Yup.string().required("A title is required"),
          description: Yup.string().required("A description is required"),
          contact: Yup.string(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            submitAlert(values)
              .then((user) => {
                setSubmitting(false);
                Toast.fire({
                  icon: 'success',
                  title: 'Submitted the crime alert successfully.'
                })
                setTimeout(() => {
                  window.location.replace("#home");
                }, 1500);
              })
              .catch((error) => {
                setSubmitting(false);
                Swal.fire({
                  title: "Unable to submit the alert.",
                  text: error.message,
                  icon: "error",
                  timer: 2500
                })
              });
          }, 400);
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <small className="form-text text-muted">
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
            
            <br/>
            
            <div className="form-group">
              <small className="form-text text-muted">
                Contact
              </small>
              <Field
                type="text"
                name="contact"
                placeholder="Enter contact"
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
            
            <br/>

            <div className="form-group">
              <small className="form-text text-muted">
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

            <br/>
            <button id="location-btn" onClick={handleLocation} class="mdc-button mdc-button--raised general">
              Add your Location
            </button>
            <br/>

            <MapComponent 
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0xyzKTLq5StKvjNC5HIuHTJRgeaz9uck&libraries=places&v=weekly"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            />
            
            <br/>


            <br/>
            <button
              type="submit"
              className="mdc-button mdc-button--raised general"
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                : "Report Crime"}
            </button>

            
          </Form>
        )}
      </Formik>
    </>
  )
}