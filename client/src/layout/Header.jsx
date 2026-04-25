import React, { useEffect } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {

  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);

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

  return <></>;
};

export default Header;
