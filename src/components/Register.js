import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register } from "../api/api";
import Profile from './Profile';
import Swal from "sweetalert2";
import Toast from './Toast';

export default function Register({user}) {
    
    if (user != null) {
      return (
        <Profile 
        name={user.name}
        rank={user.rank}
        rep={user.rep}
        coins={user.coins}
        email={user.email}
        image_url={user.image_url}/>
      );
    }

    return (
      <div>
        <div className="container">
          <h3>Join us today!</h3>
          <div className="formik">
            <Formik
              initialValues={{ email: "", password: "", name: "", image_url: "" }}
              validationSchema={Yup.object({
                email: Yup.string().email("Invalid email address").required("An email address is required."),
                password: Yup.string().required("A password is required."),
                name: Yup.string().required("Please enter your full name."),
                image_url: Yup.string().required("A valid image URL is required for your display picture.")
              })}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  register(values.email, values.password, values.name, values.image_url)
                    .then((user) => {
                      setSubmitting(false);
                      Toast.fire({
                        icon: 'success',
                        title: 'Registered successfully. Please proceed to login.'
                      })
                      // Redirect using html for page refresh
                      setTimeout(() => {
                        window.location.replace("#login");
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
                      Name
                    </small>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter name"
                      className={`form-control ${
                        touched.name && errors.name ? "is-invalid" : ""
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="name"
                      className="invalid-feedback"
                    />
                  </div>
  
                  <div className="form-group">
                    <small>
                      Email
                    </small>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      className={`form-control ${
                        touched.email && errors.email ? "is-invalid" : ""
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="email"
                      className="invalid-feedback"
                    />
                  </div>
  
                  <div className="form-group">
                    <small>
                      Password
                    </small>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      className={`form-control ${
                        touched.password && errors.password ? "is-invalid" : ""
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="password"
                      className="invalid-feedback"
                    />
                  </div>

                  

                  <div className="form-group">
                    <small>
                      Display Image URL
                    </small>
                    <Field
                      type="text"
                      name="image_url"
                      placeholder="Enter an image URL for your display picture hosted online"
                      className={`form-control ${
                        touched.image_url && errors.image_url ? "is-invalid" : ""
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="image_url"
                      className="invalid-feedback"
                    />
                  </div>
  

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
          <br/>
        </div>
      </div>
    );
  }