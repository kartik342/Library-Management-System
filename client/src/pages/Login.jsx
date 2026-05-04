import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { login, resetAuthSlice } from "../store/slices/authSlice";
const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector((state) => state.auth);

  const handlelogin = (e) =>{
    e.preventDefault();

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    dispatch(login(data));
  }

  useEffect(()=>{
      if(message) {
        toast.success(message);
        dispatch(resetAuthSlice());
      }
      if(error) {
        toast.error(error);
        dispatch(resetAuthSlice());
      }
  }, [loading, error, isAuthenticated, dispatch]);


  if(isAuthenticated) {
    return <Navigate to={"/"}/>;
  }

  return <>
  
    <div className="flex flex-col justify-center md:flex-row h-screen">
      
      {/* LEFT SIDE  */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-8 relative">
        
        <div className="max-w-sm w-full">
          <div className="flex justify-center mb-12">

            <div className="flex justify-center items-center rounded-full">
              <img src={logo} alt="logo" className="h-24 w-auto"/>
            </div>

          </div>

          <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">Welcome Back!!</h1>
          <p className="text-gray-800 text-center mb-12">Please enter your credentials to login</p>

          <form onSubmit={handlelogin}>

            <div className="mb-4">
              <input 
                type="email" 
                autoComplete="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <input 
                type="password" 
                autoComplete="current-password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>

            <Link to='/password/forgot' className="font-semibold text-black mb-12">Forgot Password?</Link>

            <div className="block md:hidden font-semibold mt-5">
              <p>New to out Platform? <Link to='/register' className="text-sm text-gray-500 hover:underline">Sign Up</Link></p>
            </div>

            <button type="submit" className="border-2 border-black rounded-lg mt-5 w-full font-semibold bg-black text-white py-2 hover:bg-white hover:text-black transition ">SIGN IN</button>
          </form>

        </div>

      </div>

     

      {/* RIGHT SIDE  */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[90px] rounded-bl-[90px]">
        <div className="text-center h-[400px]">
          <div className="flex justify-center mb-12">
            
            <img src={logo_with_title} alt="logo_with_title" className="mb-12 h-44 w-auto"/>

          </div>

          <p className="text-gray-300 mb-12">New to our Platform? Sign Up Now</p>
          <Link to='/register' className="border-2 border-white rounded-lg mt-5 w-full font-semibold bg-black text-white py-2 px-8 hover:bg-white hover:text-black transition">SIGN UP</Link>

        </div>
      </div>
    </div>
  </>;
};

export default Login;
