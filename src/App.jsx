import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from './components/authComponent/AuthForm'
import Layout from "./Layout";
import PublicRoute from './components/authComponent/privateRoute/PublicRoute';
import PrivateRoute from './components/authComponent/privateRoute/PrivateRoute';
import Home from './components/dashboard/Home';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AuthForm />
                </PublicRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
