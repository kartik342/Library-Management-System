import React, { useEffect } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useSelector, useDispatch } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { useState } from "react";

const Header = () => {

  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  // console.log("user in header", user);

  const[currentTime, setCurrentTime] = useState("");
  const[currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    }

    updateDateTime(); // Initial call to set the time immediately
    const intervalId = setInterval(updateDateTime, 1000); // Update every second -> this code runs every second to update the time and date in the header.

    return () => clearInterval(intervalId); // Cleanup the interval when component unmounted -> React itself tracks when a component is removed (unmounted) When that happens, React automatically calls the cleanup function you returned from useEffect
      
  }, []);

  return <>
    
    <header className="absolute top-0 left-0 md:left-64 right-0 bg-white py-4 px-6 shadow-md flex justify-between items-center">      
      
      {/* Left Side  */}
      <div className="flex items-center gap-2">

        <img src={userIcon} alt="userIcon" className="w-8 h-8" />

        <div className="flex flex-col">

          <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">{user?.name}</span>
          <span className="text-sm font-medium sm:text-lg sm:font-semibold">{user?.role}</span>
          {/* <span>Kartik</span>
          <span>User</span> */}
        
        </div>

      </div>
 
      {/* Right Side  */}
      <div className="hidden md:flex items-center gap-2">

        <div className="flex flex-col text-sm lg:text-base items-end font-semibold">
          <span>{currentTime}</span>
          <span>{currentDate}</span>
        </div>

        <span className="bg-black h-14 w-[2px]"/>

        <img 
          src={settingIcon} 
          alt="settingIcon" 
          className="w-8 h-8 hover:cursor-pointer" 
          onClick={()=>dispatch(toggleSettingPopup())}/>
      </div>

    </header>
  </>;
};

export default Header;
