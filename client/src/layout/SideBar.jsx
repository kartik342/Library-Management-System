import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"
import { resetAuthSlice } from "../store/slices/authSlice";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {

  const dispatch = useDispatch();
  // const {} = useSelector((state) => state.popup);
  const {loading, error, message, user, isAuthenticated} = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  }

  useEffect(() => {
    if(error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if(message){  
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [error, message, isAuthenticated, loading, dispatch]); // if any of these changes, then the useEffect code will run.

  return (
    <>
      
      <aside className={`${isSideBarOpen ? "left-0" : "-left-full"} z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-white flex-col h-full`}
      style={{position: "fixed"}}
      >

        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo"/>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          
          <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={()=>setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>

          <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={()=>setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>
          
          {
            isAuthenticated && user?.role === "Admin" && (
              <>
                
                <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  onClick={()=>setSelectedComponent("Catalog")}
                >
                  <img src={catalogIcon} alt="icon" />
                  <span>Catalog</span>
                </button>


                <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  onClick={()=>setSelectedComponent("Users")}
                >
                  <img src={usersIcon} alt="icon" />
                  <span>Users</span>
                </button>
                

                <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  // onClick={()=>setSelectedComponent("Users")}
                >
                  {/* <img src={usersIcon} alt="icon" /> */}
                  <RiAdminFill className="w-6 h-6"/>
                  <span>Add New Admin</span>
                </button>
                
              </>
            )
          }


        </nav>
      </aside>
    </>
  );
};

export default SideBar;
