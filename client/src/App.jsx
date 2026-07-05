import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";
import logo from "./assets/black-logo.png";
import { ToastContainer } from "react-toastify";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchAllBorrowedBooks, fetchUserBorrowedBooks } from "./store/slices/borrowSlice";


const App = () => {

  const {user, isAuthenticated} = useSelector((state) => state.auth);

  const { isCheckingAuth } = useSelector((state) => state.auth);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src={logo} alt="Loading" className="w-28 animate-pulse" />
      </div>
    );
  }

  const dispatch = useDispatch();

  // 1. Load user once
  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchAllBooks());
  }, [dispatch]);

// 2. Fetch users AFTER user is ready
useEffect(() => {
  if (isAuthenticated && user?.role === "User") {
    dispatch(fetchUserBorrowedBooks());
  }
  if (isAuthenticated && user?.role === "Admin") {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBorrowedBooks());
  }
}, [user?.role, dispatch]); // when the app component mounts, it dispatches the getUser action to fetch the current user's information. If the user is authenticated and has the role of "Admin", it also dispatches the fetchAllUsers action to retrieve a list of all users for the admin dashboard.

  return <Router>
    <Routes>
      {/* Define your routes here */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/otp-verification/:email" element={<OTP />} />
      <Route path="/password/reset/:token" element={<ResetPassword  />} />
    </Routes>

    <ToastContainer theme="dark"/>
  </Router>;
};

export default App;
