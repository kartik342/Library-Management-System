import React, { useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, resetAuthSlice } from "../store/slices/authSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";


const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector((state) => state.auth);

  const navigateTo = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault(); 

    if (!name || !email || !password) {
      toast.error("Please enter all fields");
      return;
    }
  
    // console.log("name:", name);
    // console.log("email:", email);
    // console.log("password:", password);
    
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);

    

    dispatch(register(data));
  }

//   useEffect(() => {
//   console.log(error);

//   if (error) {
//     toast.error(error);
//     dispatch(resetAuthSlice());
//   }
// }, [error]);

  useEffect(()=>{
    if(message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigateTo(`/otp-verification/${email}`);
    }
    if(error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [loading, error, message, email, isAuthenticated, dispatch]);

  if(isAuthenticated) {
    return <Navigate to={"/"}/>;
  }


  return <>
  
    <div className="flex flex-col justify-center md:flex-row h-screen">
      
      {/* Left Side */}

      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[90px] rounded-br-[90px]">
        <div className="text-center h-[376px]">

          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="Logo with title"  className="mb-12 h-44 w-auto"/>
          </div>

          <p className="text-gray-300 mb-12">Already have an account? Sign In</p>
          <Link to="/login" className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition">SIGN IN</Link>

        </div>

      </div>


      {/* Right Side  */}

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">

        <div className="w-full max-w-sm">

          <div className="flex justify-center mb-12">
            
            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">

              <h3 className="font-medium text-4xl overflow-hidden">Sign Up</h3>
              <img src={logo} alt="Logo" className="h-auto w-24 object-cover"/>

            </div>

          </div>

          <p className="text-gray-800 text-center mb-12">Please provide your details to Sign Up</p>
          
          <form onSubmit={handleRegister}>

            <div className="mb-2">
              <input type="text" 
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder="Full name"
                     className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>

            <div className="mb-2">
              <input type="email" 
                     autoComplete="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="Email"
                     className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>

            <div className="mb-2">
              <input type="password" 
                     autoComplete="new-password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Password"
                     className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>

            <div>

              <p>Already have an account? 
                <Link to="/login" className="text-md text-gray-500 hover:underline"> Sign In</Link>
              </p>

            </div>

            <button type="submit" className="border-2 border-black rounded-lg mt-5 w-full font-semibold bg-black text-white py-2 hover:bg-white hover:text-black">SIGN UP</button>

          </form>


        </div>

      </div>


    </div>
  </>;
};

export default Register;
