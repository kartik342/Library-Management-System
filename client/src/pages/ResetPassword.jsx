import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetPassword, resetAuthSlice } from "../store/slices/authSlice";

const ResetPassword = () => {

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const { token } = useParams();

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector((state) => state.auth);

  const handleResetPassword = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(formData, token));
  };

  useEffect(()=>{
      if(message) {
        toast.success(message);
        dispatch(resetAuthSlice());
      }
      if(error) {
        toast.error(error);
        dispatch(resetAuthSlice());
      }
  }, [loading, error, message, isAuthenticated, dispatch]);
  
  if(isAuthenticated) {
    return <Navigate to={"/"}/>;
  }



  return <>
  
  <div className="flex flex-col justify-center md:flex-row h-screen">
    
    {/* LEFT SIDE  */}
    <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[90px] rounded-br-[90px]">

      <div className="text-center h-[450px]">
        <div className="flex justify-center mb-12">
          <img src={logo_with_title} alt="Logo with Title" className="h-44 w-auto mb-12" />
        </div>
        <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl font-medium  leading-10">"Your premier digital library for borrowing and reading books"</h3>
      </div>

    </div>

    {/* RIGHT SIDE  */}
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          
      <Link to='/password/forgot' className="border-2 border-white text-white rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-white hover:text-black transition duration-300 text-end">Back</Link>

      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-12">
          <div className="rounded-full flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-24 w-auto" />
          </div>
        </div>

        <h1 className="text-4xl font-medium text-center mb-5 overflow-hidden">Reset Password</h1>
        <p className="text-gray-800 text-center mb-12">Please enter your new password</p>

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <input 
              type="password" 
              autoComplete="new-password"
              required // this will prevent form submission if the field is empty
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-black rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <input 
              type="password" 
              autoComplete="new-password"
              required // this will prevent form submission if the field is empty
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-black rounded-md focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="border-2 border-black rounded-lg mt-5 w-full font-semibold bg-black text-white py-2 hover:bg-white hover:text-black transition " 
            disabled={ loading }
            >
              Reset Password
            </button>
        </form>
      </div>

    </div>
  </div>
  
  </>;
};

export default ResetPassword;
