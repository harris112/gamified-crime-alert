import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../api/api";
import Swal from "sweetalert2";

export default function Login({user}) {
  
    if (user != null) {
      return <div>Already logged in.</div>;
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
      <div className="login-main-container">
        <div className="container" id="login-input-container">
          <p>Welcome Back!</p>
          <div className="formik">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email address")
                  .required("An email address is required"),
                password: Yup.string().required("Password is required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  login(values.email, values.password)
                    .then((user) => {
                      setSubmitting(false);
                      Toast.fire({
                        icon: 'success',
                        title: 'Signed in successfully'
                      })
                      // Redirect using html for page refresh
                      setTimeout(() => {
                        window.location.replace("#home");
                      }, 1500);
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      Swal.fire({
                        title: "Invalid Login",
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
                    <small className="form-text text-muted">
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
                      : "Login"}
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