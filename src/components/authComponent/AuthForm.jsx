import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './authForm.css';
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../../redux/authSlice.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Validation schema for both login and registration
const validationSchema = (isRegister) => Yup.object({
  userName: isRegister
    ? Yup.string().required('Username is required')
    : Yup.string(),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: isRegister
    ? Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
    : Yup.string(),
});

const AuthForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth); // Loading state from Redux
  const [isRegister, setIsRegister] = useState(true); // Toggle between register and login forms
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    try {
      let response;
  
      if (isRegister) {
        // Registration process
        response = await dispatch(registerUser(values));
        if (registerUser.fulfilled.match(response)) {
          toast.success('Registration successful! You can now login.');
          setIsRegister(false);
        } else {
          toast.error(response.payload?.msg || "Registration failed");
        }
      } else {
        // Login process
        response = await dispatch(loginUser(values));
        
        if (loginUser.fulfilled.match(response)) {
          toast.success('Login successful!');
          navigate("/"); // Redirect on successful login
        } else {
          toast.error(response.payload?.msg || 'Login failed! Please check your credentials.');
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error(error.message || (isRegister ? "Registration failed" : "Login failed"));
    } finally {
      actions.setSubmitting(false);
    }
  };
  

  return (
    <div className="auth-form-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <Formik
        initialValues={{
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema(isRegister)}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions); // Passing Formik actions to handleSubmit
        }}
      >
        {({ isSubmitting }) => (
          <>
            <Form className="auth-form">
              {isRegister && (
                <div className="form-group">
                  <label htmlFor="userName">Username</label>
                  <Field
                    type="text"
                    name="userName"
                    className="form-control"
                  />
                  <ErrorMessage name="userName" component="div" className="error-message" />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              {isRegister && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                </div>
              )}

              <button type="submit" className="btn" disabled={isSubmitting || loading}>
                {isRegister ? (isSubmitting ? 'Registering...' : 'Register') : (isSubmitting ? 'Logging in...' : 'Login')}
              </button>
            </Form>

            <button
              onClick={() => setIsRegister(!isRegister)}
              className="toggle-btn"
              disabled={isSubmitting || loading}
            >
              {isRegister ? 'Switch to Login' : 'Switch to Register'}
            </button>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AuthForm;
