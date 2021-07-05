import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../api/api";
import Profile from './Profile';
import Swal from "sweetalert2";
import Toast from './Toast';

export default function Login({user}) {
    
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
          <h3>Welcome Back!</h3>
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
                        title: 'Signed in successfully.'
                      })
                      // Redirect using html for page refresh
                      setTimeout(() => {
                        window.location.reload();
                      }, 1500);
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      Swal.fire({
                        title: "Invalid login details. Please try again.",
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

                  <br/>
                  <button
                    type="submit"
                    className="mdc-button mdc-button--raised general"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 
                      <div id="login-spinner" className="spinner-border" role="status"></div>
                      : "Login"}
                  </button>

                 
                </Form>
              )}
            </Formik>

          </div>
          <br/>
          <h6>New user? Join our gamified crime alert community today.</h6>
            <button className="mdc-button mdc-button--raised general">
            <a data-toggle="tab" href="#register">Register</a>
            </button>

        </div>
      </div>
    );
  }